# BMI Calculator

A professional, interactive Body Mass Index calculator built with vanilla HTML5, CSS3, and JavaScript. This application provides accurate BMI calculations with support for both metric and imperial units, real-time validation, and visual feedback.

## Features

- **Dual Unit Support**: Calculate BMI using metric (cm/kg) or imperial (ft-in/lbs) units
- **Real-time Validation**: Input validation with helpful error messages
- **Interactive Interface**: Live calculations as you type with debounced updates
- **Visual Feedback**: Color-coded BMI categories with highlighted results
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Professional UI**: Clean, modern design with smooth animations

## BMI Categories

- **Underweight**: Below 18.5
- **Normal Weight**: 18.5 - 24.9
- **Overweight**: 25.0 - 29.9
- **Obese**: 30.0 and above

## Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript ES6+**: Vanilla JavaScript with no external dependencies
- **Google Fonts**: Inter font family for professional typography

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/charlynazzal/bmicalculator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bmicalculator
   ```

3. Open `index.html` in your web browser or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

4. Access the calculator at `http://localhost:8000`

## File Structure

```
bmicalculator/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Interactive functionality
└── README.md       # Project documentation
```

## Usage

1. Enter your height using the dropdown to select units (cm or ft/in)
2. Enter your weight using the dropdown to select units (kg or lbs)
3. Click "Calculate BMI" or the form will auto-calculate as you type
4. View your BMI result with category classification
5. See the highlighted category in the reference chart

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This BMI calculator is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with healthcare professionals for medical guidance.

## Author

Built by [Charlyn Azzal](https://github.com/charlynazzal) 