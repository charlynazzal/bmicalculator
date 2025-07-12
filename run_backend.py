#!/usr/bin/env python3
"""
BMI Health Risk Prediction Backend
Run this script to start the Flask ML server
"""

import os
import sys
import subprocess
import time

def check_dependencies():
    """Check if required Python packages are installed"""
    try:
        import flask
        import pandas
        import numpy
        import sklearn
        import joblib
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing package: {e}")
        print("Please install required packages:")
        print("pip install -r requirements.txt")
        return False

def main():
    print("=" * 50)
    print("BMI Health Risk Prediction Backend")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check if port 5000 is available
    print("\nStarting Flask server on port 5000...")
    print("Frontend URL: http://localhost:3000 (or wherever you serve the HTML)")
    print("Backend API URL: http://localhost:5000")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    # Start the Flask app
    try:
        from app import app
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 