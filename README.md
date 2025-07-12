# BMI Calculator with ML Health Risk Prediction

A comprehensive Body Mass Index calculator with machine learning-powered health risk assessment. This application combines traditional BMI calculations with advanced predictive analytics to provide personalized health insights and recommendations.

## Features

### Core BMI Calculator
- **Dual Unit Support**: Calculate BMI using metric (cm/kg) or imperial (ft-in/lbs) units
- **Real-time Validation**: Input validation with helpful error messages
- **Interactive Interface**: Live calculations as you type with debounced updates
- **Visual Feedback**: Color-coded BMI categories with highlighted results
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Professional UI**: Clean, modern design with smooth animations

### Machine Learning Health Risk Assessment
- **Predictive Analytics**: Random Forest model trained on health risk factors
- **Comprehensive Risk Profiling**: Analyzes age, gender, activity level, smoking status, family history
- **Personalized Recommendations**: AI-generated health advice based on risk assessment
- **Risk Probability Visualization**: Interactive charts showing risk level distributions
- **Data Persistence**: SQLite database for storing user profiles and BMI history
- **RESTful API**: Flask backend with standardized endpoints for ML predictions

## BMI Categories

- **Underweight**: Below 18.5
- **Normal Weight**: 18.5 - 24.9
- **Overweight**: 25.0 - 29.9
- **Obese**: 30.0 and above

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript ES6+**: Vanilla JavaScript with Fetch API for backend communication
- **Google Fonts**: Inter font family for professional typography

### Backend (Machine Learning)
- **Python 3.8+**: Core backend language
- **Flask**: Lightweight web framework for API endpoints
- **scikit-learn**: Machine learning library for predictive modeling
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing support
- **SQLite**: Lightweight database for data persistence
- **joblib**: Model serialization and persistence

## Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/charlynazzal/bmicalculator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bmicalculator
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Quick Start (Recommended)
```bash
# Start the ML backend server
python run_backend.py

# In a separate terminal, serve the frontend
python -m http.server 3000
```

#### Option 2: Manual Setup
1. Start the Flask ML backend:
   ```bash
   python app.py
   ```

2. In a separate terminal, serve the frontend:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve . -p 3000
   ```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## File Structure

```
bmicalculator/
├── index.html          # Main HTML structure with ML integration
├── style.css           # Styling and responsive design
├── script.js           # Frontend functionality with ML API calls
├── app.py              # Flask backend with ML model
├── run_backend.py      # Backend startup script
├── requirements.txt    # Python dependencies
├── README.md           # Project documentation
└── Generated Files:
    ├── health_data.db          # SQLite database (auto-generated)
    ├── health_risk_model.pkl   # Trained ML model (auto-generated)
    ├── scaler.pkl              # Feature scaler (auto-generated)
    └── feature_names.pkl       # Model features (auto-generated)
```

## Usage

### Basic BMI Calculation
1. Enter your height using the dropdown to select units (cm or ft/in)
2. Enter your weight using the dropdown to select units (kg or lbs)
3. Click "Calculate BMI" or the form will auto-calculate as you type
4. View your BMI result with category classification
5. See the highlighted category in the reference chart

### Health Risk Assessment (ML Feature)
6. After calculating BMI, the health profile section will appear
7. Complete your health profile:
   - Age and gender
   - Activity level (sedentary, moderate, active)
   - Smoking status (never, former, current)
   - Family history of diabetes/heart disease
   - Blood pressure (optional)
8. Click "Analyze Health Risk" to get ML-powered predictions
9. View your risk assessment:
   - Overall risk level (Low, Moderate, High)
   - Probability breakdown with visual charts
   - Personalized health recommendations
10. All data is stored locally for future reference

### API Endpoints
The backend provides RESTful API endpoints:
- `GET /` - API information
- `POST /predict` - Health risk prediction
- `POST /train` - Train/retrain the ML model
- `POST /user-profile` - Save user profile data

## Author

Built by [Charly Nazzal](https://github.com/charlynazzal) 
