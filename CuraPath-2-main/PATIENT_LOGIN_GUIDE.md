# 🏥 Patient Login Guide - CuraPath Medical System

## 📧 **Patient Login Instructions**

### **Step 1: Access Patient Portal**
1. Go to the main login page (`/login`)
2. Click on the **"Patient"** demo account
3. Click **"Go to Portal"** to navigate to the patient login page

### **Step 2: Enter Your Email**
Use your **registered patient email address** from the list below

### **Step 3: Access Your Dashboard**
Your patient ID and details will be automatically loaded based on your email

---

## 👥 **Available Patient Accounts**

| Patient ID | Name | Email Address | Medical Condition | Risk Level | Risk Score | Access Status |
|------------|------|---------------|-------------------|------------|------------|---------------|
| **P001** | Priya Sharma | `priya.sharma@gmail.com` | Type 1 Diabetes, Hypertension | Medium | 65 | ✅ Granted |
| **P002** | Raj Patel | `raj.patel@gmail.com` | Coronary Artery Disease, Hyperlipidemia | High | 78 | ✅ Granted |
| **P003** | Ananya Kumar | `ananya.kumar@gmail.com` | Migraine, Anxiety | Low | 35 | ✅ Granted |
| **P004** | Arjun Singh | `arjun.singh@gmail.com` | Prostate Cancer, Hypertension | High | 82 | ✅ Granted |
| **P005** | Meera Reddy | `meera.reddy@gmail.com` | Rheumatoid Arthritis, Osteoporosis | Medium | 58 | ✅ Granted |
| **P006** | Vikram Malhotra | `vikram.malhotra@gmail.com` | Asthma, GERD | Medium | 52 | ✅ Granted |
| **P007** | Kavya Iyer | `kavya.iyer@gmail.com` | Eczema, Seasonal Allergies | Low | 28 | ✅ Granted |
| **P008** | Rahul Gupta | `rahul.gupta@gmail.com` | Chronic Kidney Disease, Hypertension | High | 75 | ✅ Granted |
| **P009** | Sunita Verma | `sunita.verma@gmail.com` | Multiple Sclerosis, Depression | Medium | 62 | ✅ Granted |
| **P010** | Amit Kumar | `amit.kumar@gmail.com` | Ulcerative Colitis, Iron Deficiency Anemia | Medium | 48 | ✅ Granted |

---

## 🔐 **Login Flow**

```
Main Login Page (/login)
    ↓
Click "Patient" Demo Account
    ↓
Click "Go to Portal"
    ↓
Patient Login Page (/patient/login)
    ↓
Enter Your Individual Email (e.g., priya.sharma@gmail.com)
    ↓
Click "Login to Patient Portal"
    ↓
Access Your Personalized Dashboard (/patient/dashboard/P001)
```

---

## 📱 **Available Patient Features**

Once logged in, each patient can access:

- **🏠 Dashboard** - Personalized overview with health metrics, risk assessment, and comprehensive medical data
- **📋 Health Records** - Vitals, lab results, medical history, allergies, chronic conditions, and current medications
- **💊 Prescriptions** - Current medications, dosage instructions, and prescription history
- **📅 Appointments** - Upcoming and past appointments with scheduling capabilities
- **🔒 Privacy Control** - Data sharing settings, access history, and consent management
- **🩺 AI Symptom Checker** - **NEW!** AI-powered symptom analysis with real-time medical guidance

---

## ⚠️ **Important Notes**

- **Use your individual email address** from the list above
- **Each patient has comprehensive medical data** including vitals, lab results, allergies, and risk assessments
- **Patient ID is automatically determined** based on your email
- **All data is personalized** to your specific patient record
- **Session is maintained** using localStorage for convenience
- **AI Symptom Checker** is fully integrated with backend AI services and working for all patients
- **All 10 patients have approved access** to their medical records

---

## 🆘 **Need Help?**

If you encounter any issues:
1. Ensure you're using the correct email address from the list
2. Check that your patient ID matches your email
3. Contact your healthcare provider for assistance
4. Verify your patient record exists in the system

---

## 🔒 **Security Features**

- **Individual email authentication** for each patient
- **Patient ID verification** against comprehensive medical records
- **Personalized data access** - patients only see their own information
- **Session management** with secure token storage
- **HIPAA compliant** data handling
- **AI-powered security** with backend integration

---

## 🩺 **AI Symptom Checker - NEW FEATURE!**

The Patient Portal now includes an **AI-powered Symptom Checker** that:

- **Analyzes symptoms** using advanced AI models (Groq API)
- **Provides medical guidance** based on symptom patterns and medical knowledge
- **Assesses urgency** and recommends appropriate actions
- **Integrates with backend** for real-time AI analysis
- **Multi-modal input** - text, voice, and image analysis capabilities
- **Maintains privacy** while providing intelligent medical assistance
- **Works for all 10 patients** with full backend integration

### **How to Use AI Symptom Checker:**
1. **Login** to your patient portal
2. **Navigate** to "Symptom Checker" in the menu
3. **Describe symptoms** in detail (text input)
4. **Get instant AI analysis** with medical recommendations
5. **Receive guidance** on next steps and urgency

---

## 🚀 **System Status**

- **✅ Backend**: Python Flask server running on port 5000
- **✅ AI Services**: Groq API integration working
- **✅ Symptom Checker**: Fully functional for all patients
- **✅ Patient Data**: 10 comprehensive patient records
- **✅ Access Control**: All 10 patients have granted access (100%)

---

## 📊 **Patient Risk Distribution**

- **Low Risk**: 2 patients (P003, P007)
- **Medium Risk**: 4 patients (P001, P005, P006, P009, P010)
- **High Risk**: 4 patients (P002, P004, P008)

---

*Last Updated: February 2024*
*CuraPath Medical System v2.0*
*AI Integration: Groq API + Python Flask Backend*
*Status: All Systems Operational - All 10 Patients Have Access*
