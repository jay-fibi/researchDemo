#!/bin/bash

echo "🔍 Android Expense Tracker - Setup Verification"
echo "=============================================="
echo ""

# Check Java
echo "📋 Checking Java installation..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    echo "✅ Java found: $JAVA_VERSION"
else
    echo "❌ Java not found. Please install JDK 11 or later."
    echo "   Download from: https://adoptium.net/temurin/releases/"
fi
echo ""

# Check Android Studio (if installed)
echo "📋 Checking Android Studio..."
if command -v studio.sh &> /dev/null; then
    echo "✅ Android Studio found"
elif [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ Android Studio found (macOS)"
elif [ -d "$HOME/android-studio" ]; then
    echo "✅ Android Studio found (Linux)"
elif [ -d "C:\Program Files\Android\Android Studio" ]; then
    echo "✅ Android Studio found (Windows)"
else
    echo "⚠️  Android Studio not found in common locations"
    echo "   Download from: https://developer.android.com/studio"
fi
echo ""

# Check Gradle
echo "📋 Checking Gradle..."
if [ -f "./gradlew" ]; then
    echo "✅ Gradle wrapper found"
    if ./gradlew --version &> /dev/null; then
        GRADLE_VERSION=$(./gradlew --version | grep "Gradle" | cut -d' ' -f2)
        echo "✅ Gradle working: $GRADLE_VERSION"
    else
        echo "❌ Gradle wrapper not working"
    fi
else
    echo "❌ Gradle wrapper not found"
fi
echo ""

# Check Android SDK
echo "📋 Checking Android SDK..."
if command -v adb &> /dev/null; then
    echo "✅ Android SDK Platform Tools found"
    ADB_VERSION=$(adb version | head -n 1)
    echo "   $ADB_VERSION"
else
    echo "❌ Android SDK Platform Tools not found"
    echo "   Install via Android Studio SDK Manager"
fi
echo ""

# Check project structure
echo "📋 Checking project structure..."
if [ -f "app/build.gradle" ]; then
    echo "✅ App module found"
else
    echo "❌ App module not found"
fi

if [ -f "settings.gradle" ]; then
    echo "✅ Project settings found"
else
    echo "❌ Project settings not found"
fi

if [ -d "app/src/main/java/com/expensetracker" ]; then
    echo "✅ Source code directory found"
else
    echo "❌ Source code directory not found"
fi
echo ""

# Check for connected devices
echo "📋 Checking connected devices..."
if command -v adb &> /dev/null; then
    DEVICE_COUNT=$(adb devices | grep -c "device$")
    if [ "$DEVICE_COUNT" -gt 0 ]; then
        echo "✅ $DEVICE_COUNT device(s) connected"
        adb devices
    else
        echo "⚠️  No devices connected"
        echo "   Connect a physical device or start an emulator"
    fi
else
    echo "⚠️  Cannot check devices (ADB not found)"
fi
echo ""

# Summary
echo "📊 Setup Summary:"
echo "=================="

ISSUES=0

if ! command -v java &> /dev/null; then
    echo "❌ Java: Not installed"
    ((ISSUES++))
else
    echo "✅ Java: Installed"
fi

if [ ! -f "./gradlew" ]; then
    echo "❌ Gradle: Not found"
    ((ISSUES++))
else
    echo "✅ Gradle: Ready"
fi

if [ ! -f "app/build.gradle" ]; then
    echo "❌ Project: Incomplete"
    ((ISSUES++))
else
    echo "✅ Project: Complete"
fi

echo ""
if [ "$ISSUES" -eq 0 ]; then
    echo "🎉 Setup looks good! You can now open the project in Android Studio."
    echo ""
    echo "Next steps:"
    echo "1. Open Android Studio"
    echo "2. File → Open → Select ExpenseTracker folder"
    echo "3. Wait for Gradle sync to complete"
    echo "4. Run the app on a device or emulator"
else
    echo "⚠️  $ISSUES issue(s) found. Please resolve them before proceeding."
fi

echo ""
echo "For detailed setup instructions, see SETUP.md"
