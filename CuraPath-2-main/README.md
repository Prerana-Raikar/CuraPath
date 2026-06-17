# 🏥 CuraPath AI Medical Platform

## 📋 Project Overview

**CuraPath AI** is a comprehensive AI-powered health analytics platform that provides intelligent medical assistance through multiple specialized portals. The platform leverages advanced AI technologies including **Groq API** and **Python Flask backend** to deliver cutting-edge healthcare solutions.

## 🏗️ Architecture Overview

The platform is built with a **modern full-stack architecture**:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python Flask + AI Services + Groq API Integration
- **AI Services**: Groq API + OpenAI GPT-4 + Google Gemini Pro + Machine Learning
- **Real-time Communication**: WebSocket for live updates
- **Security**: JWT tokens, rate limiting, CORS protection

## 🚀 How It Works

### 1. **Multi-Portal System**
The platform operates through three distinct portals, each serving different user roles:

#### 👨‍⚕️ **Doctor Portal** (`/doctor`)
- **Patient Management**: View and manage patient lists (10 patients with access control)
- **Access Control**: Handle patient access requests (10 approved, 100% access)
- **AI Diagnostics**: AI-assisted medical analysis
- **Risk Assessment**: ML-powered health risk prediction
- **Patient Overview**: Comprehensive patient details and medical history

#### 👤 **Patient Portal** (`/patient`)
- **Health Records**: Secure access to personal medical data
- **Appointment Management**: Schedule and manage appointments
- **Access Control**: Manage who can view their records
- **🩺 AI Symptom Checker**: **WORKING!** Intelligent symptom analysis with Groq API
- **Privacy Controls**: Granular data sharing permissions

#### 👥 **Staff Portal** (`/staff`)
- **Data Entry**: Patient information management
- **Monitoring Tasks**: Track patient status and alerts with task management
- **Patient Editor**: Update and maintain patient records
- **Hospital Management**: Administrative functions and patient oversight
- **Prescription Requests**: Medication management and processing

## 🏥 **Detailed Portal Functionality**

### **👨‍⚕️ Doctor Portal - Complete Guide**

#### **Dashboard Overview** (`/doctor/dashboard`)
The Doctor Dashboard provides a comprehensive overview of medical practice operations:

- **📊 Key Metrics Display**
  - Total active patients: **10**
  - Access granted: **10 patients (100%)**
  - Recent appointments
  - Critical alerts count

- **🚨 Quick Actions Panel**
  - Review patient access requests
  - View urgent patient alerts
  - Access AI diagnostic tools
  - Schedule consultations

#### **Patient Management** (`/doctor/patients`)
Comprehensive patient oversight and management:

- **📋 Patient List View**
  - **10 total patients** with comprehensive medical profiles
  - **All 10 patients accessible** (approved access)
  - Searchable patient database
  - Filter by status, risk level, last visit

- **👤 Individual Patient Profiles**
  - Complete medical history
  - Current medications
  - Lab results and imaging
  - Risk assessment scores
  - Access control settings

#### **Access Control Management** (`/doctor/access-requests`)
Handle patient data access permissions:

- **📝 Request Review System**
  - **10 access requests** (one per patient)
  - **All 10 approved** requests
  - Patient consent verification
  - Access level determination

#### **Risk Prediction** (`/doctor/risk-predictor`)
Advanced machine learning for patient risk assessment:

- **🎯 Risk Scoring Models**
  - Cardiovascular risk assessment
  - Diabetes progression prediction
  - Cancer screening recommendations
  - Medication adherence risk

- **📊 Predictive Analytics**
  - Historical data analysis
  - Pattern recognition
  - Risk factor identification
  - Intervention effectiveness

### **👤 Patient Portal - Complete Guide**

#### **Dashboard Overview** (`/patient/dashboard`)
Personalized health dashboard for patients:

- **🏥 Health Summary**
  - Current health status
  - Recent test results
  - Medication schedule
  - Upcoming appointments
  - Health goals progress

- **📱 Quick Actions**
  - Schedule appointments
  - Request prescription refills
  - Update personal information
  - Contact healthcare team
  - Access AI symptom checker

#### **🩺 AI Symptom Checker** (`/patient/symptom-checker`)
**WORKING!** Intelligent symptom analysis and triage:

- **🩺 Symptom Assessment**
  - Guided symptom input
  - Severity evaluation
  - Duration tracking
  - Associated symptoms
  - Risk factor identification

- **🤖 AI Analysis**
  - **Real-time Groq API integration**
  - Symptom pattern recognition
  - Differential diagnosis
  - Urgency assessment
  - Recommendation generation

- **📋 Action Plans**
  - Immediate actions needed
  - When to seek care
  - Self-care instructions
  - Emergency indicators
  - Provider consultation timing

