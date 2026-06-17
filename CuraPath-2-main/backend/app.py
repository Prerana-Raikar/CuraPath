#!/usr/bin/env python3
"""
CuraPath AI Medical Backend
Real-time AI-powered medical assistance system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO, emit
import os
from datetime import datetime, timedelta
import json
import logging
import time

# Import our AI services
from ai_services import (
    generate_enhanced_medical_response,
    advanced_ai
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-super-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Global access control state (in a real app, this would be in a database)
# This tracks the current access status for each patient
patient_access_control = {
    'P001': {'status': 'approved', 'accessLevel': 'full', 'lastAccessGranted': '2024-01-15T10:30:00Z'},
    'P002': {'status': 'pending', 'accessLevel': 'none', 'lastAccessGranted': None},
    'P003': {'status': 'approved', 'accessLevel': 'full', 'lastAccessGranted': '2024-01-13T14:20:00Z'},
    'P004': {'status': 'pending', 'accessLevel': 'none', 'lastAccessGranted': None},
    'P005': {'status': 'approved', 'accessLevel': 'limited', 'lastAccessGranted': '2024-01-14T14:30:00Z'},
    'P006': {'status': 'pending', 'accessLevel': 'none', 'lastAccessGranted': None},
    'P007': {'status': 'approved', 'accessLevel': 'full', 'lastAccessGranted': '2024-01-16T15:30:00Z'},
    'P008': {'status': 'pending', 'accessLevel': 'none', 'lastAccessGranted': None},
    'P009': {'status': 'approved', 'accessLevel': 'limited', 'lastAccessGranted': '2024-01-17T16:15:00Z'},
    'P010': {'status': 'pending', 'accessLevel': 'none', 'lastAccessGranted': None}
}

# Request to patient mapping for access control updates
request_patient_mapping = {
    'AR001': 'P001',
    'AR002': 'P003', 
    'AR003': 'P005',
    'AR004': 'P007',
    'AR005': 'P009',
    'AR006': 'P002',
    'AR007': 'P004',
    'AR008': 'P006',
    'AR009': 'P008',
    'AR010': 'P010'
}

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
socketio = SocketIO(app, cors_allowed_origins="*")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for the AI backend"""
    return jsonify({
        'status': 'healthy',
        'service': 'CuraPath AI Medical Backend',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'ai_capabilities': [
            'AI Medical Assistant',
            'Health Risk Predictor',
            'Medical Report Analyzer',
            'AI Symptom Checker'
        ]
    })

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'message': 'Welcome to CuraPath AI Medical Backend',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'ai_assistant': '/api/ai-assistant/chat',
            'risk_predictor': '/api/risk-predictor/assess',
            'report_analyzer': '/api/report-analyzer/analyze',
            'symptom_checker': '/api/symptom-checker/check',
            'symptom_suggestions': '/api/symptom-checker/suggest'
        },
        'features': [
            'Real-time AI Medical Assistance',
            'Health Risk Assessment',
            'Medical Report Analysis',
            'Symptom Analysis and Suggestions',
            'WebSocket Real-time Communication'
        ]
    })

# AI Assistant Endpoint
@app.route('/api/ai-assistant/chat', methods=['POST'])
@limiter.limit("30 per minute")
def ai_assistant_chat():
    """AI Medical Assistant chat endpoint"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        logger.info(f"AI Assistant request: {user_message[:100]}...")
        
        # Process message with real-time AI
        ai_response = generate_enhanced_medical_response(user_message)
        
        return jsonify({
            'success': True,
            'data': {
                'sessionId': f'session_{int(time.time())}',
                'message': ai_response['response'],
                'metadata': {
                    'confidence': ai_response['confidence'],
                    'sources': ai_response['sources'],
                    'topic_detected': ai_response['topic_detected'],
                    'response_type': ai_response['response_type'],
                    'processing_time_ms': ai_response['processing_time_ms'],
                    'ai_provider': ai_response['ai_provider'],
                    'timestamp': ai_response['timestamp']
                }
            }
        })
        
    except Exception as e:
        logger.error(f"AI Assistant error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'AI processing error',
            'message': str(e)
        }), 500

# Risk Predictor Endpoint
@app.route('/api/risk-predictor/assess', methods=['POST'])
@limiter.limit("20 per minute")
def risk_predictor_assess():
    """Health Risk Predictor endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Patient data is required'}), 400
        
        # Extract patient data
        age = data.get('age', 30)
        conditions = data.get('conditions', [])
        vitals = data.get('vitals', {})
        medical_history = data.get('medical_history', {})
        
        logger.info(f"Risk assessment for patient age {age}")
        
        # Calculate health risks
        risk_assessment = advanced_ai.calculate_health_risks(age, conditions, vitals, medical_history)
        
        return jsonify({
            'success': True,
            'data': {
                'overall_risk': risk_assessment['risk_level'],
                'cardiovascular_risk': risk_assessment['risk_score'],
                'diabetes_risk': risk_assessment['risk_score'],
                'cancer_risk': risk_assessment['risk_score'],
                'recommendations': risk_assessment['recommendations'],
                'timestamp': risk_assessment['timestamp']
            }
        })
        
    except Exception as e:
        logger.error(f"Risk Predictor error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Risk assessment error',
            'message': str(e)
        }), 500

# Report Analyzer Endpoint
@app.route('/api/report-analyzer/analyze', methods=['POST'])
@limiter.limit("15 per minute")
def report_analyzer_analyze():
    """Medical Report Analyzer endpoint"""
    try:
        data = request.get_json()
        if not data or 'report_data' not in data:
            return jsonify({'error': 'Report data is required'}), 400
        
        report_data = data['report_data']
        report_type = data.get('report_type', 'general')
        
        logger.info(f"Report analysis for type: {report_type}")
        
        # Analyze medical report
        analysis = advanced_ai.analyze_medical_report_ai(report_data, report_type)
        
        return jsonify({
            'success': True,
            'data': {
                'summary': f"Analysis of {report_type} report completed",
                'key_findings': analysis['key_findings'],
                'recommendations': analysis['recommendations'],
                'confidence_score': analysis['confidence'],
                'timestamp': analysis['analysis_timestamp']
            }
        })
        
    except Exception as e:
        logger.error(f"Report Analyzer error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Report analysis error',
            'message': str(e)
        }), 500

