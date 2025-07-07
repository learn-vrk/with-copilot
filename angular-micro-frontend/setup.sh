#!/bin/bash

echo "🚀 Setting up Angular Micro Frontend Application..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Angular CLI globally if not present
if ! command -v ng &> /dev/null; then
    echo "🔧 Installing Angular CLI..."
    npm install -g @angular/cli
fi

# Install module federation plugin
echo "🔌 Installing Module Federation..."
npm install @angular-architects/module-federation@^18.0.0

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Run 'npm run serve:shell' to start the shell application"
echo "2. Open http://localhost:4200 in your browser"
echo ""
echo "Or use VS Code tasks to start both applications simultaneously."
