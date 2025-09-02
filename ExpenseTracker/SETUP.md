# Android Expense Tracker - Local Development Setup Guide

This guide will help you set up your local development environment to run the Android Expense Tracker application.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 10GB free space
- **Processor**: Intel Core i5 or equivalent

### Required Software

#### 1. Java Development Kit (JDK)
```bash
# Check if Java is installed
java -version

# If not installed, download and install JDK 11 or later from:
# https://adoptium.net/temurin/releases/
```

#### 2. Android Studio
**Download**: https://developer.android.com/studio

**Installation Steps**:
1. Download Android Studio for your platform
2. Run the installer
3. Follow the setup wizard
4. Choose "Standard" installation type
5. Wait for components to download

#### 3. Android SDK
Android Studio will install this automatically, but you can verify:
- Open Android Studio
- Go to **File → Settings → Appearance & Behavior → System Settings → Android SDK**
- Ensure these packages are installed:
  - Android SDK Platform 34
  - Android SDK Build-Tools 34.0.0
  - Android Emulator
  - Android SDK Platform-Tools

## 🚀 Project Setup

### Step 1: Clone/Open the Project

#### Option A: If using Android Studio
1. Open Android Studio
2. Click **"Open"**
3. Navigate to the `ExpenseTracker` folder
4. Select the folder and click **"OK"**

#### Option B: Command Line
```bash
cd /path/to/your/projects
# The project is already in the ExpenseTracker folder
cd ExpenseTracker
```

### Step 2: Configure Project

1. **Wait for Gradle Sync**
   - Android Studio will automatically sync Gradle files
   - This may take several minutes on first run
   - Watch the bottom status bar for progress

2. **Resolve Dependencies**
   - If prompted, click "Sync Now" or "OK" to download dependencies
   - Ensure internet connection is stable

### Step 3: Set Up Android Virtual Device (AVD)

1. **Open AVD Manager**
   - In Android Studio: **Tools → Device Manager**
   - Or click the Device Manager icon in toolbar

2. **Create New Virtual Device**
   - Click **"Create device"**
   - Choose a device (e.g., Pixel 6)
   - Select a system image (API 24 or higher, recommended API 34)
   - Click **"Next"** and **"Finish"**

## ▶️ Running the Application

### Method 1: Run from Android Studio

1. **Select Target Device**
   - Click the device dropdown in toolbar
   - Choose your AVD or connected physical device

2. **Run the App**
   - Click the green "Run" button (▶️)
   - Or press `Shift + F10`
   - Wait for build and deployment

### Method 2: Command Line

```bash
# Navigate to project directory
cd ExpenseTracker

# Build the project
./gradlew assembleDebug

# Install on connected device/emulator
./gradlew installDebug

# Run the app (requires device connected)
adb shell am start -n com.expensetracker/.ui.MainActivity
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Gradle Sync Failed
**Symptoms**: "Gradle sync failed" error

**Solutions**:
```bash
# Clean and rebuild
./gradlew clean
./gradlew build

# Invalidate caches
# Android Studio → File → Invalidate Caches / Restart
```

#### 2. SDK Location Issues
**Symptoms**: "SDK location not found"

**Solution**:
- Android Studio → File → Settings → Appearance & Behavior → System Settings → Android SDK
- Set Android SDK location manually if needed

#### 3. Emulator Issues
**Symptoms**: Emulator won't start

**Solutions**:
- Check virtualization is enabled in BIOS
- Update graphics drivers
- Try different emulator configuration
- Use physical device instead

#### 4. Build Errors
**Symptoms**: Compilation errors

**Solutions**:
```bash
# Clean build cache
./gradlew cleanBuildCache

# Check for syntax errors in Kotlin files
# Look at Build → Make Project in Android Studio
```

#### 5. Dependency Issues
**Symptoms**: "Could not resolve dependency"

**Solutions**:
```bash
# Refresh dependencies
./gradlew --refresh-dependencies

# Clear Gradle cache
rm -rf ~/.gradle/caches/
```

### Performance Tips

1. **Enable Gradle Daemon**
   - File → Settings → Build, Execution, Deployment → Gradle
   - Check "Enable Gradle Daemon"

2. **Increase Memory**
   - Help → Edit Custom VM Options
   - Add: `-Xmx4096m`

3. **Use Physical Device**
   - Physical devices are faster than emulators
   - Enable Developer Options → USB Debugging

## 📱 Testing the App

### Basic Functionality Test

1. **Launch the App**
   - Should show home screen with welcome message

2. **Add First Expense**
   - Click "Add Expense" button
   - Fill in amount, description, select category and payment method
   - Click "Add Expense"

3. **View Expenses**
   - Return to home screen
   - Should see the added expense in recent expenses

4. **Database Verification**
   - Expenses should persist between app restarts

## 🔍 Project Structure Overview

```
ExpenseTracker/
├── app/
│   ├── src/main/
│   │   ├── java/com/expensetracker/
│   │   │   ├── data/           # Database, models, repositories
│   │   │   ├── di/            # Dependency injection
│   │   │   ├── ui/            # Activities, screens, navigation
│   │   │   └── ExpenseTrackerApplication.kt
│   │   └── res/               # Resources (layouts, strings, themes)
│   └── build.gradle           # App-level build configuration
├── build.gradle               # Project-level build configuration
├── settings.gradle            # Project settings
└── gradle.properties          # Gradle properties
```

## 🎯 Key Features to Test

- ✅ **Expense Addition**: Add expenses with categories
- ✅ **Data Persistence**: Expenses saved in local database
- ✅ **UI Navigation**: Smooth transitions between screens
- ✅ **Material Design**: Modern UI components
- ✅ **Offline Functionality**: Works without internet

## 📞 Getting Help

If you encounter issues:

1. **Check Logs**
   - Android Studio → View → Tool Windows → Logcat
   - Look for error messages

2. **Build Output**
   - Android Studio → View → Tool Windows → Build
   - Check for compilation errors

3. **Common Resources**
   - [Android Developer Documentation](https://developer.android.com/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/android)
   - [Android Studio Documentation](https://developer.android.com/studio/intro)

## 🚀 Next Steps

Once the app is running successfully, you can:

1. **Explore the Code**: Understand the MVVM architecture
2. **Add Features**: Implement budget management, reports, etc.
3. **Customize UI**: Modify themes and layouts
4. **Add Tests**: Write unit and integration tests
5. **Deploy**: Generate signed APK for distribution

## 📋 System Check

Run this command to verify your setup:

```bash
# Check Java
java -version

# Check Android Studio (if installed via command line)
studio.sh --version

# Check Gradle
./gradlew --version

# Check connected devices
adb devices
```

Happy coding! 🎉
