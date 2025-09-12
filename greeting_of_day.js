// Simple Greeting of the Day Program
// This program displays different greetings based on the current time

function getGreetingOfDay() {
    // Get current date and time
    const now = new Date();
    const currentHour = now.getHours();
    
    // Determine greeting based on time of day
    let greeting;
    let timeOfDay;
    
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good Morning!";
        timeOfDay = "morning";
    } else if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good Afternoon!";
        timeOfDay = "afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
        greeting = "Good Evening!";
        timeOfDay = "evening";
    } else {
        greeting = "Good Night!";
        timeOfDay = "night";
    }
    
    return { greeting, timeOfDay, currentHour };
}

function displayGreeting() {
    const { greeting, timeOfDay, currentHour } = getGreetingOfDay();
    const now = new Date();
    
    console.log("=".repeat(40));
    console.log("    GREETING OF THE DAY PROGRAM");
    console.log("=".repeat(40));
    console.log(`Current Time: ${now.toLocaleTimeString()}`);
    console.log(`Current Date: ${now.toLocaleDateString()}`);
    console.log(`Time of Day: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`);
    console.log("");
    console.log(`🌟 ${greeting} 🌟`);
    console.log("");
    console.log("Have a wonderful day!");
    console.log("=".repeat(40));
}

// Add some emoji based on time of day
function getTimeEmoji(timeOfDay) {
    const emojis = {
        morning: "🌅",
        afternoon: "☀️",
        evening: "🌆",
        night: "🌙"
    };
    return emojis[timeOfDay] || "⭐";
}

function displayEnhancedGreeting() {
    const { greeting, timeOfDay, currentHour } = getGreetingOfDay();
    const now = new Date();
    const emoji = getTimeEmoji(timeOfDay);
    
    console.log("\n" + "=".repeat(50));
    console.log(`${emoji}  GREETING OF THE DAY PROGRAM  ${emoji}`);
    console.log("=".repeat(50));
    console.log(`📅 Date: ${now.toLocaleDateString()}`);
    console.log(`🕐 Time: ${now.toLocaleTimeString()}`);
    console.log(`⏰ Hour: ${currentHour}:00`);
    console.log("");
    console.log(`${emoji} ${greeting} ${emoji}`);
    console.log("");
    
    // Add personalized message based on time
    let personalMessage;
    switch(timeOfDay) {
        case 'morning':
            personalMessage = "Start your day with energy and positivity!";
            break;
        case 'afternoon':
            personalMessage = "Hope you're having a productive day!";
            break;
        case 'evening':
            personalMessage = "Time to relax and unwind!";
            break;
        case 'night':
            personalMessage = "Sweet dreams and rest well!";
            break;
    }
    
    console.log(`💭 ${personalMessage}`);
    console.log("=".repeat(50));
}

// Main execution
if (require.main === module) {
    console.log("Running Greeting of the Day Program...\n");
    
    // Display basic greeting
    displayGreeting();
    
    // Wait a moment and display enhanced greeting
    setTimeout(() => {
        displayEnhancedGreeting();
    }, 1000);
}

// Export functions for potential use in other modules
module.exports = {
    getGreetingOfDay,
    displayGreeting,
    displayEnhancedGreeting,
    getTimeEmoji
};
