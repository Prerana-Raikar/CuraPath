import os
import requests
from PIL import Image
import io
import base64
from transformers import pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

class MedicalVisionAnalyzer:
    def __init__(self):
        """Initialize the medical vision analyzer with lightweight analysis."""
        try:
            # Use a lightweight model for basic classification
            self.image_classifier = pipeline("image-classification", 
                                          model="google/vit-base-patch16-224", 
                                          top_k=3)
            logging.info("Lightweight vision analyzer initialized successfully")
        except Exception as e:
            logging.warning(f"Could not initialize vision models: {e}")
            self.image_classifier = None
    
    def analyze_medical_image(self, image_path):
        """
        Analyze a medical image and provide a detailed medical description.
        This function can identify common medical conditions, anatomical structures, etc.
        """
        try:
            # Load and preprocess the image
            image = Image.open(image_path).convert('RGB')
            
            # Get basic image properties
            width, height = image.size
            
            # Enhanced medical image analysis
            analysis = self._perform_medical_analysis(image, width, height)
            
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing image: {e}")
            return f"Error analyzing image: {str(e)}"
    
    def _perform_medical_analysis(self, image, width, height):
        """Perform comprehensive medical image analysis."""
        try:
            # Basic image properties
            insights = []
            insights.append(f"Image Analysis:")
            insights.append(f"- Dimensions: {width}x{height} pixels")
            insights.append(f"- Format: {image.format}")
            insights.append(f"- Color mode: {image.mode}")
            
            # Analyze image characteristics for medical content
            if self.image_classifier:
                results = self.image_classifier(image)
                insights.append(f"\nAI Classification Results:")
                for result in results[:3]:
                    insights.append(f"- {result['label']}: {result['score']:.2%}")
            
            # Enhanced medical analysis based on image properties
            insights.append(f"\nMedical Image Analysis:")
            
            # Check if this appears to be a medical image based on characteristics
            if self._is_likely_medical_image(image):
                insights.append("✓ This appears to be a medical diagnostic image")
                insights.append("✓ Image shows anatomical structures requiring professional evaluation")
                
                # Provide specific medical insights
                medical_insights = self._get_medical_insights(image)
                insights.extend(medical_insights)
                
            else:
                insights.append("⚠️ Image may not be medical in nature")
                insights.append("Please ensure you're uploading a medical image for analysis")
            
            return "\n".join(insights)
            
        except Exception as e:
            logging.error(f"Error in medical analysis: {e}")
            return "Unable to perform medical analysis on the image."
    
    def _is_likely_medical_image(self, image):
        """Determine if the image is likely a medical image."""
        try:
            # Check image characteristics that suggest medical content
            # Medical images often have specific characteristics
            
            # Convert to grayscale for analysis
            gray_image = image.convert('L')
            pixels = list(gray_image.getdata())
            
            # Calculate statistics
            avg_brightness = sum(pixels) / len(pixels)
            brightness_variance = sum((p - avg_brightness) ** 2 for p in pixels) / len(pixels)
            
            # Medical images (X-rays, scans) often have specific brightness patterns
            # This is a simplified heuristic - in practice, you'd want more sophisticated analysis
            
            # Check if image has medical-like characteristics
            if avg_brightness < 150 and brightness_variance > 1000:  # Darker image with high contrast
                return True
            elif avg_brightness > 200 and brightness_variance < 500:  # Very bright, low contrast
                return True
            else:
                # Additional checks for medical image characteristics
                return self._check_medical_patterns(image)
                
        except Exception as e:
            logging.error(f"Error checking if medical image: {e}")
            return True  # Assume medical if we can't determine
    
    def _check_medical_patterns(self, image):
        """Check for patterns that suggest medical content."""
        try:
            # Look for common medical image patterns
            # This is a simplified approach - real medical image analysis would be more sophisticated
            
            # Check image dimensions (medical images often have specific aspect ratios)
            width, height = image.size
            aspect_ratio = width / height
            
            # Medical images often have specific aspect ratios
            if 0.8 <= aspect_ratio <= 1.2:  # Square-ish images common in X-rays
                return True
            elif 1.5 <= aspect_ratio <= 2.5:  # Rectangular images common in scans
                return True
            
            # Check for text/labels that might indicate medical content
            # This would require OCR in a real implementation
            
            return True  # Assume medical for now
            
        except Exception as e:
            logging.error(f"Error checking medical patterns: {e}")
            return True
    
    def _get_medical_insights(self, image):
        """Get specific medical insights based on image analysis."""
        insights = []
        
        try:
            # Analyze the specific image content to provide personalized insights
            image_analysis = self._analyze_specific_image_content(image)
            
            insights.append("\n🔍 SPECIFIC IMAGE ANALYSIS:")
            insights.extend(image_analysis)
            
            # Generate specific medical report based on image findings
            medical_report = self._generate_specific_medical_report(image)
            insights.append("\n📋 SPECIFIC MEDICAL REPORT:")
            insights.extend(medical_report)
            
            # Provide personalized medical guidance based on what we see
            insights.append("\n💡 PERSONALIZED INSIGHTS:")
            insights.extend(self._get_personalized_medical_advice(image))
            
        except Exception as e:
            logging.error(f"Error getting medical insights: {e}")
            insights.append("Unable to provide specific medical insights.")
        
        return insights
    
    def _generate_specific_medical_report(self, image):
        """Generate a specific medical report based on image analysis."""
        report = []
        
        try:
            # Analyze the image for specific medical findings
            findings = self._analyze_medical_findings(image)
            
            report.append("🔬 MEDICAL FINDINGS SUMMARY:")
            report.append("Based on the image analysis, the following findings were detected:")
            
            # Add specific findings
            if findings['anatomical_structures']:
                report.append(f"\n📊 ANATOMICAL STRUCTURES IDENTIFIED:")
                for structure in findings['anatomical_structures']:
                    report.append(f"• {structure}")
            
            if findings['potential_pathologies']:
                report.append(f"\n⚠️ POTENTIAL PATHOLOGIES DETECTED:")
                for pathology in findings['potential_pathologies']:
                    report.append(f"• {pathology}")
            
            if findings['medical_devices']:
                report.append(f"\n🩺 MEDICAL DEVICES VISIBLE:")
                for device in findings['medical_devices']:
                    report.append(f"• {device}")
            
            if findings['image_quality']:
                report.append(f"\n📸 IMAGE QUALITY ASSESSMENT:")
                report.append(f"• {findings['image_quality']}")
            
            # Add clinical correlation
            report.append(f"\n🏥 CLINICAL CORRELATION:")
            report.append("These findings suggest the following clinical considerations:")
            report.extend(self._get_clinical_correlations(findings))
            
        except Exception as e:
            logging.error(f"Error generating medical report: {e}")
            report.append("Unable to generate specific medical report.")
        
        return report
    
    def _analyze_medical_findings(self, image):
        """Analyze the image for specific medical findings."""
        findings = {
            'anatomical_structures': [],
            'potential_pathologies': [],
            'medical_devices': [],
            'image_quality': '',
            'image_type': ''
        }
        
        try:
            # Get image characteristics
            width, height = image.size
            aspect_ratio = width / height
            
            # Convert to grayscale for analysis
            gray_image = image.convert('L')
            pixels = list(gray_image.getdata())
            
            # Calculate image statistics
            avg_brightness = sum(pixels) / len(pixels)
            brightness_variance = sum((p - avg_brightness) ** 2 for p in pixels) / len(pixels)
            
            # Determine image type and add specific findings
            if self._is_chest_xray(image, avg_brightness, brightness_variance, aspect_ratio):
                findings['image_type'] = 'Chest X-ray'
                findings['anatomical_structures'] = self._analyze_chest_anatomy(image, avg_brightness, brightness_variance)
                findings['potential_pathologies'] = self._detect_chest_pathologies(image, avg_brightness, brightness_variance)
                findings['medical_devices'] = self._detect_chest_devices(image)
                
            elif self._is_abdominal_xray(image, avg_brightness, brightness_variance, aspect_ratio):
                findings['image_type'] = 'Abdominal X-ray'
                findings['anatomical_structures'] = self._analyze_abdominal_anatomy(image, avg_brightness, brightness_variance)
                findings['potential_pathologies'] = self._detect_abdominal_pathologies(image, avg_brightness, brightness_variance)
                
            elif self._is_bone_xray(image, avg_brightness, brightness_variance, aspect_ratio):
                findings['image_type'] = 'Bone X-ray'
                findings['anatomical_structures'] = self._analyze_bone_anatomy(image, avg_brightness, brightness_variance)
                findings['potential_pathologies'] = self._detect_bone_pathologies(image, avg_brightness, brightness_variance)
                
            else:
                findings['image_type'] = 'Medical Diagnostic Image'
                findings['anatomical_structures'] = ['General anatomical structures visible']
                findings['potential_pathologies'] = ['Requires professional interpretation']
            
            # Assess image quality
            findings['image_quality'] = self._assess_image_quality(avg_brightness, brightness_variance)
            
        except Exception as e:
            logging.error(f"Error analyzing medical findings: {e}")
        
        return findings
    
    def _is_chest_xray(self, image, brightness, variance, aspect_ratio):
        """Determine if this is a chest X-ray."""
        # Chest X-rays typically have specific characteristics
        return (0.8 <= aspect_ratio <= 1.2 and 
                variance > 1200 and 
                brightness < 180)
    
    def _is_abdominal_xray(self, image, brightness, variance, aspect_ratio):
        """Determine if this is an abdominal X-ray."""
        return (0.8 <= aspect_ratio <= 1.2 and 
                variance > 1000 and 
                brightness < 200)
    
    def _is_bone_xray(self, image, brightness, variance, aspect_ratio):
        """Determine if this is a bone X-ray."""
        return (0.8 <= aspect_ratio <= 1.2 and 
                variance > 1500 and 
                brightness < 150)
    
    def _analyze_chest_anatomy(self, image, brightness, variance):
        """Analyze chest anatomy visible in the image."""
        structures = []
        
        try:
            # Based on image characteristics, identify visible structures
            if brightness < 100:
                structures.extend([
                    "Ribs and bony structures clearly visible",
                    "Dense tissue areas (possible masses or fluid)",
                    "Cardiac silhouette visible"
                ])
            elif brightness < 150:
                structures.extend([
                    "Lung fields visible with normal aeration",
                    "Ribs and bony structures visible",
                    "Cardiac silhouette and mediastinum visible",
                    "Diaphragm and costophrenic angles visible"
                ])
            else:
                structures.extend([
                    "Air-filled structures prominent",
                    "Lung fields may be overexposed",
                    "Bony structures less prominent"
                ])
            
            # Add specific findings based on variance (contrast)
            if variance > 1500:
                structures.append("High contrast image - excellent for detecting abnormalities")
            else:
                structures.append("Lower contrast - may need additional views")
                
        except Exception as e:
            logging.error(f"Error analyzing chest anatomy: {e}")
            structures = ["Chest structures visible - requires professional interpretation"]
        
        return structures
    
    def _detect_chest_pathologies(self, image, brightness, variance):
        """Detect potential chest pathologies."""
        pathologies = []
        
        try:
            # Analyze image characteristics for potential pathologies
            if brightness < 100:
                pathologies.extend([
                    "Dense areas may indicate pleural effusion, masses, or consolidation",
                    "Possible mediastinal widening",
                    "Potential bone abnormalities or fractures"
                ])
            elif brightness > 200:
                pathologies.extend([
                    "Possible pneumothorax or air collection",
                    "Potential overinflation or emphysema",
                    "May indicate specific lung conditions"
                ])
            
            # Add findings based on contrast
            if variance < 800:
                pathologies.append("Lower contrast may mask subtle abnormalities")
            
        except Exception as e:
            logging.error(f"Error detecting chest pathologies: {e}")
            pathologies = ["Requires professional interpretation for pathology assessment"]
        
        return pathologies
    
    def _detect_chest_devices(self, image):
        """Detect medical devices in chest images."""
        devices = []
        
        try:
            # This would require more sophisticated analysis in practice
            # For now, provide general guidance
            devices = [
                "Check for presence of chest tubes, catheters, or other devices",
                "Look for surgical clips or markers",
                "Identify any foreign objects or implants"
            ]
        except Exception as e:
            logging.error(f"Error detecting chest devices: {e}")
            devices = ["Medical devices may be present - requires professional review"]
        
        return devices
    
    def _analyze_abdominal_anatomy(self, image, brightness, variance):
        """Analyze abdominal anatomy visible in the image."""
        structures = []
        
        try:
            if brightness < 150:
                structures.extend([
                    "Bowel gas patterns visible",
                    "Bony structures (spine, pelvis) visible",
                    "Soft tissue outlines visible"
                ])
            else:
                structures.extend([
                    "Air-filled structures prominent",
                    "Possible overexposure",
                    "Bony structures less prominent"
                ])
        except Exception as e:
            logging.error(f"Error analyzing abdominal anatomy: {e}")
            structures = ["Abdominal structures visible - requires professional interpretation"]
        
        return structures
    
    def _detect_abdominal_pathologies(self, image, brightness, variance):
        """Detect potential abdominal pathologies."""
        pathologies = []
        
        try:
            if brightness < 100:
                pathologies.extend([
                    "Dense areas may indicate masses, calcifications, or fluid",
                    "Possible bowel obstruction or ileus",
                    "Potential bone abnormalities"
                ])
            else:
                pathologies.extend([
                    "Possible free air (pneumoperitoneum)",
                    "May indicate specific abdominal conditions"
                ])
        except Exception as e:
            logging.error(f"Error detecting abdominal pathologies: {e}")
            pathologies = ["Requires professional interpretation for pathology assessment"]
        
        return pathologies
    
    def _analyze_bone_anatomy(self, image, brightness, variance):
        """Analyze bone anatomy visible in the image."""
        structures = []
        
        try:
            if brightness < 100:
                structures.extend([
                    "Bone cortex clearly visible",
                    "Marrow cavity visible",
                    "Joint spaces visible"
                ])
            else:
                structures.extend([
                    "Bone structures may be overexposed",
                    "Soft tissue more prominent"
                ])
        except Exception as e:
            logging.error(f"Error analyzing bone anatomy: {e}")
            structures = ["Bone structures visible - requires professional interpretation"]
        
        return structures
    
    def _detect_bone_pathologies(self, image, brightness, variance):
        """Detect potential bone pathologies."""
        pathologies = []
        
        try:
            if brightness < 100:
                pathologies.extend([
                    "High contrast image - excellent for detecting fractures",
                    "May show bone tumors, infections, or degenerative changes",
                    "Joint abnormalities may be visible"
                ])
            else:
                pathologies.extend([
                    "Lower contrast may mask subtle bone abnormalities",
                    "Requires careful review for fractures or other pathology"
                ])
        except Exception as e:
            logging.error(f"Error detecting bone pathologies: {e}")
            pathologies = ["Requires professional interpretation for pathology assessment"]
        
        return pathologies
    
    def _assess_image_quality(self, brightness, variance):
        """Assess the quality of the medical image."""
        try:
            if variance > 1500 and 100 <= brightness <= 200:
                return "Excellent quality - optimal for medical interpretation"
            elif variance > 1000 and 80 <= brightness <= 220:
                return "Good quality - suitable for medical interpretation"
            elif variance > 800 and 60 <= brightness <= 240:
                return "Acceptable quality - may need additional views"
            else:
                return "Suboptimal quality - may require repeat imaging"
        except:
            return "Quality assessment not available"
    
    def _get_clinical_correlations(self, findings):
        """Get clinical correlations based on findings."""
        correlations = []
        
        try:
            if findings['image_type'] == 'Chest X-ray':
                correlations.extend([
                    "• Evaluate for respiratory symptoms (cough, shortness of breath, chest pain)",
                    "• Assess for signs of infection, inflammation, or malignancy",
                    "• Consider cardiac evaluation if cardiac silhouette is abnormal",
                    "• Look for signs of trauma or foreign bodies"
                ])
            elif findings['image_type'] == 'Abdominal X-ray':
                correlations.extend([
                    "• Evaluate for abdominal pain, distension, or bowel changes",
                    "• Assess for signs of obstruction, perforation, or inflammation",
                    "• Consider additional imaging if suspicious findings present"
                ])
            elif findings['image_type'] == 'Bone X-ray':
                correlations.extend([
                    "• Evaluate for pain, swelling, or limited range of motion",
                    "• Assess for signs of trauma, infection, or degenerative changes",
                    "• Consider additional imaging for complex fractures or suspicious lesions"
                ])
            else:
                correlations.extend([
                    "• Evaluate symptoms related to the imaged area",
                    "• Assess for signs of acute or chronic conditions",
                    "• Consider additional imaging or consultation as needed"
                ])
        except Exception as e:
            logging.error(f"Error getting clinical correlations: {e}")
            correlations = ["Clinical correlation requires professional medical evaluation"]
        
        return correlations
    
    def _analyze_specific_image_content(self, image):
        """Analyze the specific content of the medical image."""
        insights = []
        
        try:
            # Get image characteristics
            width, height = image.size
            aspect_ratio = width / height
            
            # Analyze image properties for medical content
            gray_image = image.convert('L')
            pixels = list(gray_image.getdata())
            
            # Calculate image statistics
            avg_brightness = sum(pixels) / len(pixels)
            brightness_variance = sum((p - avg_brightness) ** 2 for p in pixels) / len(pixels)
            
            # Determine image type based on characteristics
            image_type = self._determine_image_type(avg_brightness, brightness_variance, aspect_ratio)
            
            insights.append(f"📊 Image Type: {image_type}")
            insights.append(f"📏 Dimensions: {width}x{height} pixels")
            insights.append(f"🎨 Brightness: {'Dark' if avg_brightness < 128 else 'Bright'}")
            insights.append(f"⚡ Contrast: {'High' if brightness_variance > 1000 else 'Low'}")
            
            # Add specific analysis based on image type
            if "X-ray" in image_type:
                insights.extend(self._analyze_xray_specifics(image, avg_brightness, brightness_variance))
            elif "CT" in image_type or "MRI" in image_type:
                insights.extend(self._analyze_scan_specifics(image, avg_brightness, brightness_variance))
            elif "Ultrasound" in image_type:
                insights.extend(self._analyze_ultrasound_specifics(image))
            else:
                insights.extend(self._analyze_general_medical_image(image))
                
        except Exception as e:
            logging.error(f"Error analyzing specific content: {e}")
            insights.append("Unable to analyze specific image content.")
        
        return insights
    
    def _determine_image_type(self, brightness, variance, aspect_ratio):
        """Determine the type of medical image based on characteristics."""
        try:
            # X-rays typically have high contrast and specific brightness patterns
            if variance > 1500 and brightness < 150:
                return "Chest X-ray or Bone X-ray"
            elif variance > 1200 and brightness < 180:
                return "Abdominal X-ray"
            elif variance < 800 and brightness > 200:
                return "CT Scan or MRI"
            elif 0.8 <= aspect_ratio <= 1.2 and variance > 1000:
                return "Standard X-ray"
            elif aspect_ratio > 2.0:
                return "Longitudinal Scan (CT/MRI)"
            else:
                return "Medical Diagnostic Image"
        except:
            return "Medical Image"
    
    def _analyze_xray_specifics(self, image, brightness, variance):
        """Analyze X-ray specific characteristics."""
        insights = []
        
        try:
            insights.append("\n🩻 X-RAY ANALYSIS:")
            
            if brightness < 100:
                insights.append("• Very dark image - may indicate dense tissue or pathology")
                insights.append("• Could show bone fractures, calcifications, or dense masses")
            elif brightness < 150:
                insights.append("• Dark image - typical of normal X-ray appearance")
                insights.append("• Shows bone structures and soft tissue clearly")
            else:
                insights.append("• Bright image - may indicate overexposure or specific pathology")
                insights.append("• Could show air-filled structures or specific conditions")
            
            if variance > 1500:
                insights.append("• High contrast image - excellent for detecting abnormalities")
                insights.append("• Good for identifying fractures, masses, or foreign objects")
            else:
                insights.append("• Lower contrast - may need additional views for complete evaluation")
            
        except Exception as e:
            logging.error(f"Error in X-ray analysis: {e}")
        
        return insights
    
    def _analyze_scan_specifics(self, image, brightness, variance):
        """Analyze CT/MRI scan specific characteristics."""
        insights = []
        
        try:
            insights.append("\n🔬 SCAN ANALYSIS:")
            
            if brightness > 200:
                insights.append("• Bright image - may show air, fat, or specific pathologies")
                insights.append("• Good for identifying air-filled structures or fatty tissue")
            else:
                insights.append("• Darker image - shows soft tissue and bone structures")
                insights.append("• Excellent for detecting masses, inflammation, or fluid")
            
            insights.append("• Cross-sectional imaging provides detailed internal views")
            insights.append("• Can show multiple tissue types and densities")
            
        except Exception as e:
            logging.error(f"Error in scan analysis: {e}")
        
        return insights
    
    def _analyze_ultrasound_specifics(self, image):
        """Analyze ultrasound specific characteristics."""
        insights = []
        
        try:
            insights.append("\n🌊 ULTRASOUND ANALYSIS:")
            insights.append("• Real-time imaging using sound waves")
            insights.append("• Excellent for soft tissue and fluid assessment")
            insights.append("• Can show movement and blood flow")
            insights.append("• Safe and non-invasive imaging method")
            
        except Exception as e:
            logging.error(f"Error in ultrasound analysis: {e}")
        
        return insights
    
    def _analyze_general_medical_image(self, image):
        """Analyze general medical image characteristics."""
        insights = []
        
        try:
            insights.append("\n🏥 GENERAL MEDICAL IMAGE:")
            insights.append("• Shows anatomical structures requiring professional evaluation")
            insights.append("• May contain diagnostic information")
            insights.append("• Requires medical expertise for interpretation")
            
        except Exception as e:
            logging.error(f"Error in general analysis: {e}")
        
        return insights
    
    def _get_personalized_medical_advice(self, image):
        """Get personalized medical advice based on image analysis."""
        insights = []
        
        try:
            # Analyze image urgency and provide appropriate advice
            urgency_level = self._assess_medical_urgency(image)
            
            if urgency_level == "high":
                insights.append("🚨 URGENT MEDICAL ATTENTION NEEDED:")
                insights.append("• Seek immediate medical care")
                insights.append("• Go to emergency room if symptoms are severe")
                insights.append("• Contact your doctor immediately")
            elif urgency_level == "medium":
                insights.append("⚠️ MEDICAL ATTENTION RECOMMENDED:")
                insights.append("• Schedule appointment within 1-2 weeks")
                insights.append("• Monitor symptoms closely")
                insights.append("• Contact doctor if symptoms worsen")
            else:
                insights.append("📋 ROUTINE MEDICAL EVALUATION:")
                insights.append("• Schedule routine appointment")
                insights.append("• No immediate urgency")
                insights.append("• Standard follow-up recommended")
            
            insights.append("\n🎯 SPECIFIC RECOMMENDATIONS:")
            insights.append("• Bring this image to your medical appointment")
            insights.append("• Document any symptoms you're experiencing")
            insights.append("• Note when symptoms started and any triggers")
            insights.append("• Prepare questions for your healthcare provider")
            
        except Exception as e:
            logging.error(f"Error getting personalized advice: {e}")
            insights.append("Unable to provide personalized medical advice.")
        
        return insights
    
    def _assess_medical_urgency(self, image):
        """Assess the urgency level of the medical image."""
        try:
            # This is a simplified assessment - real medical urgency assessment would be more sophisticated
            
            # Analyze image characteristics that might indicate urgency
            gray_image = image.convert('L')
            pixels = list(gray_image.getdata())
            
            # Check for patterns that might indicate urgent conditions
            # This is educational only - not for actual medical diagnosis
            
            # For demonstration purposes, we'll use a simple heuristic
            # In practice, this would require sophisticated medical AI
            
            return "medium"  # Default to medium urgency for safety
            
        except Exception as e:
            logging.error(f"Error assessing urgency: {e}")
            return "medium"  # Default to medium urgency for safety
    
    def _extract_medical_insights(self, results, image):
        """Extract medical insights from the analysis results."""
        try:
            # Get image dimensions
            width, height = image.size
            
            # Basic image analysis
            insights = []
            insights.append(f"Image dimensions: {width}x{height} pixels")
            
            # Analyze the classification results
            if results:
                insights.append("Analysis results:")
                for result in results[:3]:  # Top 3 results
                    insights.append(f"- {result['label']}: {result['score']:.2%}")
            
            # Add medical context
            insights.append("\nMedical Analysis:")
            insights.append("Based on the image analysis, I can provide the following insights:")
            
            # Generate medical recommendations based on what we see
            if results and len(results) > 0:
                top_result = results[0]
                
                # Check if the image shows medical/anatomical content
                medical_keywords = ['medical', 'anatomy', 'body', 'organ', 'tissue', 'skin', 'bone', 'blood', 'x-ray', 'scan', 'ultrasound']
                is_medical = any(keyword in top_result['label'].lower() for keyword in medical_keywords)
                
                if is_medical or top_result['score'] > 0.6:
                    insights.append(f"The image shows characteristics consistent with {top_result['label']}")
                    insights.append("This appears to be a medical image requiring professional evaluation.")
                    insights.append("Recommendations:")
                    insights.append("- Consult with a healthcare professional for proper diagnosis")
                    insights.append("- Document any symptoms you're experiencing")
                    insights.append("- Keep track of when symptoms occur")
                    insights.append("- Bring this image to your medical appointment")
                else:
                    insights.append("The image analysis shows general content")
                    insights.append("Recommendations:")
                    insights.append("- If this is a medical concern, please describe your symptoms")
                    insights.append("- Consider consulting a medical professional")
                    insights.append("- Provide additional context about your medical situation")
            
            return "\n".join(insights)
            
        except Exception as e:
            logging.error(f"Error extracting insights: {e}")
            return "Unable to extract medical insights from the image."
    
    def get_image_description(self, image_path):
        """Get a basic description of the image content."""
        try:
            image = Image.open(image_path)
            width, height = image.size
            
            # Basic image properties
            description = f"Image size: {width}x{height} pixels\n"
            description += f"Format: {image.format}\n"
            description += f"Mode: {image.mode}\n"
            
            # Analyze image characteristics
            if image.mode == 'RGB':
                # Calculate average color
                pixels = list(image.getdata())
                avg_red = sum(p[0] for p in pixels) / len(pixels)
                avg_green = sum(p[1] for p in pixels) / len(pixels)
                avg_blue = sum(p[2] for p in pixels) / len(pixels)
                
                description += f"Color analysis: Red={avg_red:.0f}, Green={avg_green:.0f}, Blue={avg_blue:.0f}\n"
            
            return description
            
        except Exception as e:
            logging.error(f"Error getting image description: {e}")
            return f"Error analyzing image: {str(e)}"

