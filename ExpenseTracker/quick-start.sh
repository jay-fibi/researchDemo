#!/bin/bash

echo "🚀 Android Expense Tracker - Quick Start"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Not in the correct project directory"
    echo "   Please run this script from the ExpenseTracker directory"
    exit 1
fi

echo "📋 Running setup verification..."
./verify-setup.sh
echo ""

# Check if verification passed
if [ $? -eq 0 ]; then
    echo "✅ Setup verification passed!"
    echo ""
    echo "🎯 Quick Start Options:"
    echo "======================="
    echo ""
    echo "1. 🖥️  Open in Android Studio (Recommended)"
    echo "   Command: studio.sh ExpenseTracker/ &"
    echo ""
    echo "2. 🔨 Build the project"
    echo "   Command: ./gradlew assembleDebug"
    echo ""
    echo "3. 📱 Install on device"
    echo "   Command: ./gradlew installDebug"
    echo ""
    echo "4. ▶️  Run on connected device"
    echo "   Command: adb shell am start -n com.expensetracker/.ui.MainActivity"
    echo ""
    echo "5. 🧹 Clean build"
    echo "   Command: ./gradlew clean build"
    echo ""
    echo "📚 Useful commands:"
    echo "==================="
    echo ""
    echo "# Check connected devices"
    echo "adb devices"
    echo ""
    echo "# View device logs"
    echo "adb logcat"
    echo ""
    echo "# Build and install in one command"
    echo "./gradlew installDebug"
    echo ""
    echo "# Run tests"
    echo "./gradlew test"
    echo ""
    echo "🎉 Your Android Expense Tracker is ready to run!"
    echo ""
    echo "💡 Pro Tips:"
    echo "============"
    echo "• Use a physical device for better performance"
    echo "• Enable USB debugging in developer options"
    echo "• Check SETUP.md for detailed instructions"
    echo "• Use Android Studio's built-in emulator if no device available"
else
    echo "❌ Setup verification failed. Please check the issues above."
    echo "   See SETUP.md for detailed setup instructions."
    exit 1
fi
