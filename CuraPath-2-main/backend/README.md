# CuraPath AI Medical Backend

A real-time, AI-powered medical assistance system built with Python Flask, featuring advanced AI integration for medical consultation, risk assessment, report analysis, and symptom checking.

## 🚀 Features

### 🤖 AI Medical Assistant
- **OpenAI GPT-4 Integration**: Professional medical consultation with evidence-based responses
- **Google Gemini Pro Support**: Alternative AI provider for medical analysis
- **Real-time Chat**: WebSocket-enabled live medical assistance
- **Medical Knowledge Base**: Comprehensive fallback system with medical guidelines
- **Confidence Scoring**: AI response quality indicators
- **Source Attribution**: Medical reference citations

### ⚠️ Health Risk Predictor
- **ML-Powered Assessment**: Scikit-learn based risk calculation
- **Multi-Dimensional Analysis**: Cardiovascular, diabetes, cancer, and respiratory risks
- **Personalized Recommendations**: AI-generated preventive strategies
- **Risk Factor Identification**: Comprehensive patient risk profiling
- **Real-time Scoring**: Instant risk assessment with confidence metrics

### 📋 Medical Report Analyzer
- **AI Document Analysis**: GPT-4 and Gemini Pro powered report interpretation
- **Multi-Format Support**: PDF, DOCX, TXT, and medical imaging reports
- **Clinical Insights**: Key findings extraction and risk level assessment
- **Recommendations Engine**: AI-generated clinical guidance
- **Confidence Metrics**: Analysis quality indicators

### 🩺 AI Symptom Checker
- **Intelligent Triage**: AI-powered symptom severity assessment
- **Condition Prediction**: Possible diagnosis suggestions
- **Urgency Classification**: Emergency, urgent, routine triage levels
- **Personalized Recommendations**: Age and gender-specific guidance
- **Symptom Suggestions**: AI-powered symptom input assistance

## 🏗️ Architecture

```
CuraPath AI Backend/
├── app.py                 # Main Flask application
├── ai_services.py        # AI service modules
├── requirements.txt      # Python dependencies
├── run.py               # Startup script
├── test_backend.py      # Comprehensive testing
├── env.example          # Environment configuration template
└── README.md            # This file
```

## 🔧 Installation

### Prerequisites
- Python 3.8+
- pip package manager
- Virtual environment (recommended)

### Setup Steps

1. **Clone and Navigate**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your API keys
   nano .env  # or use your preferred editor
   ```

5. **Set API Keys** (Optional but recommended)
   ```bash
   # OpenAI GPT-4 (for best medical consultation)
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Google Gemini Pro (alternative AI provider)
   GOOGLE_API_KEY=your-google-gemini-api-key-here
   ```

## 🚀 Running the Backend

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
export FLASK_ENV=production
python run.py
```

### Using Flask Directly
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5000
```

## 🌐 API Endpoints

### Health & Status
- `GET /health` - Backend health check
- `GET /` - API information and endpoints

### AI Medical Assistant
- `POST /api/ai-assistant/chat` - Medical consultation chat
  ```json
  {
    "message": "What are the symptoms of diabetes?",
    "history": []
  }
  ```

### Health Risk Predictor
- `POST /api/risk-predictor/assess` - Patient risk assessment
  ```json
  {
    "patient_data": {
      "age": 45,
      "conditions": ["hypertension"],
      "vitals": {
        "bp_systolic": 150,
        "bp_diastolic": 95
      },
      "medical_history": {
        "smoking": true
      }
    }
  }
  ```

### Medical Report Analyzer
- `POST /api/report-analyzer/analyze` - Report analysis
  ```json
  {
    "report_data": "Patient lab results...",
    "report_type": "lab_report"
  }
  ```

### Symptom Checker
- `POST /api/symptom-checker/check` - Symptom analysis
  ```json
  {
    "symptoms": ["chest pain", "shortness of breath"],
    "age": 55,
    "gender": "male"
  }
  ```

- `POST /api/symptom-checker/suggest` - Symptom suggestions
  ```json
  {
    "input_text": "I have pain in my chest"
  }
  ```

## 🧪 Testing

### Run Comprehensive Tests
```bash
python test_backend.py
```

### Test Individual Endpoints
```bash
# Health check
curl http://localhost:5000/health

# AI Assistant
curl -X POST http://localhost:5000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "history": []}'
```

## 🔑 AI Service Configuration

### OpenAI GPT-4 (Recommended)
- **Best for**: Medical consultation, complex analysis
- **Setup**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (typically $0.03-0.06 per 1K tokens)

### Google Gemini Pro
- **Best for**: Alternative AI provider, cost-effective
- **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Cost**: More affordable than OpenAI

### ML Fallback System
- **Always Available**: Scikit-learn based analysis
- **Features**: Risk prediction, symptom analysis, report processing
- **Quality**: Good for basic analysis, enhanced with AI when available

## 📊 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response-specific data
    "metadata": {
      "confidence": 0.95,
      "sources": ["Medical Guidelines", "Clinical Evidence"],
      "ai_provider": "openai",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  }
}
```

## 🔒 Security Features

- **Rate Limiting**: Configurable API usage limits
- **CORS Protection**: Cross-origin request handling
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## 📈 Performance

- **Response Time**: < 200ms for ML operations, < 2s for AI operations
- **Concurrent Users**: Supports 50+ simultaneous users
- **Rate Limits**: 200 requests/day, 50/hour by default
- **WebSocket Support**: Real-time communication for live chat

## 🚨 Error Handling

The system includes comprehensive error handling:

- **API Errors**: Proper HTTP status codes
- **AI Service Failures**: Automatic fallback to ML systems
- **Rate Limiting**: Clear rate limit exceeded responses
- **Validation Errors**: Detailed input validation feedback

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   pip install -r requirements.txt
   ```

2. **API Key Issues**
   - Verify API keys in `.env` file
   - Check API key permissions and quotas

3. **Port Conflicts**
   - Change port in `.env` file
   - Check if port 5000 is available

4. **Dependency Issues**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

### Logs
- Check console output for detailed error messages
- Enable debug mode for verbose logging
- Monitor rate limiting and API usage

## 🌟 Advanced Features

### WebSocket Support
- Real-time AI chat
- Live medical consultation
- Instant response streaming

### Multi-AI Provider Support
- Automatic failover between AI services
- Load balancing for optimal performance
- Provider-specific optimization

### Medical Knowledge Base
- Evidence-based medical information
- Clinical guideline integration
- Professional medical disclaimers

## 📚 Medical Disclaimer

**Important**: This AI medical system is designed for educational and informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add comprehensive tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Test with the provided test suite
- Ensure all dependencies are properly installed

---

**CuraPath AI Medical Backend** - Empowering healthcare with intelligent AI assistance 🩺✨
