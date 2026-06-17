from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import logging
from werkzeug.utils import secure_filename
import tempfile
import shutil

# Import your existing medical bot functions
from think import analyze_text_query
from vision_analyzer import analyze_image_with_vision
from user_voice import transcribe_with_groq
from assistant_voice import text_to_speech_with_gtts_old

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Check for required API key
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is missing! Please check your .env file.")

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'])

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'temp_uploads'

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configuration
MODEL = "llama-3.1-8b-instant"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process_request():
    """Process medical requests from the frontend"""
    try:
        logging.info("Processing request from frontend...")
        
        # Initialize variables
        audio_file_path = None
        text_query = None
        image_file_path = None
        speech_to_text_output = ""
        assistant_response = "No question provided."
        
        # Handle audio file
        if 'audio' in request.files:
            audio_file = request.files['audio']
            if audio_file.filename:
                # Save audio to temporary file
                audio_filename = secure_filename(audio_file.filename)
                audio_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"audio_{os.getpid()}_{audio_filename}")
                audio_file.save(audio_file_path)
                logging.info(f"Audio file saved: {audio_file_path}")
                
                try:
                    logging.info("Transcribing audio...")
                    speech_to_text_output = transcribe_with_groq("whisper-large-v3", audio_file_path)
                    query = speech_to_text_output
                    logging.info(f"Transcription successful: {speech_to_text_output}")
                except Exception as audio_error:
                    logging.error(f"Audio processing error: {audio_error}")
                    speech_to_text_output = f"Audio processing failed: {str(audio_error)}"
                    query = "Please provide a medical question."
        
        # Handle text input
        elif 'text' in request.form and request.form['text'].strip():
            text_query = request.form['text'].strip()
            query = text_query
            speech_to_text_output = "Text input provided."
            logging.info(f"Text input received: {text_query}")
        else:
            if not audio_file_path:
                return jsonify({
                    'error': 'No input provided. Please provide either audio or text input.'
                }), 400
        
        # Handle image upload
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename and allowed_file(image_file.filename):
                # Save image to temporary file
                image_filename = secure_filename(image_file.filename)
                image_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"image_{os.getpid()}_{image_filename}")
                image_file.save(image_file_path)
                logging.info(f"Image file saved: {image_file_path}")
                
                try:
                    logging.info("Analyzing medical image with vision...")
                    image_analysis = analyze_image_with_vision(image_file_path, query)
                    
                    if query and query != "Please provide a medical question.":
                        # Combine image analysis with user's question
                        enhanced_query = f"Based on the medical image analysis: {image_analysis}\n\nUser Question: {query}\n\nPlease provide a comprehensive summary of what the patient can do to address any issues found in the image."
                    else:
                        enhanced_query = f"Medical Image Analysis Results:\n{image_analysis}\n\nPlease provide a summary of what the patient can do based on this image analysis."
                    
                    query = enhanced_query
                except Exception as image_error:
                    logging.error(f"Image analysis error: {image_error}")
                    # Continue without image analysis
                    pass
        
        # Get AI response
        if query and query != "Please provide a medical question.":
            logging.info("Getting AI response...")
            try:
                assistant_response = analyze_text_query(query, MODEL)
                # Ensure response is a string and clean up any object references
                if assistant_response is None:
                    assistant_response = "No response received from AI."
                elif not isinstance(assistant_response, str):
                    # If it's an object, convert to string properly
                    try:
                        import json
                        assistant_response = json.dumps(assistant_response, indent=2, default=str)
                    except Exception:
                        assistant_response = str(assistant_response)
                
                # Clean up any [object Object] strings that might appear
                assistant_response = assistant_response.replace('[object Object]', '')
                assistant_response = assistant_response.replace('[object ', '')
                
                logging.info("AI response received successfully")
            except Exception as ai_error:
                logging.error(f"AI response error: {ai_error}")
                assistant_response = f"Sorry, I encountered an error while processing your request: {str(ai_error)}"
        
        # Convert assistant response to speech
        logging.info("Converting text to speech...")
        try:
            output_audio_path = os.path.join(app.config['UPLOAD_FOLDER'], f"assistant_response_{os.getpid()}.mp3")
            text_to_speech_with_gtts_old(assistant_response, output_audio_path)
            
            # Create a copy in the static folder for web access
            static_audio_path = os.path.join('static', 'audio', f"response_{os.getpid()}.mp3")
            os.makedirs(os.path.dirname(static_audio_path), exist_ok=True)
            shutil.copy2(output_audio_path, static_audio_path)
            
            audio_url = f"/static/audio/response_{os.getpid()}.mp3"
            logging.info(f"Audio response saved: {audio_url}")
        except Exception as tts_error:
            logging.error(f"Text-to-speech error: {tts_error}")
            audio_url = None
        
        # Clean up temporary files
        cleanup_temp_files([audio_file_path, image_file_path, output_audio_path])
        
        # Prepare response
        result = {
            'question': speech_to_text_output if speech_to_text_output else text_query,
            'response': assistant_response,
            'audio_url': audio_url
        }
        
        logging.info("Request processed successfully")
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({
            'error': f'An error occurred while processing your request: {str(e)}'
        }), 500

def cleanup_temp_files(file_paths):
    """Clean up temporary files"""
    for file_path in file_paths:
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                logging.info(f"Cleaned up temporary file: {file_path}")
            except Exception as e:
                logging.warning(f"Failed to clean up file {file_path}: {e}")

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'AI Medical Bot is running'})

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({'error': 'Internal server error occurred'}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/audio', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    print("🚀 Starting AI Medical Bot Frontend...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🔒 Make sure you have GROQ_API_KEY in your .env file")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
