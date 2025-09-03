#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

int main() {
    int count = 0;
    int limit = 1000000; // Adjust for more CPU usage
    for (int i = 2; i <= limit; i++) {
        if (isPrime(i)) {
            count++;
        }
    }
    printf("Number of primes up to %d: %d\n", limit, count);
    return 0;
}
