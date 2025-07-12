from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import sqlite3
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('health_data.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age INTEGER,
            gender TEXT,
            activity_level TEXT,
            smoking_status TEXT,
            family_history TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create BMI history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bmi_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            bmi REAL,
            height REAL,
            weight REAL,
            blood_pressure_systolic INTEGER,
            blood_pressure_diastolic INTEGER,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Health Risk Prediction Model
class HealthRiskPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic health data for model training"""
        np.random.seed(42)
        
        # Generate features
        age = np.random.randint(18, 80, n_samples)
        gender = np.random.choice(['male', 'female'], n_samples)
        bmi = np.random.normal(25, 5, n_samples)
        activity_level = np.random.choice(['sedentary', 'moderate', 'active'], n_samples)
        smoking = np.random.choice(['never', 'former', 'current'], n_samples)
        family_history = np.random.choice(['none', 'diabetes', 'heart_disease', 'both'], n_samples)
        systolic_bp = np.random.randint(90, 180, n_samples)
        diastolic_bp = np.random.randint(60, 120, n_samples)
        
        # Create risk labels based on realistic health risk factors
        risk_scores = []
        for i in range(n_samples):
            risk = 0
            
            # BMI risk
            if bmi[i] > 30: risk += 3
            elif bmi[i] > 25: risk += 1
            elif bmi[i] < 18.5: risk += 2
            
            # Age risk
            if age[i] > 65: risk += 2
            elif age[i] > 45: risk += 1
            
            # Activity level (protective)
            if activity_level[i] == 'sedentary': risk += 1
            elif activity_level[i] == 'active': risk -= 1
            
            # Smoking risk
            if smoking[i] == 'current': risk += 2
            elif smoking[i] == 'former': risk += 1
            
            # Family history
            if family_history[i] == 'both': risk += 2
            elif family_history[i] in ['diabetes', 'heart_disease']: risk += 1
            
            # Blood pressure
            if systolic_bp[i] > 140 or diastolic_bp[i] > 90: risk += 2
            elif systolic_bp[i] > 130 or diastolic_bp[i] > 80: risk += 1
            
            # Classify risk level
            if risk <= 2: risk_scores.append('low')
            elif risk <= 5: risk_scores.append('moderate')
            else: risk_scores.append('high')
        
        # Create DataFrame
        data = pd.DataFrame({
            'age': age,
            'gender': gender,
            'bmi': bmi,
            'activity_level': activity_level,
            'smoking_status': smoking,
            'family_history': family_history,
            'systolic_bp': systolic_bp,
            'diastolic_bp': diastolic_bp,
            'risk_level': risk_scores
        })
        
        return data
    
    def preprocess_data(self, data):
        """Preprocess data for model training"""
        # Encode categorical variables
        data_encoded = pd.get_dummies(data, columns=['gender', 'activity_level', 'smoking_status', 'family_history'])
        
        # Separate features and target
        X = data_encoded.drop('risk_level', axis=1)
        y = data_encoded['risk_level']
        
        return X, y
    
    def train_model(self):
        """Train the health risk prediction model"""
        print("Generating synthetic training data...")
        data = self.generate_synthetic_data(2000)
        
        print("Preprocessing data...")
        X, y = self.preprocess_data(data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        print("Training Random Forest model...")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model accuracy: {accuracy:.3f}")
        
        # Save model and scaler
        joblib.dump(self.model, 'health_risk_model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')
        
        # Save feature names for prediction
        self.feature_names = X.columns.tolist()
        joblib.dump(self.feature_names, 'feature_names.pkl')
        
        self.is_trained = True
        print("Model training completed!")
        
        return {
            'accuracy': accuracy,
            'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_))
        }
    
    def load_model(self):
        """Load trained model"""
        try:
            self.model = joblib.load('health_risk_model.pkl')
            self.scaler = joblib.load('scaler.pkl')
            self.feature_names = joblib.load('feature_names.pkl')
            self.is_trained = True
            print("Model loaded successfully!")
        except FileNotFoundError:
            print("No trained model found. Training new model...")
            self.train_model()
    
    def predict_risk(self, user_data):
        """Predict health risk for a user"""
        if not self.is_trained:
            self.load_model()
        
        # Create DataFrame with user data
        df = pd.DataFrame([user_data])
        
        # Encode categorical variables to match training data
        df_encoded = pd.get_dummies(df, columns=['gender', 'activity_level', 'smoking_status', 'family_history'])
        
        # Ensure all columns from training are present
        for col in self.feature_names:
            if col not in df_encoded.columns:
                df_encoded[col] = 0
        
        # Reorder columns to match training data
        df_encoded = df_encoded[self.feature_names]
        
        # Scale features
        X_scaled = self.scaler.transform(df_encoded)
        
        # Make prediction
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        # Get class names
        classes = self.model.classes_
        prob_dict = dict(zip(classes, probabilities))
        
        return {
            'risk_level': prediction,
            'probabilities': prob_dict,
            'confidence': max(probabilities)
        }

# Initialize model
predictor = HealthRiskPredictor()

@app.route('/')
def index():
    return jsonify({
        'message': 'BMI Health Risk Prediction API',
        'version': '1.0',
        'endpoints': ['/predict', '/train', '/user-profile']
    })

@app.route('/train', methods=['POST'])
def train_model():
    """Train the ML model"""
    try:
        results = predictor.train_model()
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'results': results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict_health_risk():
    """Predict health risk based on user data"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['age', 'gender', 'bmi', 'activity_level', 'smoking_status', 'family_history']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Add default values for optional fields
        user_data = {
            'age': data['age'],
            'gender': data['gender'],
            'bmi': data['bmi'],
            'activity_level': data['activity_level'],
            'smoking_status': data['smoking_status'],
            'family_history': data['family_history'],
            'systolic_bp': data.get('systolic_bp', 120),
            'diastolic_bp': data.get('diastolic_bp', 80)
        }
        
        # Get prediction
        prediction = predictor.predict_risk(user_data)
        
        # Generate recommendations
        recommendations = generate_recommendations(prediction['risk_level'], user_data)
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/user-profile', methods=['POST'])
def create_user_profile():
    """Create or update user profile"""
    try:
        data = request.json
        
        conn = sqlite3.connect('health_data.db')
        cursor = conn.cursor()
        
        # Insert user data
        cursor.execute('''
            INSERT INTO users (age, gender, activity_level, smoking_status, family_history)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['age'], data['gender'], data['activity_level'], 
              data['smoking_status'], data['family_history']))
        
        user_id = cursor.lastrowid
        
        # Insert BMI history
        cursor.execute('''
            INSERT INTO bmi_history (user_id, bmi, height, weight, blood_pressure_systolic, blood_pressure_diastolic)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, data['bmi'], data['height'], data['weight'],
              data.get('systolic_bp', 120), data.get('diastolic_bp', 80)))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User profile created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_recommendations(risk_level, user_data):
    """Generate personalized health recommendations"""
    recommendations = []
    
    if risk_level == 'high':
        recommendations.append("Consult with a healthcare professional immediately for comprehensive health assessment.")
        recommendations.append("Consider lifestyle modifications including diet and exercise changes.")
        
    if user_data['bmi'] > 25:
        recommendations.append("Focus on gradual weight loss through balanced diet and regular exercise.")
        
    if user_data['activity_level'] == 'sedentary':
        recommendations.append("Incorporate at least 150 minutes of moderate-intensity exercise per week.")
        
    if user_data['smoking_status'] == 'current':
        recommendations.append("Consider smoking cessation programs to significantly reduce health risks.")
        
    if risk_level == 'moderate':
        recommendations.append("Maintain regular health check-ups and monitor key health metrics.")
        
    if risk_level == 'low':
        recommendations.append("Continue your current healthy lifestyle habits.")
        recommendations.append("Regular health screenings are still important for preventive care.")
    
    return recommendations

if __name__ == '__main__':
    init_db()
    predictor.load_model()
    app.run(debug=True, port=5000) 