#### **Health Records** (`/patient/health-records`)
Secure access to personal medical information:

- **📋 Medical History**
  - Complete health timeline
  - Diagnosis records
  - Treatment history
  - Lab results archive
  - Imaging studies

- **💊 Medication Management**
  - Current prescriptions
  - Dosage instructions
  - Refill requests
  - Side effect tracking
  - Drug interaction alerts

### **👥 Staff Portal - Complete Guide**

#### **Dashboard Overview** (`/staff/dashboard`)
Administrative and operational dashboard:

- **📊 Operational Metrics**
  - **Total Patients**: 10
  - **Access Granted**: 10 (100%)
  - System alerts and performance indicators

#### **Monitoring Tasks** (`/staff/monitoring-tasks`)
Patient status and system monitoring:

- **📊 Patient Status Tracking**
  - Active patient monitoring
  - Alert response tracking
  - Follow-up scheduling
  - Quality metrics
  - **NEW: Add Task functionality** for patient monitoring

- **🚨 Alert Management**
  - Critical alert response
  - Escalation procedures
  - Response time tracking
  - Resolution documentation

#### **Hospital Management** (`/staff/hospital-management`)
Administrative and operational functions:

- **🏥 Facility Management**
  - Department oversight
  - Resource allocation
  - Capacity planning
  - Quality assurance
  - Performance monitoring

## 🔄 **Portal Workflows & Interactions**

### **Cross-Portal Communication**
- **Real-time Updates**: Changes in one portal reflect across all related portals
- **Data Synchronization**: Consistent information across all user interfaces
- **Notification System**: Automated alerts and updates between portals
- **Audit Trail**: Complete tracking of all data access and modifications

### **AI Service Integration**
- **🩺 Working AI Symptom Checker**: Groq API integration for real-time medical analysis
- **Unified AI Experience**: Consistent AI capabilities across all portals
- **Context-Aware Responses**: AI understands user role and permissions
- **Seamless Integration**: AI tools embedded within portal workflows

### **Security & Access Control**
- **Role-Based Permissions**: Different access levels for each portal
- **Data Isolation**: Secure separation between portal data
- **Audit Logging**: Complete tracking of all portal activities
- **Compliance Management**: HIPAA and healthcare regulation compliance

## 🔧 Technical Implementation

### **Frontend Architecture**
```
src/
├── components/           # Reusable UI components
│   ├── ai/             # AI-specific components
│   ├── charts/         # Data visualization
│   ├── common/         # Shared UI elements
│   ├── layout/         # Page layouts
│   └── medical/        # Medical-specific components
├── portals/            # Portal-specific implementations
│   ├── doctor/         # Doctor portal pages
│   ├── patient/        # Patient portal pages
│   └── staff/          # Staff portal pages
├── services/           # API communication
├── contexts/           # React context providers
└── types/              # TypeScript definitions
```

### **Backend Architecture**
```
backend/
├── app_flask.py         # Main Flask application with AI endpoints
├── ai_services.py       # AI service implementations
├── requirements.txt     # Python dependencies
└── .env                 # Environment configuration
```

### **Key Technologies Used**

#### **Frontend Stack**
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side navigation
- **ECharts/Recharts**: Data visualization
- **Framer Motion**: Smooth animations

#### **Backend Stack**
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin support
- **Groq API**: AI-powered medical analysis
- **Python-dotenv**: Environment management

#### **AI & ML Stack**
- **Groq API**: **WORKING** - AI symptom analysis
- **OpenAI API**: GPT-4 integration (coming soon)
- **Google Gemini**: Alternative AI model (coming soon)

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.8+ (Use `E:\Python311\python.exe`)
- Git

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd "CuraPath 2 - Copy"
```

### **2. Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will be available at http://localhost:3003
```

### **3. Backend Setup**
```bash
cd backend

# Install dependencies using correct Python path
E:\Python311\python.exe -m pip install -r requirements.txt

# Start Flask server
E:\Python311\python.exe app_flask.py
# Backend will be available at http://localhost:5000
```

### **4. Environment Configuration**
```bash
# Copy environment template
cp backend/env.example backend/.env

# Add your API keys to .env:
GROQ_API_KEY=your-groq-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_API_KEY=your-google-gemini-api-key-here
```

## 🌐 Accessing the Platform

### **Development URLs**
- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### **Portal Access**
- **Doctor Portal**: http://localhost:3003/doctor
- **Patient Portal**: http://localhost:3003/patient
- **Staff Portal**: http://localhost:3003/staff

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Tokens**: Secure session management
- **Role-based Access**: Portal-specific permissions
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin security

### **Data Privacy**
- **Patient Consent**: Granular access control
- **Data Encryption**: Secure data transmission
- **Audit Logging**: Access tracking
- **Privacy Controls**: Patient-managed permissions

