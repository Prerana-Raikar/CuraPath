import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PlayIcon,
  PauseIcon,
  LightBulbIcon,
  InformationCircleIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface SymptomAnalysis {
  question: string;
  response: string;
  audio_url?: string;
}

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showTips, setShowTips] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Common symptom suggestions
  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 'Joint Pain',
    'Rash', 'Swelling', 'Insomnia', 'Loss of Appetite', 'Back Pain'
  ];

  const addSymptomSuggestion = (symptom: string) => {
    if (symptoms.trim()) {
      setSymptoms(prev => prev + ', ' + symptom);
    } else {
      setSymptoms(symptom);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim() && !audioBlob) {
      setError('Please provide symptoms or record audio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting symptom analysis...');
      console.log('📝 Symptoms:', symptoms);
      console.log('🎤 Audio blob:', audioBlob ? 'Present' : 'None');
      
      const formData = new FormData();
      
      // Add symptoms text
      if (symptoms.trim()) {
        formData.append('text', symptoms);
      }
      
      // Add audio if recorded
      if (audioBlob) {
        formData.append('audio', audioBlob, 'symptoms_audio.wav');
      }

      console.log('🌐 Connecting to backend at: http://localhost:5000/api/process');
      
      // Call your existing backend endpoint
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (data.error) {
        setError(data.error);
      } else {
        // Ensure response is a string and clean up any [object Object] occurrences
        let responseText = data.response;
        
        // If response is an object, stringify it properly
        if (typeof responseText === 'object' && responseText !== null) {
          try {
            // If it's an array or object, format it nicely
            if (Array.isArray(responseText)) {
              responseText = responseText.map(item => 
                typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
              ).join('\n\n');
            } else {
              responseText = JSON.stringify(responseText, null, 2);
            }
          } catch (e) {
            responseText = String(responseText);
          }
        } else {
          responseText = String(responseText || '');
        }
        
        // Clean up any [object Object] strings that might appear
        responseText = responseText.replace(/\[object Object\]/g, '');
        responseText = responseText.replace(/\[object [^\]]+\]/g, '');
        
        // Remove any extra whitespace or newlines that might result from cleanup
        responseText = responseText.trim();
        
        setAnalysisResult({
          question: data.question || symptoms || 'Audio analysis',
          response: responseText,
          audio_url: data.audio_url
        });
        console.log('🎉 Analysis completed successfully!');
      }
    } catch (err) {
      console.error('💥 Analysis error:', err);
      setError(`Failed to analyze symptoms: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const playAudioResponse = () => {
    if (analysisResult?.audio_url) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      
      const audio = new Audio(`http://localhost:5000${analysisResult.audio_url}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setError('Failed to play audio response');
      
      audio.play();
      setIsPlaying(true);
      setAudioElement(audio);
    }
  };

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const clearForm = () => {
    setSymptoms('');
    setAnalysisResult(null);
    setError(null);
    setAudioBlob(null);
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // Helper function to extract text from React children properly
  const extractTextFromChildren = (children: any): string => {
    if (typeof children === 'string') {
      return children;
    }
    if (typeof children === 'number') {
      return String(children);
    }
    if (Array.isArray(children)) {
      return children.map(child => extractTextFromChildren(child)).join('');
    }
    if (children && typeof children === 'object') {
      // If it's a React element, try to extract its children
      if (children.props && children.props.children) {
        return extractTextFromChildren(children.props.children);
      }
      // If it's a plain object, try to convert it
      try {
        return JSON.stringify(children);
      } catch {
        return String(children);
      }
    }
    return String(children || '');
  };

  // Custom components for medical markdown
  const medicalComponents = {
    // Custom blockquote for medical alerts
    blockquote: ({ children, ...props }: any) => {
      const content = extractTextFromChildren(children);
      if (content.includes('⚠️') || content.includes('WARNING')) {
        return (
          <div className="medical-warning bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-red-800">{children}</div>
            </div>
          </div>
        );
      }
      if (content.includes('ℹ️') || content.includes('INFO')) {
        return (
          <div className="medical-info bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-blue-800">{children}</div>
            </div>
          </div>
        );
      }
      if (content.includes('✅') || content.includes('SUCCESS')) {
        return (
          <div className="medical-success bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-green-800">{children}</div>
            </div>
          </div>
        );
      }
      return (
        <blockquote className="border-l-4 border-green-300 pl-4 italic text-gray-600 mb-4" {...props}>
          {children}
        </blockquote>
      );
    },
    // Custom table styling
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mb-4" {...props}>
          {children}
        </table>
      </div>
    ),
    // Custom code block styling
    code: ({ children, className, ...props }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code className="font-mono" {...props}>
            {children}
          </code>
        </pre>
      );
    },
    // Custom paragraph with medical term highlighting
    p: ({ children, ...props }: any) => {
      const content = extractTextFromChildren(children);
      // Clean up any [object Object] strings
      const cleanedContent = content.replace(/\[object Object\]/g, '').replace(/\[object [^\]]+\]/g, '').trim();
      const highlightedContent = highlightMedicalTerms(cleanedContent);
      
      return (
        <p className="mb-4 last:mb-0 leading-relaxed" {...props}>
          {highlightedContent}
        </p>
      );
    }
  };

  // Function to highlight medical terms and symptoms
  const highlightMedicalTerms = (text: string) => {
    const medicalTerms = [
      'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
      'chest pain', 'shortness of breath', 'abdominal pain', 'joint pain',
      'rash', 'swelling', 'insomnia', 'loss of appetite', 'back pain',
      'hypertension', 'diabetes', 'asthma', 'arthritis', 'migraine',
      'anxiety', 'depression', 'allergy', 'infection', 'inflammation'
    ];

    let highlightedText = text;
    medicalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="bg-yellow-100 px-1 py-0.5 rounded font-medium">${term}</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Header with Animation */}
        <div className="text-center relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-1/4 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute right-0 top-1/3 w-40 h-40 bg-gradient-to-bl from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full mb-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110">
              <HeartIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              AI Symptom Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get instant AI-powered analysis of your symptoms using advanced medical AI technology
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full mx-auto mt-6"></div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <LightBulbIcon className="h-6 w-6 text-blue-600 mr-2" />
              Quick Tips
            </h2>
            <button
              onClick={() => setShowTips(!showTips)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showTips ? 'Hide' : 'Show'} Tips
            </button>
          </div>
          
          {showTips && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Be specific about your symptoms and their duration</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Include any triggers or patterns you've noticed</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Mention any medications or treatments you're using</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Symptoms Input Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ChatBubbleLeftRightIcon className="h-7 w-7 text-purple-600 mr-3" />
            Describe Your Symptoms
          </h2>
          
          {/* Text Input with Enhanced Styling */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Symptoms Description
            </label>
            <textarea
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none"
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., 'I have a severe headache that started yesterday morning, accompanied by sensitivity to light and nausea')"
              aria-label="Symptoms description"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {symptoms.length}/500 characters
              </span>
              {symptoms.length > 0 && (
                <button
                  onClick={() => setSymptoms('')}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Common Symptoms Quick Add */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick Add Common Symptoms
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => addSymptomSuggestion(symptom)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm font-medium"
                >
                  + {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Audio Recording */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Voice Recording
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                }`}
              >
                <MicrophoneIcon className="h-6 w-6" />
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </button>
              
              {audioBlob && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="font-medium">Audio recorded</span>
                  </div>
                  <button
                    onClick={() => setAudioBlob(null)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            
            {isRecording && (
              <div className="mt-3 flex items-center space-x-2 text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording in progress...</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={analyzeSymptoms}
            disabled={loading || (!symptoms.trim() && !audioBlob)}
            className="px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xl font-bold flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Analyzing Symptoms...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>

          <button
            onClick={clearForm}
            className="px-8 py-5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl transition-all duration-300 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Clear Form
          </button>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-semibold text-lg">Analysis Failed</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Analysis Results */}
        {analysisResult && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
              AI Analysis Results
            </h2>
            
            <div className="space-y-8">
              {/* Question/Input Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
                  Your Input
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">{analysisResult.question}</p>
              </div>

              {/* AI Response */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <SparklesIcon className="h-6 w-6 text-green-600 mr-2" />
                  AI Medical Analysis
                </h3>
                <div className="prose prose-lg max-w-none markdown-medical">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={medicalComponents}
                  >
                    {analysisResult.response}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Audio Response */}
              {analysisResult.audio_url && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <PlayIcon className="h-6 w-6 text-purple-600 mr-2" />
                    Audio Response
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={isPlaying ? pauseAudio : playAudioResponse}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isPlaying ? (
                        <>
                          <PauseIcon className="h-5 w-5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-5 w-5" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    <span className="text-gray-600 font-medium">
                      Listen to the AI response
                    </span>
                  </div>
                </div>
              )}

              {/* Enhanced Disclaimer */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-bold text-lg mb-2">Medical Disclaimer</p>
                    <p className="text-yellow-700 leading-relaxed">
                      This AI analysis is for informational purposes only and should not replace professional medical advice. 
                      Always consult with a qualified healthcare provider for proper diagnosis and treatment. 
                      Seek immediate medical attention for severe or emergency symptoms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker; 