import React, { useState, useCallback } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import ProgressBar from '@/components/common/ProgressBar';
import Badge from '@/components/common/Badge';
import { 
  CloudArrowUpIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AnalysisResult {
  confidence: number;
  summary: string;
  keyFindings: string[];
  abnormalValues: Array<{
    parameter: string;
    value: string;
    normalRange: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  recommendations: string[];
  riskFactors: string[];
  followUpRequired: boolean;
}

interface ReportAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  className?: string;
}

const ReportAnalyzer: React.FC<ReportAnalyzerProps> = ({
  onAnalysisComplete,
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockAnalysisResult: AnalysisResult = {
    confidence: 92,
    summary: 'This comprehensive blood panel reveals several significant findings requiring attention. The patient shows elevated glucose levels consistent with diabetes, elevated cholesterol requiring cardiovascular risk management, and some liver enzyme abnormalities that warrant monitoring.',
    keyFindings: [
      'Elevated HbA1c (8.2%) indicating poor diabetes control over past 2-3 months',
      'High LDL cholesterol (165 mg/dL) increasing cardiovascular risk',
      'Slightly elevated ALT suggesting possible liver involvement',
      'Normal kidney function with adequate eGFR',
      'Vitamin D deficiency noted',
      'Inflammatory markers within normal limits'
    ],
    abnormalValues: [
      {
        parameter: 'HbA1c',
        value: '8.2%',
        normalRange: '<7.0%',
        severity: 'moderate'
      },
      {
        parameter: 'LDL Cholesterol',
        value: '165 mg/dL',
        normalRange: '<100 mg/dL',
        severity: 'moderate'
      },
      {
        parameter: 'ALT',
        value: '68 U/L',
        normalRange: '10-40 U/L',
        severity: 'mild'
      },
      {
        parameter: 'Vitamin D',
        value: '18 ng/mL',
        normalRange: '30-100 ng/mL',
        severity: 'mild'
      }
    ],
    recommendations: [
      'Adjust diabetes medication - consider adding or increasing metformin dose',
      'Initiate statin therapy for cholesterol management',
      'Recommend lifestyle modifications: diet and exercise counseling',
      'Monitor liver enzymes in 4-6 weeks',
      'Start vitamin D supplementation',
      'Schedule follow-up in 3 months to reassess HbA1c',
      'Consider referral to endocrinologist for diabetes management optimization'
    ],
    riskFactors: [
      'Uncontrolled diabetes increases risk of cardiovascular disease',
      'Elevated cholesterol compounds cardiovascular risk',
      'Liver enzyme elevation may indicate medication toxicity',
      'Vitamin D deficiency may affect bone health'
    ],
    followUpRequired: true
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);

    // Simulate analysis progress
    const progressSteps = [
      { progress: 20, message: 'Preprocessing document...' },
      { progress: 40, message: 'Extracting text and data...' },
      { progress: 60, message: 'Analyzing medical content...' },
      { progress: 80, message: 'Generating insights...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    setAnalysisResult(mockAnalysisResult);
    setIsAnalyzing(false);
    onAnalysisComplete?.(mockAnalysisResult);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'danger' as const;
      case 'moderate':
        return 'warning' as const;
      case 'mild':
        return 'info' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className={className}>
      {/* File Upload */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DocumentMagnifyingGlassIcon className="h-6 w-6 text-green-600 mr-2" />
          AI Report Analyzer
        </h3>
        
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png,.dcm"
              onChange={handleFileChange}
            />
            
            <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600">
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Supports PDF, JPG, PNG, DICOM files up to 50MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">{selectedFile.name}</h4>
                  <p className="text-sm text-green-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={analyzeReport}
                  loading={isAnalyzing}
                  disabled={isAnalyzing}
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Analyze with AI
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                  disabled={isAnalyzing}
                >
                  Remove
                </Button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="space-y-3">
                <ProgressBar
                  value={analysisProgress}
                  label="Analysis Progress"
                  showLabel
                  color="blue"
                />
                <p className="text-sm text-gray-600 text-center">
                  AI is analyzing your medical report...
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="danger" message={error} className="mt-4" />
        )}
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Confidence Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Analysis Confidence</h3>
              <Badge 
                variant={analysisResult.confidence >= 90 ? 'success' : analysisResult.confidence >= 70 ? 'warning' : 'danger'}
                size="lg"
              >
                {analysisResult.confidence}% Confident
              </Badge>
            </div>
            <ProgressBar
              value={analysisResult.confidence}
              color={analysisResult.confidence >= 90 ? 'green' : analysisResult.confidence >= 70 ? 'yellow' : 'red'}
              showLabel
            />
          </Card>

          {/* Summary */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-3">AI Summary</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
              {analysisResult.summary}
            </p>
          </Card>

          {/* Key Findings */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Key Findings</h3>
            <ul className="space-y-3">
              {analysisResult.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Abnormal Values */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Abnormal Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.abnormalValues.map((value, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  value.severity === 'severe' ? 'border-red-200 bg-red-50' :
                  value.severity === 'moderate' ? 'border-yellow-200 bg-yellow-50' :
                  'border-orange-200 bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{value.parameter}</h4>
                    <Badge variant={getSeverityColor(value.severity)} size="sm">
                      {value.severity}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">{value.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Normal:</span>
                      <span className="text-gray-600">{value.normalRange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-3">AI Recommendations</h3>
            <div className="space-y-3">
              {analysisResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Factors */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Factors</h3>
            <div className="space-y-2">
              {analysisResult.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{risk}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Follow-up Alert */}
          {analysisResult.followUpRequired && (
            <Alert
              variant="warning"
              title="Follow-up Required"
              message="Based on the analysis, this patient requires follow-up care and monitoring. Please schedule appropriate appointments and consider specialist referrals as recommended."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReportAnalyzer;