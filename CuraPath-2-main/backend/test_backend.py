#!/usr/bin/env python3
"""
Comprehensive test script for CuraPath AI Medical Backend
Tests all AI endpoints and functionality
"""

import requests
import json
import time
import sys
from datetime import datetime

BASE_URL = "http://localhost:5000"

def test_endpoint(endpoint, method="GET", data=None, description=""):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    print(f"\n🔍 Testing: {description or endpoint}")
    print(f"   URL: {url}")
    print(f"   Method: {method}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url, json=data, headers=headers, timeout=15)
        else:
            print(f"   ❌ Unsupported method: {method}")
            return False
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                response_data = response.json()
                print(f"   ✅ Success: {response_data.get('message', 'OK')}")
                
                # Check for AI-specific data
                if 'data' in response_data:
                    data = response_data['data']
                    if 'metadata' in data:
                        metadata = data['metadata']
                        print(f"   🤖 AI Provider: {metadata.get('ai_provider', 'Unknown')}")
                        print(f"   📊 Confidence: {metadata.get('confidence', 'N/A')}")
                        if 'sources' in metadata:
                            print(f"   📚 Sources: {', '.join(metadata['sources'][:2])}")
                
                return True
                
            except json.JSONDecodeError:
                print(f"   ⚠️  Response is not JSON: {response.text[:100]}...")
                return True
        else:
            print(f"   ❌ Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection failed - Is the Flask server running on {BASE_URL}?")
        return False
    except requests.exceptions.Timeout:
        print(f"   ❌ Request timeout")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_health_endpoints():
    """Test basic health and status endpoints"""
    print("\n🏥 Testing Health Endpoints")
    print("=" * 50)
    
    test_endpoint("/health", "GET", description="Health Check")
    test_endpoint("/", "GET", description="Home Endpoint")

def test_ai_assistant():
    """Test AI Medical Assistant"""
    print("\n🤖 Testing AI Medical Assistant")
    print("=" * 50)
    
    test_cases = [
        {
            'message': 'What are the latest treatment options for Type 2 diabetes?',
            'description': 'Diabetes Management Question'
        },
        {
            'message': 'Explain the symptoms of myocardial infarction',
            'description': 'Cardiac Symptoms Question'
        },
        {
            'message': 'What are the side effects of common blood pressure medications?',
            'description': 'Medication Side Effects Question'
        }
    ]
    
    for test_case in test_cases:
        data = {
            'message': test_case['message'],
            'history': []
        }
        test_endpoint("/api/ai-assistant/chat", "POST", data, test_case['description'])
        time.sleep(1)  # Rate limiting consideration

def test_risk_predictor():
    """Test Health Risk Predictor"""
    print("\n⚠️  Testing Health Risk Predictor")
    print("=" * 50)
    
    test_cases = [
        {
            'patient_data': {
                'age': 45,
                'conditions': ['hypertension', 'diabetes'],
                'vitals': {
                    'bp_systolic': 150,
                    'bp_diastolic': 95,
                    'weight': 85,
                    'height': 175
                },
                'medical_history': {
                    'smoking': True,
                    'family_history': True
                }
            },
            'description': 'High Risk Patient (45yo, HTN, DM, Smoking)'
        },
        {
            'patient_data': {
                'age': 25,
                'conditions': [],
                'vitals': {
                    'bp_systolic': 120,
                    'bp_diastolic': 80,
                    'weight': 70,
                    'height': 170
                },
                'medical_history': {
                    'smoking': False,
                    'family_history': False
                }
            },
            'description': 'Low Risk Patient (25yo, Healthy)'
        }
    ]
    
    for test_case in test_cases:
        test_endpoint("/api/risk-predictor/assess", "POST", test_case['patient_data'], test_case['description'])
        time.sleep(1)

def test_report_analyzer():
    """Test Medical Report Analyzer"""
    print("\n📋 Testing Medical Report Analyzer")
    print("=" * 50)
    
    test_cases = [
        {
            'report_data': """Patient: John Doe, Age: 58
Lab Results:
- Glucose: 145 mg/dL (High)
- HbA1c: 7.2% (Elevated)
- Cholesterol: 220 mg/dL (High)
- Blood Pressure: 155/95 mmHg (Elevated)

Findings: Patient shows signs of prediabetes and hypertension.
Recommendations: Lifestyle modifications and monitoring required.""",
            'report_type': 'lab_report',
            'description': 'Lab Report with Abnormal Values'
        },
        {
            'report_data': """Patient: Jane Smith, Age: 32
Imaging Results:
- Chest X-ray: Normal cardiac silhouette
- Lungs: Clear, no infiltrates
- Bones: No fractures or abnormalities

Findings: Normal chest X-ray examination.
Recommendations: No immediate intervention required.""",
            'report_type': 'imaging_report',
            'description': 'Normal Imaging Report'
        }
    ]
    
    for test_case in test_cases:
        data = {
            'report_data': test_case['report_data'],
            'report_type': test_case['report_type']
        }
        test_endpoint("/api/report-analyzer/analyze", "POST", data, test_case['description'])
        time.sleep(1)

def test_symptom_checker():
    """Test AI Symptom Checker"""
    print("\n🩺 Testing AI Symptom Checker")
    print("=" * 50)
    
    test_cases = [
        {
            'symptoms': ['chest pain', 'shortness of breath', 'fatigue'],
            'age': 55,
            'gender': 'male',
            'description': 'Cardiac Symptoms (55yo Male)'
        },
        {
            'symptoms': ['fever', 'cough', 'sore throat'],
            'age': 28,
            'gender': 'female',
            'description': 'Respiratory Symptoms (28yo Female)'
        },
        {
            'symptoms': ['headache', 'nausea', 'dizziness'],
            'age': 42,
            'gender': 'male',
            'description': 'Neurological Symptoms (42yo Male)'
        }
    ]
    
    for test_case in test_cases:
        data = {
            'symptoms': test_case['symptoms'],
            'age': test_case['age'],
            'gender': test_case['gender']
        }
        test_endpoint("/api/symptom-checker/check", "POST", data, test_case['description'])
        time.sleep(1)

def test_symptom_suggestions():
    """Test Symptom Suggestion System"""
    print("\n💡 Testing Symptom Suggestion System")
    print("=" * 50)
    
    test_cases = [
        {
            'input_text': 'I have pain in my chest and difficulty breathing',
            'description': 'Cardiac Symptom Input'
        },
        {
            'input_text': 'Experiencing stomach problems and nausea',
            'description': 'Gastrointestinal Symptom Input'
        }
    ]
    
    for test_case in test_cases:
        data = {
            'input_text': test_case['input_text']
        }
        test_endpoint("/api/symptom-checker/suggest", "POST", data, test_case['description'])
        time.sleep(1)

def main():
    """Main test function"""
    print("🧪 CuraPath AI Medical Backend - Comprehensive Test Suite")
    print("=" * 70)
    print(f"📅 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Testing backend at: {BASE_URL}")
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running and accessible")
        else:
            print(f"⚠️  Backend responded with status: {response.status_code}")
    except:
        print("❌ Cannot connect to backend server")
        print("   Make sure the Flask server is running: python run.py")
        sys.exit(1)
    
    # Run all tests
    test_health_endpoints()
    test_ai_assistant()
    test_risk_predictor()
    test_report_analyzer()
    test_symptom_checker()
    test_symptom_suggestions()
    
    print("\n" + "=" * 70)
    print("🎯 Testing Complete!")
    print("📊 Check the results above for any failed endpoints")
    print("🔧 For issues, check the backend logs and ensure all dependencies are installed")

if __name__ == '__main__':
    main()