# Symptom Checker Endpoint
@app.route('/api/symptom-checker/check', methods=['POST'])
@limiter.limit("25 per minute")
def symptom_checker_check():
    """AI Symptom Checker endpoint"""
    try:
        data = request.get_json()
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'Symptoms are required'}), 400
        
        symptoms = data['symptoms']
        age = data.get('age', 30)
        gender = data.get('gender', 'unknown')
        
        logger.info(f"Symptom analysis for {len(symptoms)} symptoms")
        
        # Analyze symptoms
        analysis = advanced_ai.analyze_symptoms_ai(symptoms, age, gender)
        
        return jsonify({
            'success': True,
            'data': {
                'triage_level': analysis['severity_assessment'],
                'possible_conditions': analysis['possible_conditions'],
                'recommendations': analysis['follow_up_recommendations'],
                'urgency': analysis['severity_assessment'],
                'timestamp': analysis['analysis_timestamp']
            }
        })
        
    except Exception as e:
        logger.error(f"Symptom Checker error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Symptom analysis error',
            'message': str(e)
        }), 500

# Symptom Suggestion Endpoint
@app.route('/api/symptom-checker/suggest', methods=['POST'])
@limiter.limit("30 per minute")
def symptom_suggestion():
    """Symptom suggestion endpoint"""
    try:
        data = request.get_json()
        if not data or 'input_text' not in data:
            return jsonify({'error': 'Input text is required'}), 400
        
        input_text = data['input_text']
        logger.info(f"Symptom suggestions for: {input_text[:50]}...")
        
        # Generate symptom suggestions
        suggestions = advanced_ai.generate_symptom_suggestions(input_text)
        
        return jsonify({
            'success': True,
            'data': {
                'suggested_symptoms': suggestions['suggestions'],
                'related_categories': suggestions['common_patterns'],
                'timestamp': suggestions['timestamp']
            }
        })
        
    except Exception as e:
        logger.error(f"Symptom Suggestion error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Symptom suggestion error',
            'message': str(e)
        }), 500

# Patient Management Endpoints
@app.route('/api/patients', methods=['GET'])
@limiter.limit("100 per hour")
def get_patients():
    """Get all patients with optional pagination and search"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        
        # Synthetic patient data - 10 new patients with Indian names
        patients = [
            {
                "id": "P001",
                "email": "priya.sharma@gmail.com",
                "firstName": "Priya",
                "lastName": "Sharma",
                "phone": "",
                "dateOfBirth": "1987-06-14",
                "gender": "female",
                "medicalRecordNumber": "MRN-2024-001",
                "bloodType": "A+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Penicillin", "Shellfish", "Latex"],
                "chronicConditions": ["Type 1 Diabetes", "Hypothyroidism", "Celiac Disease"],
                "currentMedications": ["Insulin Glargine", "Levothyroxine 75mcg", "Vitamin D3 2000IU"],
                "createdAt": "2024-01-10T08:00:00Z",
                "updatedAt": "2024-01-25T14:30:00Z",
                "address": {
                    "street": "123 Oak Street",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78701"
                },
                "vitals": [
                    {
                        "id": "V001",
                        "timestamp": "2024-01-25T10:00:00Z",
                        "bloodPressure": {"systolic": 128, "diastolic": 82},
                        "heartRate": 68,
                        "temperature": 98.4,
                        "respiratoryRate": 16,
                        "oxygenSaturation": 98,
                        "weight": 65.2,
                        "height": 168,
                        "bmi": 23.1,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                                 "labResults": [
                     {
                         "id": "L001",
                         "testName": "HbA1c",
                         "value": "6.8",
                         "unit": "%",
                         "referenceRange": "4.0-5.6",
                         "status": "high",
                         "resultDate": "2024-01-23T09:00:00Z",
                         "orderedBy": "Dr. Priya Sharma",
                         "lab": "Austin Medical Labs",
                         "notes": "Elevated but improved from previous 7.2%"
                     }
                 ],
                 "riskAssessment": {
                     "overallRisk": "Low",
                     "riskScore": 25,
                     "lastAssessed": "2024-01-25T14:30:00Z",
                     "diabetesRisk": "Medium",
                     "kidneyRisk": "Low",
                     "cardiovascularRisk": "Low",
                     "recommendations": [
                         "Regular HbA1c monitoring",
                         "Kidney function check annually",
                         "Cardiovascular risk assessment"
                     ]
                 }
            },
            {
                "id": "P002",
                "email": "raj.patel@gmail.com",
                "firstName": "Raj",
                "lastName": "Patel",
                "phone": "",
                "dateOfBirth": "1975-11-22",
                "gender": "male",
                "medicalRecordNumber": "MRN-2024-002",
                "bloodType": "O-",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Sulfa drugs", "Peanuts", "Dairy"],
                "chronicConditions": ["Coronary Artery Disease", "Hyperlipidemia", "Sleep Apnea", "GERD"],
                "currentMedications": ["Atorvastatin 40mg", "Aspirin 81mg", "Metoprolol 50mg", "Omeprazole 20mg"],
                "createdAt": "2024-01-11T09:15:00Z",
                "updatedAt": "2024-01-26T11:45:00Z",
                "address": {
                    "street": "456 Pine Avenue",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78702"
                },
                "vitals": [
                    {
                        "id": "V002",
                        "timestamp": "2024-01-26T09:00:00Z",
                        "bloodPressure": {"systolic": 145, "diastolic": 92},
                        "heartRate": 72,
                        "temperature": 98.2,
                        "respiratoryRate": 18,
                        "oxygenSaturation": 96,
                        "weight": 88.5,
                        "height": 175,
                        "bmi": 28.9,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                                 "labResults": [
                     {
                         "id": "L002",
                         "testName": "LDL Cholesterol",
                         "value": "135",
                         "unit": "mg/dL",
                         "referenceRange": "<100",
                         "status": "high",
                         "resultDate": "2024-01-24T10:30:00Z",
                         "orderedBy": "Dr. Priya Sharma",
                         "lab": "Austin Medical Labs",
                         "notes": "Above target - consider increasing statin dose"
                     }
                 ],
                 "riskAssessment": {
                     "overallRisk": "Low",
                     "riskScore": 30,
                     "lastAssessed": "2024-01-26T11:45:00Z",
                     "cardiovascularRisk": "Medium",
                     "respiratoryRisk": "Low",
                     "metabolicRisk": "Low",
                     "recommendations": [
                         "Regular cardiovascular monitoring",
                         "Sleep apnea screening",
                         "Lifestyle modification counseling"
                     ]
                 }
            },
            {
                "id": "P003",
                "email": "ananya.kumar@gmail.com",
                "firstName": "Ananya",
                "lastName": "Kumar",
                "phone": "",
                "dateOfBirth": "1990-03-08",
                "gender": "female",
                "medicalRecordNumber": "MRN-2024-003",
                "bloodType": "B+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Ibuprofen", "Tree nuts", "Mold"],
                "chronicConditions": ["Migraine", "Anxiety", "Irritable Bowel Syndrome", "PCOS"],
                "currentMedications": ["Sumatriptan 100mg", "Sertraline 100mg", "Probiotics", "Metformin 500mg"],
                "createdAt": "2024-01-12T10:30:00Z",
                "updatedAt": "2024-01-27T16:20:00Z",
                "address": {
                    "street": "789 Cedar Lane",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78703"
                },
                "vitals": [
                    {
                        "id": "V003",
                        "timestamp": "2024-01-27T14:00:00Z",
                        "bloodPressure": {"systolic": 115, "diastolic": 74},
                        "heartRate": 76,
                        "temperature": 98.6,
                        "respiratoryRate": 17,
                        "oxygenSaturation": 99,
                        "weight": 58.9,
                        "height": 165,
                        "bmi": 21.6,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                                 "labResults": [
                     {
                         "id": "L003",
                         "testName": "Vitamin D",
                         "value": "22",
                         "unit": "ng/mL",
                         "referenceRange": "30-100",
                         "status": "low",
                         "resultDate": "2024-01-25T11:15:00Z",
                         "orderedBy": "Dr. Priya Sharma",
                         "lab": "Austin Medical Labs",
                         "notes": "Deficient - recommend 4000IU daily supplementation"
                     }
                 ],
                 "riskAssessment": {
                     "overallRisk": "Low",
                     "riskScore": 28,
                     "lastAssessed": "2024-01-27T16:20:00Z",
                     "endocrineRisk": "Low",
                     "neurologicalRisk": "Low",
                     "mentalHealthRisk": "Low",
                     "recommendations": [
                         "Vitamin D supplementation",
                         "Regular exercise for PCOS management",
                         "Stress management techniques"
                     ]
                 }
            },
            {
                "id": "P004",
                "email": "arjun.singh@gmail.com",
                "firstName": "Arjun",
                "lastName": "Singh",
                "phone": "",
                "dateOfBirth": "1968-07-15",
                "gender": "male",
                "medicalRecordNumber": "MRN-2024-004",
                "bloodType": "AB+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Codeine", "Eggs", "Soy"],
                "chronicConditions": ["Prostate Cancer (Stage 2)", "Benign Prostatic Hyperplasia", "Osteoarthritis", "Hypertension"],
                "currentMedications": ["Tamsulosin 0.8mg", "Acetaminophen 500mg", "Lisinopril 20mg", "Multivitamin"],
                "createdAt": "2024-01-13T11:45:00Z",
                "updatedAt": "2024-01-28T13:10:00Z",
                "address": {
                    "street": "321 Elm Street",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78704"
                },
                "vitals": [
                    {
                        "id": "V004",
                        "timestamp": "2024-01-28T12:00:00Z",
                        "bloodPressure": {"systolic": 152, "diastolic": 96},
                        "heartRate": 78,
                        "temperature": 98.1,
                        "respiratoryRate": 19,
                        "oxygenSaturation": 97,
                        "weight": 92.3,
                        "height": 178,
                        "bmi": 29.2,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                "labResults": [
                    {
                        "id": "L004",
                        "testName": "PSA",
                        "value": "4.8",
                        "unit": "ng/mL",
                        "referenceRange": "<4.0",
                        "status": "high",
                        "resultDate": "2024-01-26T13:45:00Z",
                        "orderedBy": "Dr. Priya Sharma",
                        "lab": "Austin Medical Labs",
                        "notes": "Elevated - requires urology consultation"
                    }
                ],
                "riskAssessment": {
                    "overallRisk": "Low",
                    "riskScore": 32,
                    "lastAssessed": "2024-01-28T13:10:00Z",
                    "oncologyRisk": "Medium",
                    "urologicalRisk": "Medium",
                    "cardiovascularRisk": "Low",
                    "recommendations": [
                        "Regular PSA monitoring",
                        "Prostate health screening",
                        "Blood pressure management"
                    ]
                }
            },
            {
                "id": "P005",
                "email": "meera.reddy@gmail.com",
                "firstName": "Meera",
                "lastName": "Reddy",
                "phone": "",
                "dateOfBirth": "1983-12-03",
                "gender": "female",
                "medicalRecordNumber": "MRN-2024-005",
                "bloodType": "O+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Aspirin", "Shellfish", "Dust mites"],
                "chronicConditions": ["Rheumatoid Arthritis", "Fibromyalgia", "Depression", "Asthma"],
                "currentMedications": ["Methotrexate 20mg", "Folic Acid 5mg", "Duloxetine 60mg", "Albuterol inhaler"],
                "createdAt": "2024-01-14T13:20:00Z",
                "updatedAt": "2024-01-29T15:45:00Z",
                "address": {
                    "street": "654 Maple Drive",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78705"
                },
                "vitals": [
                    {
                        "id": "V005",
                        "timestamp": "2024-01-29T14:30:00Z",
                        "bloodPressure": {"systolic": 118, "diastolic": 76},
                        "heartRate": 70,
                        "temperature": 98.5,
                        "respiratoryRate": 16,
                        "oxygenSaturation": 98,
                        "weight": 63.1,
                        "height": 170,
                        "bmi": 21.8,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                                 "labResults": [
                     {
                         "id": "L005",
                         "testName": "ESR (Erythrocyte Sedimentation Rate)",
                         "value": "38",
                         "unit": "mm/hr",
                         "referenceRange": "0-20",
                         "status": "high",
                         "resultDate": "2024-01-27T16:00:00Z",
                         "orderedBy": "Dr. Priya Sharma",
                         "lab": "Austin Medical Labs",
                         "notes": "Elevated - consistent with inflammatory process"
                     }
                 ],
                 "riskAssessment": {
                     "overallRisk": "Medium",
                     "riskScore": 55,
                     "lastAssessed": "2024-01-29T15:45:00Z",
                     "rheumatologicalRisk": "Medium",
                     "respiratoryRisk": "Medium",
                     "mentalHealthRisk": "Medium",
                     "recommendations": [
                         "Rheumatology consultation",
                         "Regular inflammatory marker monitoring",
                         "Physical therapy for arthritis management"
                     ]
                 }
            },
            {
                "id": "P006",
                "email": "vikram.malhotra@gmail.com",
                "firstName": "Vikram",
                "lastName": "Malhotra",
                "phone": "",
                "dateOfBirth": "1970-04-18",
                "gender": "male",
                "medicalRecordNumber": "MRN-2024-006",
                "bloodType": "A-",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Cephalosporins", "Peanuts", "Latex"],
                "chronicConditions": ["Chronic Kidney Disease (Stage 4)", "Hypertension", "Type 2 Diabetes", "Sleep Apnea"],
                "currentMedications": ["Lisinopril 40mg", "Metformin 1000mg", "Amlodipine 10mg", "Furosemide 80mg"],
                "createdAt": "2024-01-15T10:15:00Z",
                "updatedAt": "2024-01-30T12:30:00Z",
                "address": {
                    "street": "987 Walnut Street",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78706"
                },
                "vitals": [
                    {
                        "id": "V006",
                        "timestamp": "2024-01-30T11:00:00Z",
                        "bloodPressure": {"systolic": 158, "diastolic": 102},
                        "heartRate": 84,
                        "temperature": 98.0,
                        "respiratoryRate": 20,
                        "oxygenSaturation": 94,
                        "weight": 96.8,
                        "height": 182,
                        "bmi": 29.2,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                "labResults": [
                    {
                        "id": "L006",
                        "testName": "Creatinine",
                        "value": "3.2",
                        "unit": "mg/dL",
                        "referenceRange": "0.7-1.3",
                        "status": "high",
                        "resultDate": "2024-01-28T14:15:00Z",
                        "orderedBy": "Dr. Priya Sharma",
                        "lab": "Austin Medical Labs",
                        "notes": "Significantly elevated - indicates advanced kidney disease"
                    }
                ],
                "riskAssessment": {
                    "overallRisk": "Medium",
                    "riskScore": 58,
                    "lastAssessed": "2024-01-30T12:30:00Z",
                    "renalRisk": "Medium",
                    "diabetesRisk": "Medium",
                    "cardiovascularRisk": "Medium",
                    "recommendations": [
                        "Regular kidney function monitoring",
                        "Diabetes management optimization",
                        "Cardiovascular risk assessment"
                    ]
                }
            },
            {
                "id": "P007",
                "email": "aditi.verma@gmail.com",
                "firstName": "Aditi",
                "lastName": "Verma",
                "phone": "",
                "dateOfBirth": "1995-08-25",
                "gender": "female",
                "medicalRecordNumber": "MRN-2024-007",
                "bloodType": "B-",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Penicillin", "Tree nuts", "Mold"],
                "chronicConditions": ["Epilepsy", "Anxiety", "Migraine", "Insomnia"],
                "currentMedications": ["Levetiracetam 1000mg", "Escitalopram 20mg", "Sumatriptan 50mg", "Zolpidem 10mg"],
                "createdAt": "2024-01-16T14:30:00Z",
                "updatedAt": "2024-01-31T17:20:00Z",
                "address": {
                    "street": "147 Birch Road",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78707"
                },
                "vitals": [
                    {
                        "id": "V007",
                        "timestamp": "2024-01-31T16:00:00Z",
                        "bloodPressure": {"systolic": 112, "diastolic": 72},
                        "heartRate": 74,
                        "temperature": 98.7,
                        "respiratoryRate": 18,
                        "oxygenSaturation": 99,
                        "weight": 55.8,
                        "height": 163,
                        "bmi": 21.0,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                "labResults": [
                    {
                        "id": "L007",
                        "testName": "Valproic Acid Level",
                        "value": "45",
                        "unit": "mcg/mL",
                        "referenceRange": "50-100",
                        "status": "low",
                        "resultDate": "2024-01-29T15:30:00Z",
                        "orderedBy": "Dr. Priya Sharma",
                        "lab": "Austin Medical Labs",
                        "notes": "Below therapeutic range - consider dose adjustment"
                    }
                ],
                "riskAssessment": {
                    "overallRisk": "Medium",
                    "riskScore": 52,
                    "lastAssessed": "2024-01-31T17:20:00Z",
                    "neurologicalRisk": "Medium",
                    "mentalHealthRisk": "Medium",
                    "medicationRisk": "Medium",
                    "recommendations": [
                        "Neurology consultation for epilepsy management",
                        "Medication level monitoring",
                        "Sleep hygiene counseling"
                    ]
                }
            },
            {
                "id": "P008",
                "email": "rahul.gupta@gmail.com",
                "firstName": "Rahul",
                "lastName": "Gupta",
                "phone": "",
                "dateOfBirth": "1980-01-30",
                "gender": "male",
                "medicalRecordNumber": "MRN-2024-008",
                "bloodType": "O+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Sulfa drugs", "Eggs", "Dairy"],
                "chronicConditions": ["Crohn's Disease", "Anemia", "Vitamin D Deficiency", "Osteoporosis"],
                "currentMedications": ["Mesalamine 1200mg", "Iron Sulfate 325mg", "Vitamin D3 4000IU", "Calcium Carbonate 1000mg"],
                "createdAt": "2024-01-17T11:45:00Z",
                "updatedAt": "2024-02-01T13:15:00Z",
                "address": {
                    "street": "258 Spruce Lane",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78708"
                },
                "vitals": [
                    {
                        "id": "V008",
                        "timestamp": "2024-02-01T12:00:00Z",
                        "bloodPressure": {"systolic": 125, "diastolic": 78},
                        "heartRate": 70,
                        "temperature": 98.3,
                        "respiratoryRate": 17,
                        "oxygenSaturation": 97,
                        "weight": 67.5,
                        "height": 175,
                        "bmi": 22.0,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                "labResults": [
                    {
                        "id": "L008",
                        "testName": "Hemoglobin",
                        "value": "11.2",
                        "unit": "g/dL",
                        "referenceRange": "13.5-17.5",
                        "status": "low",
                        "resultDate": "2024-01-30T16:45:00Z",
                        "orderedBy": "Dr. Priya Sharma",
                        "lab": "Austin Medical Labs",
                        "notes": "Anemic - continue iron supplementation and monitor"
                    }
                ],
                "riskAssessment": {
                    "overallRisk": "High",
                    "riskScore": 75,
                    "lastAssessed": "2024-02-01T13:15:00Z",
                    "gastrointestinalRisk": "High",
                    "nutritionalRisk": "High",
                    "boneHealthRisk": "Medium",
                    "recommendations": [
                        "Gastroenterology consultation",
                        "Nutritional assessment and supplementation",
                        "Bone density monitoring"
                    ]
                }
            },
            {
                "id": "P009",
                "email": "kavya.iyer@gmail.com",
                "firstName": "Kavya",
                "lastName": "Iyer",
                "phone": "",
                "dateOfBirth": "1988-05-12",
                "gender": "female",
                "medicalRecordNumber": "MRN-2024-009",
                "bloodType": "AB-",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Ibuprofen", "Shellfish", "Dust mites"],
                "chronicConditions": ["Multiple Sclerosis", "Depression", "Osteoporosis", "Vitamin B12 Deficiency"],
                "currentMedications": ["Interferon beta-1a", "Sertraline 100mg", "Alendronate 70mg", "Vitamin B12 1000mcg"],
                "createdAt": "2024-01-18T13:20:00Z",
                "updatedAt": "2024-02-02T14:30:00Z",
                "address": {
                    "street": "369 Willow Way",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78709"
                },
                "vitals": [
                    {
                        "id": "V009",
                        "timestamp": "2024-02-02T13:00:00Z",
                        "bloodPressure": {"systolic": 118, "diastolic": 74},
                        "heartRate": 72,
                        "temperature": 98.4,
                        "respiratoryRate": 16,
                        "oxygenSaturation": 98,
                        "weight": 59.2,
                        "height": 167,
                        "bmi": 21.2,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                "labResults": [
                    {
                        "id": "L009",
                        "testName": "Vitamin B12",
                        "value": "180",
                        "unit": "pg/mL",
                        "referenceRange": "200-900",
                        "status": "low",
                        "resultDate": "2024-01-31T17:15:00Z",
                        "orderedBy": "Dr. Priya Sharma",
                        "lab": "Austin Medical Labs",
                        "notes": "Deficient - continue B12 supplementation"
                    }
                ],
                "riskAssessment": {
                    "overallRisk": "High",
                    "riskScore": 78,
                    "lastAssessed": "2024-02-02T14:30:00Z",
                    "neurologicalRisk": "High",
                    "mentalHealthRisk": "Medium",
                    "boneHealthRisk": "Medium",
                    "recommendations": [
                        "Neurology consultation for MS management",
                        "Regular MRI monitoring",
                        "Physical therapy and mobility assessment"
                    ]
                }
            },
            {
                "id": "P010",
                "email": "dev.agarwal@gmail.com",
                "firstName": "Dev",
                "lastName": "Agarwal",
                "phone": "",
                "dateOfBirth": "1973-09-20",
                "gender": "male",
                "medicalRecordNumber": "MRN-2024-010",
                "bloodType": "A+",
                "emergencyContactName": "",
                "emergencyContactPhone": "",
                "allergies": ["Codeine", "Peanuts", "Latex"],
                "chronicConditions": ["Heart Failure (EF 35%)", "Atrial Fibrillation", "Diabetes", "Sleep Apnea"],
                "currentMedications": ["Carvedilol 25mg", "Digoxin 0.25mg", "Warfarin 5mg", "Metformin 1000mg"],
                "createdAt": "2024-01-19T10:15:00Z",
                "updatedAt": "2024-02-03T11:45:00Z",
                "address": {
                    "street": "741 Cypress Court",
                    "city": "Austin",
                    "state": "TX",
                    "zipCode": "78710"
                },
                "vitals": [
                    {
                        "id": "V010",
                        "timestamp": "2024-02-03T10:00:00Z",
                        "bloodPressure": {"systolic": 135, "diastolic": 88},
                        "heartRate": 92,
                        "temperature": 98.1,
                        "respiratoryRate": 22,
                        "oxygenSaturation": 93,
                        "weight": 89.4,
                        "height": 180,
                        "bmi": 27.6,
                        "recordedBy": "Dr. Priya Sharma"
                    }
                ],
                                 "labResults": [
                     {
                         "id": "L010",
                         "testName": "BNP (Brain Natriuretic Peptide)",
                         "value": "450",
                         "unit": "pg/mL",
                         "referenceRange": "<100",
                         "status": "high",
                         "resultDate": "2024-02-01T18:30:00Z",
                         "orderedBy": "Dr. Priya Sharma",
                         "lab": "Austin Medical Labs",
                         "notes": "Elevated - indicates heart failure decompensation"
                     }
                 ],
                 "riskAssessment": {
                     "overallRisk": "High",
                     "riskScore": 82,
                     "lastAssessed": "2024-02-03T11:45:00Z",
                     "cardiovascularRisk": "High",
                     "diabetesRisk": "High",
                     "respiratoryRisk": "Medium",
                     "recommendations": [
                         "Cardiology consultation",
                         "Heart failure optimization",
                         "Diabetes management intensification"
                     ]
                 }
            }
        ]
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            patients = [
                p for p in patients 
                if (search_lower in p['firstName'].lower() or 
                    search_lower in p['lastName'].lower() or 
                    search_lower in p['email'].lower() or
                    search_lower in p['medicalRecordNumber'].lower())
            ]
        
        # Apply pagination
        total = len(patients)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_patients = patients[start_idx:end_idx]
        
        return jsonify({
            'success': True,
            'message': 'Patients retrieved successfully',
            'data': {
                'patients': paginated_patients,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': total,
                    'pages': (total + limit - 1) // limit
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Error retrieving patients: {str(e)}")
        return jsonify({'error': 'Failed to retrieve patients'}), 500

@app.route('/api/patients/<patient_id>', methods=['GET'])
@limiter.limit("200 per hour")
def get_patient(patient_id):
    """Get a specific patient by ID"""
    try:
        # Get all patients and find the specific one
        patients_response = get_patients()
        patients_data = patients_response.get_json()
        
        if not patients_data['success']:
            return jsonify({'error': 'Failed to retrieve patients'}), 500
        
        patients = patients_data['data']['patients']
        patient = next((p for p in patients if p['id'] == patient_id), None)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Patient retrieved successfully',
            'data': {'patient': patient}
        })
        
    except Exception as e:
        logger.error(f"Error retrieving patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve patient'}), 500

@app.route('/api/patients', methods=['POST'])
@limiter.limit("50 per hour")
def create_patient():
    """Create a new patient"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Patient data is required'}), 400
        
        # Validate required fields
        required_fields = ['email', 'firstName', 'lastName']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate new patient ID
        new_patient_id = f"P{str(len(get_patients().get_json()['data']['patients']) + 1).zfill(3)}"
        
        # Create new patient with timestamp
        new_patient = {
            "id": new_patient_id,
            "email": data['email'],
            "firstName": data['firstName'],
            "lastName": data['lastName'],
            "phone": data.get('phone'),
            "dateOfBirth": data.get('dateOfBirth'),
            "gender": data.get('gender'),
            "medicalRecordNumber": f"MRN-2024-{str(len(get_patients().get_json()['data']['patients']) + 1).zfill(3)}",
            "bloodType": data.get('bloodType'),
            "emergencyContactName": "",
            "emergencyContactPhone": "",
            "allergies": data.get('allergies', []),
            "chronicConditions": data.get('chronicConditions', []),
            "currentMedications": data.get('currentMedications', []),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "address": data.get('address', {}),
            "vitals": [],
            "labResults": []
        }
        
        # Generate temporary password
        temp_password = f"Temp{new_patient_id}!"
        
        return jsonify({
            'success': True,
            'message': 'Patient created successfully',
            'data': {
                'patient': new_patient,
                'tempPassword': temp_password
            }
        })
        
    except Exception as e:
        logger.error(f"Error creating patient: {str(e)}")
        return jsonify({'error': 'Failed to create patient'}), 500

@app.route('/api/patients/<patient_id>', methods=['PUT'])
@limiter.limit("100 per hour")
def update_patient(patient_id):
    """Update an existing patient"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Update data is required'}), 400
        
        # Get existing patient
        patients_response = get_patients()
        patients_data = patients_response.get_json()
        
        if not patients_data['success']:
            return jsonify({'error': 'Failed to retrieve patients'}), 500
        
        patients = patients_data['data']['patients']
        patient = next((p for p in patients if p['id'] == patient_id), None)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Update patient fields
        for key, value in data.items():
            if key in patient and key not in ['id', 'createdAt']:
                patient[key] = value
        
        patient['updatedAt'] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'message': 'Patient updated successfully',
            'data': {'patient': patient}
        })
        
    except Exception as e:
        logger.error(f"Error updating patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to update patient'}), 500

@app.route('/api/patients/<patient_id>/medical-records', methods=['GET'])
@limiter.limit("200 per hour")
def get_medical_records(patient_id):
    """Get medical records for a specific patient"""
    try:
        # Get patient first
        patient_response = get_patient(patient_id)
        patient_data = patient_response.get_json()
        
        if not patient_data['success']:
            return jsonify({'error': 'Patient not found'}), 404
        
        patient = patient_data['data']['patient']
        
        # Return medical records (vitals and lab results)
        medical_records = {
            'vitals': patient.get('vitals', []),
            'labResults': patient.get('labResults', []),
            'chronicConditions': patient.get('chronicConditions', []),
            'allergies': patient.get('allergies', []),
            'currentMedications': patient.get('currentMedications', [])
        }
        
        return jsonify({
            'success': True,
            'message': 'Medical records retrieved successfully',
            'data': {'records': medical_records}
        })
        
    except Exception as e:
        logger.error(f"Error retrieving medical records for patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve medical records'}), 500

# Access Request Endpoints
@app.route('/api/access-requests', methods=['GET'])
@limiter.limit("200 per hour")
def get_access_requests():
    """Get all access requests for the authenticated user"""
    try:
        # In a real app, this would check JWT token and get user ID
        # For now, return mock data
        access_requests = [
            {
                'id': 'AR001',
                                 'patientId': 'P001',
                 'patientName': 'Priya Sharma',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'full_access',
                'purpose': 'Emergency consultation for chest pain',
                'requestedData': ['Medical History', 'Lab Results', 'Prescriptions', 'Vital Signs'],
                'status': 'approved',
                'requestDate': '2024-01-15T10:30:00Z',
                'responseDate': '2024-01-15T14:30:00Z',
                'expiryDate': '2024-01-22T10:30:00Z',
                'notes': 'Patient presented to ER with acute chest pain. Access granted for emergency assessment.'
            },
            {
                'id': 'AR002',
                                 'patientId': 'P003',
                 'patientName': 'Ananya Kumar',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'full_access',
                'purpose': 'Comprehensive diabetes management review',
                'requestedData': ['Medical History', 'Lab Results', 'Prescriptions', 'Vital Signs', 'Imaging'],
                'status': 'approved',
                'requestDate': '2024-01-13T08:45:00Z',
                'responseDate': '2024-01-13T14:20:00Z',
                'expiryDate': '2024-01-20T08:45:00Z',
                'notes': 'Access granted for comprehensive diabetes management'
            },
            {
                'id': 'AR003',
                                 'patientId': 'P005',
                 'patientName': 'Meera Reddy',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'limited_access',
                'purpose': 'Rheumatoid arthritis follow-up',
                'requestedData': ['Recent Lab Results', 'Current Prescriptions', 'Vital Signs'],
                'status': 'approved',
                'requestDate': '2024-01-14T09:15:00Z',
                'responseDate': '2024-01-14T14:30:00Z',
                'expiryDate': '2024-01-21T09:15:00Z',
                'notes': 'Access granted for arthritis management follow-up'
            },
            {
                'id': 'AR004',
                                 'patientId': 'P007',
                 'patientName': 'Aditi Verma',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'full_access',
                'purpose': 'Epilepsy management and monitoring',
                'requestedData': ['Medical History', 'Lab Results', 'Prescriptions', 'Vital Signs'],
                'status': 'approved',
                'requestDate': '2024-01-16T10:30:00Z',
                'responseDate': '2024-01-16T15:30:00Z',
                'expiryDate': '2024-01-23T10:30:00Z',
                'notes': 'Access granted for epilepsy management'
            },
            {
                'id': 'AR005',
                                 'patientId': 'P009',
                 'patientName': 'Kavya Iyer',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'limited_access',
                'purpose': 'Multiple sclerosis monitoring',
                'requestedData': ['Recent Lab Results', 'Current Prescriptions'],
                'status': 'approved',
                'requestDate': '2024-01-17T11:15:00Z',
                'responseDate': '2024-01-17T16:15:00Z',
                'expiryDate': '2024-01-24T11:15:00Z',
                'notes': 'Access granted for MS monitoring'
            },
            {
                'id': 'AR006',
                                 'patientId': 'P002',
                 'patientName': 'Raj Patel',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'limited_access',
                'purpose': 'Follow-up consultation',
                'requestedData': ['Recent Lab Results', 'Current Prescriptions'],
                'status': 'pending',
                'requestDate': '2024-01-18T09:15:00Z',
                'expiryDate': '2024-01-25T09:15:00Z',
                'notes': 'Request for follow-up consultation pending approval'
            },
            {
                'id': 'AR007',
                                 'patientId': 'P004',
                 'patientName': 'Arjun Singh',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'full_access',
                'purpose': 'Prostate cancer management',
                'requestedData': ['Medical History', 'Lab Results', 'Imaging', 'Prescriptions'],
                'status': 'pending',
                'requestDate': '2024-01-19T10:30:00Z',
                'expiryDate': '2024-01-26T10:30:00Z',
                'notes': 'Request for cancer management access pending approval'
            },
            {
                'id': 'AR008',
                                 'patientId': 'P006',
                 'patientName': 'Vikram Malhotra',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'limited_access',
                'purpose': 'Kidney disease monitoring',
                'requestedData': ['Recent Lab Results', 'Current Prescriptions'],
                'status': 'pending',
                'requestDate': '2024-01-20T11:45:00Z',
                'expiryDate': '2024-01-27T11:45:00Z',
                'notes': 'Request for kidney disease monitoring pending approval'
            },
            {
                'id': 'AR009',
                                 'patientId': 'P008',
                 'patientName': 'Rahul Gupta',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'limited_access',
                'purpose': 'Crohn\'s disease management',
                'requestedData': ['Recent Lab Results', 'Current Prescriptions'],
                'status': 'pending',
                'requestDate': '2024-01-21T12:00:00Z',
                'expiryDate': '2024-01-28T12:00:00Z',
                'notes': 'Request for Crohn\'s disease management pending approval'
            },
            {
                'id': 'AR010',
                                 'patientId': 'P010',
                 'patientName': 'Dev Agarwal',
                 'requesterId': 'D001',
                 'requesterName': 'Dr. Priya Sharma',
                 'requesterRole': 'doctor',
                'requestType': 'full_access',
                'purpose': 'Heart failure management',
                'requestedData': ['Medical History', 'Lab Results', 'Prescriptions', 'Vital Signs'],
                'status': 'pending',
                'requestDate': '2024-01-22T13:15:00Z',
                'expiryDate': '2024-01-29T13:15:00Z',
                'notes': 'Request for heart failure management pending approval'
            }
        ]
        
        return jsonify({
            'success': True,
            'message': 'Access requests retrieved successfully',
            'data': {'accessRequests': access_requests}
        })
        
    except Exception as e:
        logger.error(f"Error retrieving access requests: {str(e)}")
        return jsonify({'error': 'Failed to retrieve access requests'}), 500

@app.route('/api/access-requests', methods=['POST'])
@limiter.limit("50 per hour")
def create_access_request():
    """Create a new access request"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['patientId', 'requestType', 'purpose', 'requestedData']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # In a real app, this would create a new access request in the database
        # For now, return a mock response
        new_request = {
            'id': f'AR{str(int(time.time()))}',
            'patientId': data['patientId'],
            'patientName': 'Patient Name',  # Would be fetched from patient data
            'requesterId': 'D001',  # Would come from JWT token
                         'requesterName': 'Dr. Priya Sharma',  # Would come from JWT token
            'requesterRole': 'doctor',
            'requestType': data['requestType'],
            'purpose': data['purpose'],
            'requestedData': data['requestedData'],
            'status': 'pending',
            'requestDate': datetime.now().isoformat(),
            'expiryDate': (datetime.now() + timedelta(days=7)).isoformat(),
            'notes': data.get('notes', '')
        }
        
        return jsonify({
            'success': True,
            'message': 'Access request created successfully',
            'data': {'accessRequest': new_request}
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating access request: {str(e)}")
        return jsonify({'error': 'Failed to create access request'}), 500

@app.route('/api/access-requests/<request_id>/approve', methods=['POST'])
@limiter.limit("100 per hour")
def approve_access_request(request_id):
    """Approve an access request"""
    try:
        # In a real app, this would update the request status in the database
        # For now, return a mock response
        return jsonify({
            'success': True,
            'message': 'Access request approved successfully',
            'data': {'requestId': request_id, 'status': 'approved'}
        })
        
    except Exception as e:
        logger.error(f"Error approving access request {request_id}: {str(e)}")
        return jsonify({'error': 'Failed to approve access request'}), 500

@app.route('/api/access-requests/<request_id>/deny', methods=['POST'])
@limiter.limit("100 per hour")
def deny_access_request(request_id):
    """Deny an access request"""
    try:
        data = request.get_json()
        reason = data.get('reason', 'No reason provided') if data else 'No reason provided'
        
        # In a real app, this would update the request status in the database
        # For now, we'll update our global access control state to reflect the denied status
        
        # Find the patient ID from the request ID and update their access status
        global patient_access_control, request_patient_mapping
        
        # Get the patient ID from the request ID
        patient_id = request_patient_mapping.get(request_id)
        
        if patient_id and patient_id in patient_access_control:
            # Update the patient's access status to denied
            patient_access_control[patient_id]['status'] = 'denied'
            patient_access_control[patient_id]['accessLevel'] = 'none'
            patient_access_control[patient_id]['lastAccessGranted'] = None
            
            logger.info(f"Access denied for patient {patient_id} due to request {request_id}")
        else:
            logger.warning(f"Could not find patient mapping for request {request_id}")
        
        return jsonify({
            'success': True,
            'message': 'Access request denied successfully',
            'data': {
                'requestId': request_id, 
                'status': 'denied',
                'denialReason': reason,
                'deniedAt': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error denying access request {request_id}: {str(e)}")
        return jsonify({'error': 'Failed to deny access request'}), 500

@app.route('/api/access-check/<patient_id>', methods=['GET'])
@limiter.limit("200 per hour")
def check_patient_access(patient_id):
    """Check if the current doctor has access to a specific patient"""
    try:
        # Use the global access control state
        global patient_access_control
        
        patient_access = patient_access_control.get(patient_id, {'status': 'none', 'accessLevel': 'none', 'lastAccessGranted': None})
        
        has_access = patient_access['status'] == 'approved'
        
        return jsonify({
            'success': True,
            'message': 'Access check completed',
            'data': {
                'patientId': patient_id,
                'hasAccess': has_access,
                'accessLevel': patient_access['accessLevel'],
                'status': patient_access['status'],
                'lastAccessGranted': patient_access['lastAccessGranted']
            }
        })
        
    except Exception as e:
        logger.error(f"Error checking access for patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to check patient access'}), 500

@app.route('/api/risk-assessment/<patient_id>', methods=['GET'])
@limiter.limit("100 per hour")
def get_patient_risk_assessment(patient_id):
    """Get risk assessment for a specific patient (only if access is granted)"""
    try:
        # First check if the doctor has access to this patient
        global patient_access_control
        
        patient_access = patient_access_control.get(patient_id, {'status': 'none', 'accessLevel': 'none', 'lastAccessGranted': None})
        
        if patient_access['status'] != 'approved':
            return jsonify({
                'success': False,
                'error': 'Access denied',
                'message': 'You do not have access to this patient\'s risk assessment. Please submit an access request first.'
            }), 403
        
        # Get patient data including risk assessment
        patients_response = get_patients()
        patients_data = patients_response.get_json()
        
        if not patients_data['success']:
            return jsonify({'error': 'Failed to retrieve patient data'}), 500
        
        patients = patients_data['data']['patients']
        patient = next((p for p in patients if p['id'] == patient_id), None)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Check if patient has risk assessment data
        risk_assessment = patient.get('riskAssessment')
        
        if not risk_assessment:
            return jsonify({
                'success': False,
                'error': 'No risk assessment available',
                'message': 'Risk assessment has not been completed for this patient yet.'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Risk assessment retrieved successfully',
            'data': {
                'patientId': patient_id,
                'patientName': f"{patient['firstName']} {patient['lastName']}",
                'riskAssessment': risk_assessment,
                'accessLevel': patient_access['accessLevel'],
                'lastAssessed': risk_assessment['lastAssessed']
            }
        })
        
    except Exception as e:
        logger.error(f"Error retrieving risk assessment for patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve risk assessment'}), 500

# WebSocket events for real-time communication
@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection"""
    logger.info("Client connected to WebSocket")
    emit('connected', {
        'data': 'Connected to CuraPath AI Backend',
        'timestamp': datetime.now().isoformat()
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection"""
    logger.info("Client disconnected from WebSocket")

@socketio.on('ai_message')
def handle_ai_message(data):
    """Handle real-time AI messages via WebSocket"""
    try:
        message = data.get('message', '')
        logger.info(f"WebSocket AI message: {message[:50]}...")
        
        # Process with real-time AI
        response = generate_enhanced_medical_response(message)
        
        # Emit response back to client
        emit('ai_response', {
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"WebSocket AI error: {str(e)}")
        emit('ai_response', {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(429)
def ratelimit_handler(error):
    return jsonify({'error': 'Rate limit exceeded'}), 429

if __name__ == '__main__':
    # Development server
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
else:
    # Production server
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