## 📊 Data Flow

### **1. User Authentication**
```
User Login → JWT Token Generation → Portal Access
```

### **2. AI Service Request**
```
Portal → Backend API → Groq API → Response → Frontend
```

### **3. Real-time Updates**
```
WebSocket Connection → Live Data → Real-time UI Updates
```

### **4. Data Processing**
```
Input → AI Analysis → Structured Output → Database → Portal Display
```

## 🧪 Testing the Platform

### **Backend Health Check**
```bash
curl http://localhost:5000/api/health
```

### **AI Symptom Checker Test (WORKING!)**
```bash
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "text=I have a headache and fever"
```

### **Frontend Testing**
```bash
# Type checking
npm run type-check

# Build test
npm run build
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Backend Won't Start**
```bash
# Check if port 5000 is available
netstat -an | findstr :5000

# Use correct Python path
E:\Python311\python.exe app_flask.py

# Reinstall dependencies
E:\Python311\python.exe -m pip install -r requirements.txt --force-reinstall
```

#### **Frontend Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
netstat -an | findstr :3003
```

#### **AI Services Not Working**
```bash
# Verify API keys in .env file
# Check Groq API quotas
# Verify internet connectivity
```

## 📈 Performance Features

### **Optimization Techniques**
- **Code Splitting**: Lazy-loaded components
- **Virtual Scrolling**: Large data handling
- **Caching**: API response caching
- **Compression**: Gzip compression
- **CDN Ready**: Static asset optimization

### **Scalability**
- **Microservices Ready**: Modular architecture
- **Database Agnostic**: Flexible data storage
- **Load Balancing**: Horizontal scaling support
- **Caching Layers**: Redis integration ready

## 🚀 Deployment

### **Frontend Deployment**
```bash
# Build production version
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - AWS S3
# - GitHub Pages
```

### **Backend Deployment**
```bash
# Production server
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Environment variables
export FLASK_ENV=production
export SECRET_KEY=your-production-secret
```

## 📚 API Documentation

### **Core Endpoints**
- `GET /api/health` - System health check
- `POST /api/process` - **WORKING!** AI symptom analysis
- `POST /api/ai-assistant/chat` - AI chat service (coming soon)
- `POST /api/risk-predictor/assess` - Health risk assessment (coming soon)
- `POST /api/report-analyzer/analyze` - Document analysis (coming soon)

### **Authentication Endpoints**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- **Frontend**: ESLint + Prettier
- **Backend**: PEP 8 + Black
- **TypeScript**: Strict mode enabled
- **Testing**: Jest + React Testing Library

## 📞 Support & Contact

### **Getting Help**
1. Check this README
2. Review the troubleshooting section
3. Check console logs for errors
4. Verify environment configuration

### **Documentation**
- **Quick Start**: See `QUICK_START.md`
- **Patient Guide**: See `PATIENT_LOGIN_GUIDE.md`
- **Patient Directory**: See `PATIENT_DIRECTORY.md`

---

## 🎯 **CuraPath AI - Empowering Healthcare with Artificial Intelligence**

*Built with modern web technologies and cutting-edge AI to revolutionize healthcare delivery.*

**🌟 Key Benefits:**
- **🩺 Working AI Symptom Checker**: Real-time medical analysis with Groq API
- **Intelligent Diagnostics**: AI-powered medical analysis
- **Real-time Communication**: Instant updates and responses
- **Secure Access**: Role-based portal system
- **Scalable Architecture**: Enterprise-ready platform
- **Modern UI/UX**: Intuitive healthcare interfaces

---

## 🚀 **Current System Status**

### **✅ What's Working:**
- **Backend**: Python Flask server running on port 5000
- **AI Symptom Checker**: Fully functional with Groq API
- **Patient Portal**: 10 comprehensive patient accounts
- **Doctor Portal**: Patient management with access control (100% access granted)
- **Staff Portal**: Hospital management and monitoring tasks
- **Frontend-Backend**: Seamless communication established

### **🔄 Coming Soon:**
- **AI Assistant**: Chat functionality with OpenAI/Gemini
- **Risk Predictor**: ML-powered risk assessment
- **Report Analyzer**: AI document analysis

---

## 📊 **Patient System Summary**

- **Total Patients**: 10
- **Access Status**: All 10 patients have approved access (100%)
- **Risk Distribution**: 2 Low, 4 Medium, 4 High Risk
- **AI Integration**: Symptom Checker working for all patients
- **Backend**: Fully operational with Groq API

---

*Last updated: February 2024*
*CuraPath Medical System v2.0*
*AI Integration: Groq API + Python Flask Backend*
*Status: AI Symptom Checker Fully Operational - All 10 Patients Have Access*