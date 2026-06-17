import React, { useState } from 'react';
import { 
  ClipboardDocumentListIcon,
  BeakerIcon,
  HeartIcon,
  DocumentTextIcon,
  PlusIcon,
  ClipboardDocumentIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DataEntry: React.FC = () => {
  const [selectedDataType, setSelectedDataType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const dataTypes = [
    { id: 'vitals', name: 'Vital Signs', icon: HeartIcon, description: 'Blood pressure, heart rate, temperature' },
    { id: 'lab_results', name: 'Lab Results', icon: BeakerIcon, description: 'Blood work, urine tests, cultures' },
    { id: 'notes', name: 'Clinical Notes', icon: DocumentTextIcon, description: 'Visit notes, observations' },
    { id: 'medications', name: 'Medications', icon: ClipboardDocumentListIcon, description: 'Current prescriptions' }
  ];

  const patients = [
    { id: 'P001', name: 'Priya Sharma', mrn: 'MRN001' },
    { id: 'P002', name: 'Raj Patel', mrn: 'MRN002' },
    { id: 'P003', name: 'Ananya Kumar', mrn: 'MRN003' },
    { id: 'P004', name: 'Arjun Singh', mrn: 'MRN004' },
    { id: 'P005', name: 'Meera Reddy', mrn: 'MRN005' },
    { id: 'P006', name: 'Vikram Malhotra', mrn: 'MRN006' },
    { id: 'P007', name: 'Kavya Iyer', mrn: 'MRN007' },
    { id: 'P008', name: 'Rahul Gupta', mrn: 'MRN008' },
    { id: 'P009', name: 'Sunita Verma', mrn: 'MRN009' },
    { id: 'P010', name: 'Amit Kumar', mrn: 'MRN010' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <ClipboardDocumentIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Data Entry & Management
          </h1>
          <p className="text-lg text-gray-600">
            Add new medical data and update patient records efficiently
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Patient Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <span>Select Patient</span>
          </h3>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            title="Select patient for data entry"
            aria-label="Select patient for data entry"
          >
            <option value="">Choose a patient...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.mrn})
              </option>
            ))}
          </select>
        </div>

        {/* Data Type Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            <span>Select Data Type</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedDataType(type.id)}
                className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                  selectedDataType === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <type.icon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Entry Forms */}
        {selectedDataType && selectedPatient && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span>Enter {dataTypes.find(t => t.id === selectedDataType)?.name}</span>
            </h3>

            {selectedDataType === 'vitals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (Systolic)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="120" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (Diastolic)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="80" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="72" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                    <input type="number" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="98.6" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="150" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="68" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    rows={3} 
                    placeholder="Any additional notes about the vital signs..."
                  ></textarea>
                </div>
              </div>
            )}

            {selectedDataType === 'lab_results' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select test type" aria-label="Select test type">
                      <option value="">Select test...</option>
                      <option value="cbc">Complete Blood Count</option>
                      <option value="metabolic">Metabolic Panel</option>
                      <option value="lipid">Lipid Panel</option>
                      <option value="thyroid">Thyroid Function</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select test date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lab Facility</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="City Lab" title="Enter lab facility name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Provider</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Dr. Smith" title="Enter ordering provider name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    rows={6} 
                    placeholder="Enter lab results details..."
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Another Result</span>
                  </button>
                </div>
              </div>
            )}

            {selectedDataType === 'notes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select note type" aria-label="Select note type">
                      <option value="">Select type...</option>
                      <option value="visit">Visit Note</option>
                      <option value="phone">Phone Call</option>
                      <option value="observation">Observation</option>
                      <option value="follow_up">Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input type="datetime-local" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select date and time" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Dr. Smith" title="Enter provider name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Internal Medicine" title="Enter department name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    rows={6} 
                    placeholder="Enter detailed clinical notes..."
                  ></textarea>
                </div>
              </div>
            )}

            {selectedDataType === 'medications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Lisinopril" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="10mg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select medication frequency" aria-label="Select medication frequency">
                      <option value="">Select frequency...</option>
                      <option value="once_daily">Once daily</option>
                      <option value="twice_daily">Twice daily</option>
                      <option value="three_times_daily">Three times daily</option>
                      <option value="as_needed">As needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" title="Select medication start date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescribing Provider</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Dr. Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refills</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    rows={3} 
                    placeholder="Take with food. Monitor blood pressure..."
                  ></textarea>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">Save Data</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntry;