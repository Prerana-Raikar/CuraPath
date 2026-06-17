import React from 'react';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import Badge from '@/components/common/Badge';
import Alert from '@/components/common/Alert';
import PieChart from '@/components/charts/PieChart';
import { 
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface RiskFactor {
  factor: string;
  level: 'low' | 'medium' | 'high';
  impact: number;
  description: string;
  modifiable: boolean;
}

interface Prediction {
  condition: string;
  probability: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high';
}

interface RiskAssessmentProps {
  overallRisk: number;
  riskFactors: RiskFactor[];
  predictions: Prediction[];
  recommendations: string[];
  lastUpdated: string;
  className?: string;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  overallRisk,
  riskFactors,
  predictions,
  recommendations,
  lastUpdated,
  className = ''
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'red' as const;
      case 'medium':
        return 'yellow' as const;
      case 'low':
        return 'green' as const;
      default:
        return 'blue' as const;
    }
  };

  const getRiskLevelVariant = (level: string) => {
    switch (level) {
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

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.5) return 'text-red-600';
    if (probability >= 0.3) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Prepare data for risk factor distribution chart
  const riskDistributionData = [
    { name: 'High Risk', value: riskFactors.filter(rf => rf.level === 'high').length, color: '#ef4444' },
    { name: 'Medium Risk', value: riskFactors.filter(rf => rf.level === 'medium').length, color: '#f59e0b' },
    { name: 'Low Risk', value: riskFactors.filter(rf => rf.level === 'low').length, color: '#10b981' }
  ].filter(item => item.value > 0);

  const chartColors = riskDistributionData.map(item => item.color);

  return (
    <div className={className}>
      {/* Overall Risk Score */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-2" />
            AI Risk Assessment
          </h3>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Overall Risk Score</h4>
              <Badge 
                variant={overallRisk >= 0.7 ? 'danger' : overallRisk >= 0.4 ? 'warning' : 'success'}
                size="lg"
              >
                {overallRisk >= 0.7 ? 'High Risk' : overallRisk >= 0.4 ? 'Medium Risk' : 'Low Risk'}
              </Badge>
            </div>
            
            <ProgressBar
              value={overallRisk * 100}
              color={overallRisk >= 0.7 ? 'red' : overallRisk >= 0.4 ? 'yellow' : 'green'}
              showLabel
              size="lg"
              className="mb-4"
            />

            <p className="text-sm text-gray-600">
              Based on analysis of {riskFactors.length} risk factors and current health indicators.
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Risk Factor Distribution</h4>
            {riskDistributionData.length > 0 ? (
              <PieChart
                data={riskDistributionData}
                dataKey="value"
                nameKey="name"
                colors={chartColors}
                height={200}
                innerRadius={40}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No risk factors identified
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Risk Factors */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factor Analysis</h3>
        <div className="space-y-4">
          {riskFactors.map((factor, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRiskLevelVariant(factor.level)} size="sm">
                    {factor.level} risk
                  </Badge>
                  {factor.modifiable && (
                    <Badge variant="info" size="sm">
                      Modifiable
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Impact on Overall Risk:</span>
                  <span className="text-sm font-medium">{Math.round(factor.impact * 100)}%</span>
                </div>
                <ProgressBar
                  value={factor.impact * 100}
                  color={getRiskLevelColor(factor.level)}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Predictions */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{prediction.condition}</h4>
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Probability:</span>
                    <span className={`text-sm font-bold ${getProbabilityColor(prediction.probability)}`}>
                      {Math.round(prediction.probability * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={prediction.probability * 100}
                    color={prediction.probability >= 0.5 ? 'red' : prediction.probability >= 0.3 ? 'yellow' : 'green'}
                    size="sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Timeframe:</span>
                  <span className="text-sm font-medium">{prediction.timeframe}</span>
                </div>
                
                <Badge 
                  variant={getRiskLevelVariant(prediction.severity)} 
                  size="sm"
                  className="w-full justify-center"
                >
                  {prediction.severity} severity
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Generated Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
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

      {/* High Risk Alert */}
      {overallRisk >= 0.7 && (
        <Alert
          variant="danger"
          title="High Risk Patient"
          message="This patient has been identified as high-risk and requires immediate attention and frequent monitoring. Consider escalating care and implementing intensive intervention protocols."
        />
      )}

      {/* Modifiable Risk Factors Alert */}
      {riskFactors.some(rf => rf.modifiable && rf.level !== 'low') && (
        <Alert
          variant="info"
          title="Modifiable Risk Factors Identified"
          message="Several modifiable risk factors have been identified. Lifestyle interventions and targeted therapies may significantly reduce this patient's overall risk profile."
        />
      )}
    </div>
  );
};

export default RiskAssessment;