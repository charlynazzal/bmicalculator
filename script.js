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

    // You could add a tips section or tooltip functionality here
    console.log('BMI Calculator loaded successfully!');
    console.log('Health tips:', tips);
}); 