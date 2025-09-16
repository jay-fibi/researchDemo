#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    // Handle edge cases: numbers less than or equal to 1 are not prime
    if (n <= 1) return false;
    // 2 is the only even prime number
    if (n == 2) return true;
    // Eliminate even numbers greater than 2
    if (n % 2 == 0) return false;
    // Check odd divisors from 3 to sqrt(n)
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false
    }
    return true;
}

int main() {
    int num;
    printf("Enter a positive integer: ");
    scanf("%d", &num);
    if (isPrime(num)) {
        printf("%d is a prime number.\n", num);
    } else {
        printf("%d is not a prime number.\n", num);
    }
    return 0;
}
