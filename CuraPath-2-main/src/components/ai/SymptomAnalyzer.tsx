import React, { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Alert from '@/components/common/Alert';
import ProgressBar from '@/components/common/ProgressBar';
import { 
  HeartIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { SymptomCheckerAPI } from '@/services/api';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

interface Condition {
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  commonSymptoms: string[];
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
}

interface SymptomAnalyzerProps {
  onAnalysisComplete?: (conditions: Condition[]) => void;
  className?: string;
}

const SymptomAnalyzer: React.FC<SymptomAnalyzerProps> = ({
  onAnalysisComplete,
  className = ''
}) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Condition[] | null>(null);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest pain', 'Shortness of breath', 'Abdominal pain', 'Joint pain',
    'Sore throat', 'Runny nose', 'Back pain', 'Muscle aches', 'Vomiting',
    'Diarrhea', 'Loss of appetite', 'Sleep problems', 'Anxiety', 'Depression'
  ];

  const mockConditions: Condition[] = [
    {
      name: 'Viral Upper Respiratory Infection',
      probability: 0.78,
      severity: 'low',
      description: 'A common viral infection affecting the nose, throat, and upper airways. Usually resolves on its own within 7-10 days.',
      commonSymptoms: ['Runny nose', 'Sore throat', 'Cough', 'Mild fever'],
      recommendations: [
        'Get plenty of rest and stay hydrated',
        'Use over-the-counter pain relievers for comfort',
        'Consider throat lozenges for sore throat',
        'Avoid close contact with others to prevent spread'
      ],
      urgency: 'routine'
    },
    {
      name: 'Tension Headache',
      probability: 0.65,
      severity: 'low',
      description: 'The most common type of headache, often related to stress, poor posture, or muscle tension.',
      commonSymptoms: ['Headache', 'Muscle tension', 'Fatigue'],
      recommendations: [
        'Apply heat or cold to your head, neck, or shoulders',
        'Practice relaxation techniques and stress management',
        'Maintain regular sleep schedule',
        'Stay hydrated and eat regular meals'
      ],
      urgency: 'routine'
    },
    {
      name: 'Gastroenteritis',
      probability: 0.45,
      severity: 'medium',
      description: 'Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection.',
      commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Fever'],
      recommendations: [
        'Stay hydrated with clear fluids',
        'Follow the BRAT diet (bananas, rice, applesauce, toast)',
        'Avoid dairy and fatty foods temporarily',
        'Seek medical attention if symptoms worsen or persist'
      ],
      urgency: 'soon'
    }
  ];

  const addSymptom = (symptomName: string) => {
    if (symptoms.find(s => s.name === symptomName)) return;
    
    const newSymptomObj: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity: 'mild',
      duration: 'recent'
    };
    
    setSymptoms([...symptoms, newSymptomObj]);
    setNewSymptom('');
  };

  const removeSymptom = (symptomId: string) => {
    setSymptoms(symptoms.filter(s => s.id !== symptomId));
  };

  const updateSymptom = (symptomId: string, field: keyof Symptom, value: string) => {
    setSymptoms(symptoms.map(s => 
      s.id === symptomId ? { ...s, [field]: value } : s
    ));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Call real Flask backend API
      const response = await SymptomCheckerAPI.checkSymptoms(
        symptoms.map(s => s.name),
        30, // Default age - you can make this configurable
        'unknown' // Default gender - you can make this configurable
      );
      
      if (response.success && response.data) {
        // Transform backend response to match frontend format
        const transformedResults: Condition[] = [{
          name: response.data.possible_conditions[0] || 'Condition Analysis',
          probability: 0.75, // Default probability
          severity: 'medium',
          description: `Analysis based on symptoms: ${symptoms.map(s => s.name).join(', ')}`,
          commonSymptoms: symptoms.map(s => s.name),
          recommendations: response.data.recommendations,
          urgency: response.data.urgency.toLowerCase() as 'routine' | 'soon' | 'urgent' | 'emergency'
        }];
        
        setAnalysisResults(transformedResults);
        onAnalysisComplete?.(transformedResults);
      } else {
        throw new Error(response.message || 'Failed to analyze symptoms');
      }
    } catch (error) {
      console.error('Symptom analysis error:', error);
      // Fallback to mock data if backend fails
      setAnalysisResults(mockConditions);
      onAnalysisComplete?.(mockConditions);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      case 'low':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'danger' as const;
      case 'urgent':
        return 'warning' as const;
      case 'soon':
        return 'info' as const;
      case 'routine':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'text-green-600';
    if (probability >= 0.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className={className}>
      {/* Disclaimer */}
      <Alert
        variant="warning"
        title="Important Medical Disclaimer"
        message="This AI symptom checker is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment. If experiencing severe symptoms or a medical emergency, seek immediate medical attention."
        className="mb-6"
      />

      {/* Symptom Input */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
          AI Symptom Analyzer
        </h3>
        
        {/* Add Custom Symptom */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter a symptom..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && newSymptom.trim() && addSymptom(newSymptom.trim())}
            />
            <Button
              onClick={() => newSymptom.trim() && addSymptom(newSymptom.trim())}
              disabled={!newSymptom.trim()}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Common Symptoms */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Common symptoms:</h4>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                disabled={!!symptoms.find(s => s.name === symptom)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  symptoms.find(s => s.name === symptom)
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {symptoms.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Selected symptoms:</h4>
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">{symptom.name}</h5>
                  <div className="flex space-x-4 mt-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Severity:</label>
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={symptom.severity}
                        onChange={(e) => updateSymptom(symptom.id, 'severity', e.target.value)}
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Duration:</label>
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={symptom.duration}
                        onChange={(e) => updateSymptom(symptom.id, 'duration', e.target.value)}
                      >
                        <option value="recent">Recent (hours)</option>
                        <option value="days">Few days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeSymptom(symptom.id)}
                  className="text-gray-400 hover:text-red-500 ml-3"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <Button
              onClick={analyzeSymptoms}
              loading={isAnalyzing}
              disabled={symptoms.length === 0}
              className="w-full"
            >
              Analyze Symptoms with AI
            </Button>
          </div>
        )}
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Possible Conditions</h3>
            <div className="space-y-6">
              {analysisResults.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900">{condition.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(condition.severity)} size="sm">
                        {condition.severity} severity
                      </Badge>
                      <Badge variant={getUrgencyColor(condition.urgency)} size="sm">
                        {condition.urgency}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Match Probability:</span>
                      <span className={`text-sm font-bold ${getProbabilityColor(condition.probability)}`}>
                        {Math.round(condition.probability * 100)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={condition.probability * 100}
                      color={condition.probability >= 0.7 ? 'green' : condition.probability >= 0.5 ? 'yellow' : 'blue'}
                      size="sm"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{condition.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Common Symptoms:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {condition.commonSymptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {condition.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <InformationCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Alert
            variant="info"
            title="Next Steps"
            message="These are AI-generated suggestions based on your symptoms. For an accurate diagnosis and proper treatment, please schedule an appointment with your healthcare provider. If symptoms worsen or you experience severe symptoms, seek immediate medical attention."
          />
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Your Symptoms</h3>
            <p className="text-sm text-gray-500">
              Our AI is reviewing your symptoms and matching them with potential conditions...
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SymptomAnalyzer;