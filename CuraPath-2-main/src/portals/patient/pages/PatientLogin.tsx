import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PatientLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Available patients with comprehensive details matching Doctor Portal
  const availablePatients = [
    {
      id: 'P001',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91-98765-43210',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      medicalRecordNumber: 'MRN001',
      bloodType: 'A+',
      emergencyContactName: 'Raj Sharma',
      emergencyContactPhone: '+91-98765-43211',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Type 1 Diabetes', 'Hypertension'],
      currentMedications: ['Insulin', 'Metformin', 'Lisinopril'],
      createdAt: '2023-01-15',
      hasAccess: true,
      accessLevel: 'full_access',
      address: {
        street: '123 Medical Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 140, diastolic: 90 },
          heartRate: 78,
          temperature: 98.6,
          weight: 65,
          height: 165,
          bmi: 23.9
        }
      ],
      labResults: [
        {
          testName: 'HbA1c',
          value: '7.2',
          unit: '%',
          referenceRange: '4.0-5.6',
          status: 'High',
          resultDate: '2024-01-20',
          notes: 'Elevated - needs adjustment'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 65,
        lastAssessed: '2024-01-20',
        cardiovascularRisk: 'Medium',
        diabetesRisk: 'High',
        cancerRisk: 'Low',
        recommendations: ['Monitor blood sugar daily', 'Regular exercise', 'Diet consultation']
      }
    },
    {
      id: 'P002',
      name: 'Raj Patel',
      email: 'raj.patel@gmail.com',
      phone: '+91-98765-43212',
      dateOfBirth: '1978-07-22',
      gender: 'male',
      medicalRecordNumber: 'MRN002',
      bloodType: 'O+',
      emergencyContactName: 'Priya Patel',
      emergencyContactPhone: '+91-98765-43213',
      allergies: ['Latex'],
      chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      currentMedications: ['Aspirin', 'Atorvastatin', 'Metoprolol'],
      createdAt: '2023-02-10',
      hasAccess: true,
      accessLevel: 'limited_access',
      address: {
        street: '456 Health Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 135, diastolic: 85 },
          heartRate: 72,
          temperature: 98.4,
          weight: 78,
          height: 175,
          bmi: 25.5
        }
      ],
      labResults: [
        {
          testName: 'Cholesterol',
          value: '220',
          unit: 'mg/dL',
          referenceRange: '<200',
          status: 'High',
          resultDate: '2024-01-18',
          notes: 'Elevated LDL'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 78,
        lastAssessed: '2024-01-18',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        recommendations: ['Cardiac monitoring', 'Low-fat diet', 'Regular exercise']
      }
    },
    {
      id: 'P003',
      name: 'Ananya Kumar',
      email: 'ananya.kumar@gmail.com',
      phone: '+91-98765-43214',
      dateOfBirth: '1992-11-08',
      gender: 'female',
      medicalRecordNumber: 'MRN003',
      bloodType: 'B+',
      emergencyContactName: 'Vikram Kumar',
      emergencyContactPhone: '+91-98765-43215',
      allergies: ['Dust', 'Pollen'],
      chronicConditions: ['Migraine', 'Anxiety'],
      currentMedications: ['Sumatriptan', 'Escitalopram'],
      createdAt: '2023-03-05',
      hasAccess: true,
      accessLevel: 'emergency_access',
      address: {
        street: '789 Wellness Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 75,
          temperature: 98.8,
          weight: 58,
          height: 160,
          bmi: 22.7
        }
      ],
      labResults: [
        {
          testName: 'Vitamin D',
          value: '18',
          unit: 'ng/mL',
          referenceRange: '30-100',
          status: 'Low',
          resultDate: '2024-01-22',
          notes: 'Deficient - supplementation needed'
        }
      ],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 35,
        lastAssessed: '2024-01-22',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Vitamin D supplements', 'Stress management', 'Regular sleep']
      }
    },
    {
      id: 'P004',
      name: 'Arjun Singh',
      email: 'arjun.singh@gmail.com',
      phone: '+91-98765-43216',
      dateOfBirth: '1972-05-12',
      gender: 'male',
      medicalRecordNumber: 'MRN004',
      bloodType: 'AB+',
      emergencyContactName: 'Kavya Singh',
      emergencyContactPhone: '+91-98765-43217',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Prostate Cancer', 'Hypertension'],
      currentMedications: ['Bicalutamide', 'Lisinopril', 'Tamsulosin'],
      createdAt: '2023-04-20',
      hasAccess: true,
      accessLevel: 'full_access',
      address: {
        street: '321 Cancer Care Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 145, diastolic: 95 },
          heartRate: 68,
          temperature: 98.2,
          weight: 82,
          height: 178,
          bmi: 25.9
        }
      ],
      labResults: [
        {
          testName: 'PSA',
          value: '8.5',
          unit: 'ng/mL',
          referenceRange: '<4.0',
          status: 'High',
          resultDate: '2024-01-19',
          notes: 'Elevated - monitoring required'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 82,
        lastAssessed: '2024-01-19',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Low',
        cancerRisk: 'High',
        recommendations: ['Oncological monitoring', 'Regular PSA tests', 'Lifestyle modifications']
      }
    },
    {
      id: 'P005',
      name: 'Meera Reddy',
      email: 'meera.reddy@gmail.com',
      phone: '+91-98765-43218',
      dateOfBirth: '1988-09-30',
      gender: 'female',
      medicalRecordNumber: 'MRN005',
      bloodType: 'O-',
      emergencyContactName: 'Suresh Reddy',
      emergencyContactPhone: '+91-98765-43219',
      allergies: ['Ibuprofen'],
      chronicConditions: ['Rheumatoid Arthritis', 'Osteoporosis'],
      currentMedications: ['Methotrexate', 'Calcium Carbonate', 'Vitamin D3'],
      createdAt: '2023-05-15',
      hasAccess: false,
      accessLevel: 'pending',
      address: {
        street: '654 Arthritis Road',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 125, diastolic: 82 },
          heartRate: 74,
          temperature: 98.5,
          weight: 62,
          height: 162,
          bmi: 23.6
        }
      ],
      labResults: [
        {
          testName: 'Rheumatoid Factor',
          value: '45',
          unit: 'IU/mL',
          referenceRange: '<14',
          status: 'High',
          resultDate: '2024-01-21',
          notes: 'Positive for RA'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 58,
        lastAssessed: '2024-01-21',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Joint protection', 'Calcium supplements', 'Physical therapy']
      }
    },
    {
      id: 'P006',
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@gmail.com',
      phone: '+91-98765-43220',
      dateOfBirth: '1980-12-03',
      gender: 'male',
      medicalRecordNumber: 'MRN006',
      bloodType: 'A-',
      emergencyContactName: 'Priya Malhotra',
      emergencyContactPhone: '+91-98765-43221',
      allergies: ['Peanuts', 'Tree nuts'],
      chronicConditions: ['Asthma', 'GERD'],
      currentMedications: ['Albuterol', 'Omeprazole', 'Montelukast'],
      createdAt: '2023-06-10',
      hasAccess: true,
      accessLevel: 'limited_access',
      address: {
        street: '987 Respiratory Way',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 130, diastolic: 85 },
          heartRate: 76,
          temperature: 98.7,
          weight: 75,
          height: 172,
          bmi: 25.4
        }
      ],
      labResults: [
        {
          testName: 'Peak Flow',
          value: '450',
          unit: 'L/min',
          referenceRange: '500-600',
          status: 'Low',
          resultDate: '2024-01-23',
          notes: 'Below normal range'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 52,
        lastAssessed: '2024-01-23',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Avoid allergens', 'Regular inhaler use', 'Monitor peak flow']
      }
    },
    {
      id: 'P007',
      name: 'Kavya Iyer',
      email: 'kavya.iyer@gmail.com',
      phone: '+91-98765-43222',
      dateOfBirth: '1995-04-18',
      gender: 'female',
      medicalRecordNumber: 'MRN007',
      bloodType: 'B-',
      emergencyContactName: 'Rahul Iyer',
      emergencyContactPhone: '+91-98765-43223',
      allergies: ['Latex', 'Adhesive tape'],
      chronicConditions: ['Eczema', 'Seasonal allergies'],
      currentMedications: ['Cetirizine', 'Hydrocortisone cream', 'Emollient cream'],
      createdAt: '2023-07-05',
      hasAccess: false,
      accessLevel: 'denied',
      address: {
        street: '456 Dermatology Drive',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 118, diastolic: 78 },
          heartRate: 72,
          temperature: 98.4,
          weight: 55,
          height: 158,
          bmi: 22.0
        }
      ],
      labResults: [
        {
          testName: 'IgE Total',
          value: '280',
          unit: 'kU/L',
          referenceRange: '<100',
          status: 'High',
          resultDate: '2024-01-24',
          notes: 'Elevated - allergic response'
        }
      ],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 28,
        lastAssessed: '2024-01-24',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Avoid triggers', 'Regular moisturizing', 'Allergy management']
      }
    },
    {
      id: 'P008',
      name: 'Rahul Gupta',
      email: 'rahul.gupta@gmail.com',
      phone: '+91-98765-43224',
      dateOfBirth: '1975-08-25',
      gender: 'male',
      medicalRecordNumber: 'MRN008',
      bloodType: 'O+',
      emergencyContactName: 'Sunita Gupta',
      emergencyContactPhone: '+91-98765-43225',
      allergies: ['Codeine'],
      chronicConditions: ['Chronic Kidney Disease', 'Hypertension'],
      currentMedications: ['Amlodipine', 'Furosemide', 'Calcitriol'],
      createdAt: '2023-08-12',
      hasAccess: true,
      accessLevel: 'full_access',
      address: {
        street: '789 Nephrology Street',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 150, diastolic: 95 },
          heartRate: 70,
          temperature: 98.3,
          weight: 80,
          height: 175,
          bmi: 26.1
        }
      ],
      labResults: [
        {
          testName: 'Creatinine',
          value: '2.8',
          unit: 'mg/dL',
          referenceRange: '0.7-1.3',
          status: 'High',
          resultDate: '2024-01-25',
          notes: 'Elevated - kidney function impaired'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 75,
        lastAssessed: '2024-01-25',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        recommendations: ['Kidney function monitoring', 'Low-sodium diet', 'Regular nephrology follow-up']
      }
    },
    {
      id: 'P009',
      name: 'Sunita Verma',
      email: 'sunita.verma@gmail.com',
      phone: '+91-98765-43226',
      dateOfBirth: '1982-11-14',
      gender: 'female',
      medicalRecordNumber: 'MRN009',
      bloodType: 'A+',
      emergencyContactName: 'Amit Verma',
      emergencyContactPhone: '+91-98765-43227',
      allergies: ['Sulfa drugs', 'Aspirin'],
      chronicConditions: ['Multiple Sclerosis', 'Depression'],
      currentMedications: ['Interferon beta-1a', 'Sertraline', 'Baclofen'],
      createdAt: '2023-09-20',
      hasAccess: false,
      accessLevel: 'pending',
      address: {
        street: '321 Neurology Avenue',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 125, diastolic: 80 },
          heartRate: 73,
          temperature: 98.6,
          weight: 68,
          height: 165,
          bmi: 25.0
        }
      ],
      labResults: [
        {
          testName: 'Vitamin B12',
          value: '180',
          unit: 'pg/mL',
          referenceRange: '200-900',
          status: 'Low',
          resultDate: '2024-01-26',
          notes: 'Deficient - supplementation needed'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 62,
        lastAssessed: '2024-01-26',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Neurological monitoring', 'Vitamin B12 supplements', 'Physical therapy']
      }
    },
    {
      id: 'P010',
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      phone: '+91-98765-43228',
      dateOfBirth: '1990-06-08',
      gender: 'male',
      medicalRecordNumber: 'MRN010',
      bloodType: 'AB+',
      emergencyContactName: 'Neha Kumar',
      emergencyContactPhone: '+91-98765-43229',
      allergies: ['Shellfish', 'Eggs'],
      chronicConditions: ['Ulcerative Colitis', 'Iron Deficiency Anemia'],
      currentMedications: ['Mesalamine', 'Iron Sulfate', 'Folic Acid'],
      createdAt: '2023-10-15',
      hasAccess: true,
      accessLevel: 'limited_access',
      address: {
        street: '654 Gastroenterology Road',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        zipCode: '226001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 115, diastolic: 75 },
          heartRate: 75,
          temperature: 98.5,
          weight: 70,
          height: 170,
          bmi: 24.2
        }
      ],
      labResults: [
        {
          testName: 'Hemoglobin',
          value: '10.2',
          unit: 'g/dL',
          referenceRange: '13.5-17.5',
          status: 'Low',
          resultDate: '2024-01-27',
          notes: 'Anemic - iron therapy ongoing'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 48,
        lastAssessed: '2024-01-27',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Medium',
        recommendations: ['Iron supplementation', 'Colonoscopy monitoring', 'Balanced diet']
      }
    }
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Check if the email matches any of the available patient emails
    const patient = availablePatients.find(p => p.email.toLowerCase() === email.toLowerCase());
    
    if (!patient) {
      setError('Email address not found. Please use your registered patient email address.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Store the complete patient data in localStorage
      localStorage.setItem('patient_data', JSON.stringify(patient));
      localStorage.setItem('patient_token', `patient_${patient.id}_${Date.now()}`);
      
      // Navigate directly to patient dashboard
      navigate(`/patient/dashboard/${patient.id}`);
    } catch (error) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMainLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side decorative elements */}
        <div className="absolute left-0 top-1/4 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute left-8 top-1/2 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute left-16 bottom-1/4 w-20 h-20 bg-gradient-to-r from-purple-100/40 to-blue-100/40 rounded-full blur-2xl"></div>
        
        {/* Right side decorative elements */}
        <div className="absolute right-0 top-1/3 w-40 h-40 bg-gradient-to-bl from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute right-12 top-2/3 w-28 h-28 bg-gradient-to-tl from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute right-20 bottom-1/3 w-16 h-16 bg-gradient-to-l from-blue-100/40 to-purple-100/40 rounded-full blur-2xl"></div>
      </div>

      {/* Back Button - Positioned in top-right corner */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleBackToMainLogin}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-md"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Main Login</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 animate-pulse">
                <HeartIcon className="h-10 w-10 text-white" />
              </div>
              {/* Orbiting elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Patient Portal
          </h1>
          <p className="text-lg text-gray-600">
            Access your health records and manage your care
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your patient email address"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Patient Portal'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
