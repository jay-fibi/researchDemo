#include <stdio.h>
#include <time.h>

int main() {
    time_t current_time;
    struct tm *local_time;

    // Get current time
    current_time = time(NULL);
    local_time = localtime(&current_time);

    int hour = local_time->tm_hour;

    // Determine greeting based on hour
    if (hour >= 5 && hour < 12) {
        printf("Good morning!\n");
    } else if (hour >= 12 && hour < 17) {
        printf("Good afternoon!\n");
    } else if (hour >= 17 && hour < 21) {
        printf("Good evening!\n");
    } else {
        printf("Good night!\n");
    }

    return 0;
}
