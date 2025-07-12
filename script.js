// BMI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('bmiForm');
    const heightInput = document.getElementById('height');
    const heightInchesInput = document.getElementById('heightInches');
    const weightInput = document.getElementById('weight');
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');
    const calculateBtn = document.querySelector('.calculate-btn');
    const resultSection = document.getElementById('resultSection');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    // Error message elements
    const heightError = document.getElementById('height-error');
    const weightError = document.getElementById('weight-error');

    // BMI categories with ranges
    const bmiCategories = {
        underweight: { min: 0, max: 18.4, label: 'Underweight', class: 'underweight' },
        normal: { min: 18.5, max: 24.9, label: 'Normal weight', class: 'normal' },
        overweight: { min: 25, max: 29.9, label: 'Overweight', class: 'overweight' },
        obese: { min: 30, max: Infinity, label: 'Obese', class: 'obese' }
    };

    // Initialize the calculator
    init();

    function init() {
        // Event listeners
        form.addEventListener('submit', handleSubmit);
        heightUnit.addEventListener('change', toggleHeightUnits);
        
        // Real-time validation
        heightInput.addEventListener('input', validateHeight);
        heightInchesInput.addEventListener('input', validateHeight);
        weightInput.addEventListener('input', validateWeight);

        // Real-time calculation (optional)
        heightInput.addEventListener('input', debounce(calculateIfValid, 500));
        heightInchesInput.addEventListener('input', debounce(calculateIfValid, 500));
        weightInput.addEventListener('input', debounce(calculateIfValid, 500));
        heightUnit.addEventListener('change', calculateIfValid);
        weightUnit.addEventListener('change', calculateIfValid);
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if (validateForm()) {
            calculateBMI();
        }
    }

    function toggleHeightUnits() {
        if (heightUnit.value === 'ft') {
            heightInchesInput.style.display = 'block';
            heightInput.placeholder = 'Enter feet';
            heightInchesInput.placeholder = 'Enter inches';
        } else {
            heightInchesInput.style.display = 'none';
            heightInput.placeholder = 'Enter your height';
        }
        clearError(heightError);
        calculateIfValid();
    }

    function validateHeight() {
        const height = parseFloat(heightInput.value);
        const inches = parseFloat(heightInchesInput.value) || 0;
        
        clearError(heightError);

        if (!height || height <= 0) {
            if (heightInput.value) {
                showError(heightError, 'Please enter a valid height');
                return false;
            }
            return true; // Empty is ok for real-time validation
        }

        if (heightUnit.value === 'cm') {
            if (height < 50 || height > 300) {
                showError(heightError, 'Height should be between 50-300 cm');
                return false;
            }
        } else {
            if (height < 2 || height > 9) {
                showError(heightError, 'Height should be between 2-9 feet');
                return false;
            }
            if (inches < 0 || inches > 11) {
                showError(heightError, 'Inches should be between 0-11');
                return false;
            }
        }

        return true;
    }

    function validateWeight() {
        const weight = parseFloat(weightInput.value);
        
        clearError(weightError);

        if (!weight || weight <= 0) {
            if (weightInput.value) {
                showError(weightError, 'Please enter a valid weight');
                return false;
            }
            return true; // Empty is ok for real-time validation
        }

        if (weightUnit.value === 'kg') {
            if (weight < 10 || weight > 500) {
                showError(weightError, 'Weight should be between 10-500 kg');
                return false;
            }
        } else {
            if (weight < 22 || weight > 1100) {
                showError(weightError, 'Weight should be between 22-1100 lbs');
                return false;
            }
        }

        return true;
    }

    function validateForm() {
        const heightValid = validateHeight();
        const weightValid = validateWeight();
        
        // Check if values are actually entered
        if (!heightInput.value) {
            showError(heightError, 'Height is required');
            return false;
        }
        
        if (!weightInput.value) {
            showError(weightError, 'Weight is required');
            return false;
        }

        return heightValid && weightValid;
    }

    function calculateIfValid() {
        if (heightInput.value && weightInput.value && 
            (!heightInchesInput.style.display !== 'none' || heightInchesInput.value || heightUnit.value === 'cm')) {
            if (validateHeight() && validateWeight()) {
                calculateBMI();
            }
        }
    }

    function calculateBMI() {
        // Get values
        let height = parseFloat(heightInput.value);
        const inches = parseFloat(heightInchesInput.value) || 0;
        let weight = parseFloat(weightInput.value);

        if (!height || !weight) return;

        // Convert to metric if needed
        if (heightUnit.value === 'ft') {
            height = (height * 12 + inches) * 2.54; // Convert to cm
        }
        
        if (weightUnit.value === 'lbs') {
            weight = weight * 0.453592; // Convert to kg
        }

        // Convert height to meters
        const heightInMeters = height / 100;

        // Calculate BMI
        const bmi = weight / (heightInMeters * heightInMeters);

        // Display result
        displayResult(bmi);
    }

    function displayResult(bmi) {
        // Add loading state briefly for better UX
        calculateBtn.classList.add('loading');
        
        setTimeout(() => {
            calculateBtn.classList.remove('loading');
            
            // Update BMI value
            bmiValue.textContent = bmi.toFixed(1);
            
            // Determine category
            const category = getBMICategory(bmi);
            
            // Update category display
            bmiCategory.textContent = category.label;
            bmiCategory.className = `bmi-category ${category.class}`;
            
            // Highlight corresponding chart item
            highlightChartItem(category.class);
            
            // Show result section with animation
            resultSection.classList.add('show');
            
            // Scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }

    function getBMICategory(bmi) {
        for (const [key, category] of Object.entries(bmiCategories)) {
            if (bmi >= category.min && bmi <= category.max) {
                return category;
            }
        }
        return bmiCategories.normal; // Default fallback
    }

    function highlightChartItem(categoryClass) {
        // Remove previous active states
        document.querySelectorAll('.chart-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active state to current category
        const activeItem = document.querySelector(`.chart-item.${categoryClass}`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }

    function clearError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.opacity = '0';
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.closest('.calculator-form')) {
            e.preventDefault();
            if (validateForm()) {
                calculateBMI();
            }
        }
    });

    // Add some helpful tips
    const tips = [
        'BMI is a screening tool and not a diagnostic tool.',
        'BMI may not be accurate for athletes with high muscle mass.',
        'Consult healthcare professionals for personalized advice.',
        'BMI is one of many factors to consider for health assessment.'
    ];

    // ML Integration
    const healthProfileSection = document.getElementById('healthProfileSection');
    const healthRiskSection = document.getElementById('healthRiskSection');
    const analyzeRiskBtn = document.getElementById('analyzeRiskBtn');
    
    // Health profile form elements
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const activityLevelSelect = document.getElementById('activityLevel');
    const smokingStatusSelect = document.getElementById('smokingStatus');
    const familyHistorySelect = document.getElementById('familyHistory');
    const systolicBPInput = document.getElementById('systolicBP');
    const diastolicBPInput = document.getElementById('diastolicBP');
    
    // Risk display elements
    const riskLevel = document.getElementById('riskLevel');
    const riskConfidence = document.getElementById('riskConfidence');
    const lowRiskBar = document.getElementById('lowRiskBar');
    const moderateRiskBar = document.getElementById('moderateRiskBar');
    const highRiskBar = document.getElementById('highRiskBar');
    const lowRiskValue = document.getElementById('lowRiskValue');
    const moderateRiskValue = document.getElementById('moderateRiskValue');
    const highRiskValue = document.getElementById('highRiskValue');
    const recommendationsList = document.getElementById('recommendationsList');
    
    // Add event listener for health risk analysis
    analyzeRiskBtn.addEventListener('click', analyzeHealthRisk);
    
    // Show health profile section after BMI calculation
    function showHealthProfile() {
        healthProfileSection.style.display = 'block';
        healthProfileSection.classList.add('show');
        healthProfileSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Analyze health risk using ML backend
    async function analyzeHealthRisk() {
        try {
            // Validate health profile inputs
            if (!validateHealthProfile()) {
                return;
            }
            
            // Get current BMI
            const currentBMI = parseFloat(bmiValue.textContent);
            if (!currentBMI || currentBMI === 0) {
                alert('Please calculate your BMI first');
                return;
            }
            
            // Disable button and show loading
            analyzeRiskBtn.disabled = true;
            analyzeRiskBtn.textContent = 'Analyzing...';
            
            // Prepare data for ML prediction
            const healthData = {
                age: parseInt(ageInput.value),
                gender: genderSelect.value,
                bmi: currentBMI,
                activity_level: activityLevelSelect.value,
                smoking_status: smokingStatusSelect.value,
                family_history: familyHistorySelect.value,
                systolic_bp: systolicBPInput.value ? parseInt(systolicBPInput.value) : 120,
                diastolic_bp: diastolicBPInput.value ? parseInt(diastolicBPInput.value) : 80,
                height: parseFloat(heightInput.value),
                weight: parseFloat(weightInput.value)
            };
            
            // Make API call to ML backend
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(healthData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to get health risk prediction');
            }
            
            const result = await response.json();
            
            if (result.success) {
                displayHealthRiskResults(result.prediction, result.recommendations);
                
                // Save user profile
                await saveUserProfile(healthData);
            } else {
                throw new Error(result.error || 'Prediction failed');
            }
            
        } catch (error) {
            console.error('Error analyzing health risk:', error);
            alert('Unable to analyze health risk. Please ensure the ML backend is running or try again later.');
        } finally {
            // Re-enable button
            analyzeRiskBtn.disabled = false;
            analyzeRiskBtn.textContent = 'Analyze Health Risk';
        }
    }
    
    // Validate health profile inputs
    function validateHealthProfile() {
        const requiredFields = [
            { element: ageInput, name: 'Age' },
            { element: genderSelect, name: 'Gender' },
            { element: activityLevelSelect, name: 'Activity Level' },
            { element: smokingStatusSelect, name: 'Smoking Status' },
            { element: familyHistorySelect, name: 'Family History' }
        ];
        
        for (const field of requiredFields) {
            if (!field.element.value) {
                alert(`Please select ${field.name}`);
                field.element.focus();
                return false;
            }
        }
        
        if (ageInput.value < 1 || ageInput.value > 120) {
            alert('Please enter a valid age between 1 and 120');
            ageInput.focus();
            return false;
        }
        
        return true;
    }
    
    // Display health risk results
    function displayHealthRiskResults(prediction, recommendations) {
        // Update risk level
        riskLevel.textContent = prediction.risk_level;
        riskLevel.className = `risk-level ${prediction.risk_level}`;
        
        // Update confidence
        riskConfidence.textContent = `Confidence: ${(prediction.confidence * 100).toFixed(1)}%`;
        
        // Update probability bars
        const probabilities = prediction.probabilities;
        
        // Ensure all risk levels are represented
        const lowProb = (probabilities.low || 0) * 100;
        const moderateProb = (probabilities.moderate || 0) * 100;
        const highProb = (probabilities.high || 0) * 100;
        
        // Update bars with animation
        setTimeout(() => {
            lowRiskBar.style.width = `${lowProb}%`;
            moderateRiskBar.style.width = `${moderateProb}%`;
            highRiskBar.style.width = `${highProb}%`;
            
            lowRiskValue.textContent = `${lowProb.toFixed(1)}%`;
            moderateRiskValue.textContent = `${moderateProb.toFixed(1)}%`;
            highRiskValue.textContent = `${highProb.toFixed(1)}%`;
        }, 100);
        
        // Display recommendations
        displayRecommendations(recommendations, prediction.risk_level);
        
        // Show health risk section
        healthRiskSection.style.display = 'grid';
        healthRiskSection.classList.add('show');
        healthRiskSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Display recommendations
    function displayRecommendations(recommendations, riskLevel) {
        recommendationsList.innerHTML = '';
        
        recommendations.forEach((recommendation, index) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            
            // Add priority class based on risk level and recommendation content
            if (riskLevel === 'high' && index < 2) {
                item.classList.add('high-priority');
            } else if (riskLevel === 'moderate' || (riskLevel === 'high' && index < 4)) {
                item.classList.add('medium-priority');
            } else {
                item.classList.add('low-priority');
            }
            
            item.textContent = recommendation;
            recommendationsList.appendChild(item);
        });
    }
    
    // Save user profile to backend
    async function saveUserProfile(healthData) {
        try {
            const response = await fetch('http://localhost:5000/user-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(healthData)
            });
            
            if (response.ok) {
                console.log('User profile saved successfully');
            }
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }
    
    // Modified displayResult function to show health profile
    const originalDisplayResult = displayResult;
    displayResult = function(bmi) {
        originalDisplayResult(bmi);
        
        // Show health profile section after BMI calculation
        setTimeout(() => {
            showHealthProfile();
        }, 1000);
    };
    
    // Train model button (for development)
    if (window.location.search.includes('dev=true')) {
        const trainBtn = document.createElement('button');
        trainBtn.textContent = 'Train ML Model';
        trainBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer;';
        trainBtn.onclick = async () => {
            try {
                const response = await fetch('http://localhost:5000/train', { method: 'POST' });
                const result = await response.json();
                alert(result.success ? 'Model trained successfully!' : 'Training failed: ' + result.error);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        };
        document.body.appendChild(trainBtn);
    }
    
    console.log('BMI Calculator with ML Health Risk Prediction loaded successfully!');
    console.log('Health tips:', tips);
}); 