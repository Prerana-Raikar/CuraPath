#!/usr/bin/env python3
"""
Startup script for CuraPath AI Medical Backend
"""

import os
import sys
from dotenv import load_dotenv

def main():
    """Main startup function"""
    print("🚀 Starting CuraPath AI Medical Backend...")
    
    # Load environment variables
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        load_dotenv(env_file)
        print("✅ Environment variables loaded from .env file")
    else:
        print("⚠️  No .env file found. Using default configuration.")
        print("   Create a .env file from env.example for production use.")
    
    # Check for required API keys
    openai_key = os.getenv('OPENAI_API_KEY')
    google_key = os.getenv('GOOGLE_API_KEY')
    
    print("\n🔑 AI Service Configuration:")
    print(f"   OpenAI GPT-4: {'✅ Configured' if openai_key else '❌ Not configured'}")
    print(f"   Google Gemini: {'✅ Configured' if google_key else '❌ Not configured'}")
    print(f"   ML Fallback: ✅ Always available")
    
    if not openai_key and not google_key:
        print("\n⚠️  No AI API keys configured. The system will use ML fallback mode.")
        print("   For full AI functionality, configure at least one API key in .env file")
    
    # Import and run the Flask app
    try:
        from app import app, socketio
        
        port = int(os.getenv('PORT', 5000))
        debug = os.getenv('FLASK_ENV') == 'development'
        
        print(f"\n🌐 Starting server on port {port}")
        print(f"   Debug mode: {'✅ Enabled' if debug else '❌ Disabled'}")
        print(f"   Environment: {os.getenv('FLASK_ENV', 'development')}")
        
        print("\n📋 Available endpoints:")
        print("   • Health check: http://localhost:{}/health".format(port))
        print("   • AI Assistant: http://localhost:{}/api/ai-assistant/chat".format(port))
        print("   • Risk Predictor: http://localhost:{}/api/risk-predictor/assess".format(port))
        print("   • Report Analyzer: http://localhost:{}/api/report-analyzer/analyze".format(port))
        
        print("\n🎯 Starting CuraPath AI Medical Backend...")
        print("   Press Ctrl+C to stop the server")
        
        socketio.run(app, host='0.0.0.0', port=port, debug=debug)
        
    except ImportError as e:
        print(f"❌ Error importing Flask app: {str(e)}")
        print("   Make sure all dependencies are installed: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting server: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