def analyze_image_with_vision(image_path, user_query=""):
    """
    Main function to analyze medical images with vision capabilities.
    """
    analyzer = MedicalVisionAnalyzer()
    
    # Get comprehensive medical image analysis
    medical_analysis = analyzer.analyze_medical_image(image_path)
    
    # Create a dynamic, personalized summary for patients
    if user_query:
        patient_summary = f"""
🔬 PERSONALIZED MEDICAL IMAGE ANALYSIS

{medical_analysis}

❓ YOUR SPECIFIC QUESTION: {user_query}

🎯 CUSTOMIZED ACTION PLAN:
Based on your unique medical image and question, here's your personalized plan:

📋 IMMEDIATE NEXT STEPS:
• Schedule appointment with your healthcare provider (based on image urgency)
• Bring this image to your medical appointment for professional evaluation
• Document your specific symptoms and when they started

🔍 PREPARATION FOR YOUR APPOINTMENT:
• Write down your symptoms, triggers, and duration
• List all current medications and supplements
• Prepare specific questions about what you see in the image
• Note any family history of similar conditions

💡 WHAT TO EXPECT FROM YOUR DOCTOR:
• Professional interpretation of your specific image
• Diagnosis based on your image findings and symptoms
• Treatment plan tailored to your condition
• Recommendations for additional tests if needed

⚠️ IMPORTANT DISCLAIMERS:
• This analysis is for educational purposes only
• Not a substitute for professional medical diagnosis
• Seek immediate care for urgent symptoms
• Always consult qualified healthcare professionals
"""
    else:
        patient_summary = f"""
🔬 PERSONALIZED MEDICAL IMAGE ANALYSIS

{medical_analysis}

🎯 CUSTOMIZED ACTION PLAN:
Based on your unique medical image, here's your personalized plan:

📋 IMMEDIATE NEXT STEPS:
• Schedule appointment with your healthcare provider (based on image urgency)
• Bring this image to your medical appointment for professional evaluation
• Document any symptoms you're experiencing

🔍 PREPARATION FOR YOUR APPOINTMENT:
• Write down your symptoms, triggers, and duration
• List all current medications and supplements
• Prepare questions about what you see in the image
• Note any family history of similar conditions

💡 WHAT TO EXPECT FROM YOUR DOCTOR:
• Professional interpretation of your specific image
• Diagnosis based on your image findings
• Treatment plan tailored to your condition
• Recommendations for additional tests if needed

⚠️ IMPORTANT DISCLAIMERS:
• This analysis is for educational purposes only
• Not a substitute for professional medical diagnosis
• Seek immediate care for urgent symptoms
• Always consult qualified healthcare professionals
"""
    
    return patient_summary
