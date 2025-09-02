# Expense Tracker Android App

A comprehensive Android application for tracking daily expenses with budget management, category organization, and visual reporting.

## Features

### Core Features
- **Daily Budget Management**: Set and track daily, weekly, monthly, and yearly budgets
- **Expense Tracking**: Add expenses with date-wise organization
- **Category Management**: Choose from default categories or create custom ones
- **Visual Reports**: View expenses with different categories through charts and graphs
- **Payment Methods**: Track expenses by payment method (Cash, Card, Online, etc.)

### Technical Features
- **Offline Support**: Full offline functionality with local database
- **Material Design 3**: Modern UI with Material Design 3 components
- **Jetpack Compose**: Built with modern declarative UI toolkit
- **Room Database**: Local SQLite database with Room persistence library
- **MVVM Architecture**: Clean architecture with ViewModels and Repositories
- **Dependency Injection**: Hilt for dependency injection
- **Coroutines & Flow**: Asynchronous operations with Kotlin Coroutines and Flow

## Technology Stack

- **Language**: Kotlin
- **Architecture**: MVVM with Clean Architecture
- **UI Framework**: Jetpack Compose
- **Database**: Room Persistence Library
- **Dependency Injection**: Hilt
- **Navigation**: Jetpack Navigation Compose
- **Async Programming**: Kotlin Coroutines & Flow

## Project Structure

```
app/src/main/java/com/expensetracker/
├── data/
│   ├── database/          # Room database and DAOs
│   ├── model/            # Data models/entities
│   └── repository/       # Repository layer
├── di/                   # Dependency injection modules
├── ui/
│   ├── navigation/       # Navigation components
│   ├── screens/         # UI screens
│   ├── theme/           # Theme and styling
│   └── viewmodel/       # ViewModels
└── ExpenseTrackerApplication.kt
```

## Database Schema

### Main Entities
- **User**: User profile information
- **Category**: Expense categories (default and custom)
- **Expense**: Individual expense records
- **Budget**: Budget settings for different periods
- **PaymentMethod**: Payment method options

## Getting Started

### Prerequisites
- Android Studio Arctic Fox or later
- Minimum SDK: API 24 (Android 7.0)
- Target SDK: API 34 (Android 14)

### Building the Project

1. Clone the repository
2. Open the project in Android Studio
3. Sync the project with Gradle files
4. Build and run on an emulator or device

### Gradle Commands

```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Run tests
./gradlew test

# Run lint checks
./gradlew lint
```

## Key Components

### Data Layer
- **AppDatabase**: Main database class with Room configuration
- **DAOs**: Data Access Objects for database operations
- **Repositories**: Business logic and data transformation
- **Models**: Data entities and domain models

### UI Layer
- **Screens**: Main UI components (Home, AddExpense, etc.)
- **ViewModels**: State management and business logic
- **Navigation**: Screen navigation with Jetpack Navigation
- **Theme**: Material Design 3 theme configuration

### Dependency Injection
- **DatabaseModule**: Provides database and DAO instances
- **Application**: Hilt application class

## Features in Detail

### 1. Budget Management
- Set daily, weekly, monthly, and yearly budgets
- Track budget utilization
- Visual indicators for budget status
- Recurring budget support

### 2. Expense Tracking
- Quick expense entry
- Category selection
- Payment method tracking
- Date selection (defaults to current date)
- Description and amount input

### 3. Category System
- Pre-defined categories (Food, Transport, Entertainment, etc.)
- Custom category creation
- Color coding for visual organization
- Category-based expense filtering

### 4. Reports & Analytics
- Daily expense summaries
- Weekly and monthly overviews
- Category distribution charts
- Expense trends and patterns
- Export capabilities (future enhancement)

## Architecture Principles

### MVVM Pattern
- **Model**: Data models and business logic
- **View**: UI components (Composable functions)
- **ViewModel**: State management and UI logic

### Clean Architecture
- **Presentation Layer**: UI and ViewModels
- **Domain Layer**: Use cases and business logic
- **Data Layer**: Repositories and data sources

### SOLID Principles
- Single Responsibility: Each class has one responsibility
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes are substitutable for base types
- Interface Segregation: Specific interfaces over general ones
- Dependency Inversion: Depend on abstractions, not concretions

## Future Enhancements

- Cloud synchronization
- Multi-currency support
- Receipt scanning with OCR
- Advanced analytics and insights
- Budget alerts and notifications
- Data export (PDF, CSV)
- Multi-language support
- Dark/light theme toggle
- Biometric authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material Design 3 for UI inspiration
- Android Jetpack libraries for robust development
- Kotlin programming language for modern Android development
