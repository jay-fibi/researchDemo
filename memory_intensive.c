#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include <limits.h>

#define DEFAULT_SIZE 100000000UL  // 100 million integers
#define BYTES_PER_MB 1048576UL     // 1024 * 1024

// Function to safely calculate memory size with overflow checking
size_t calculate_memory_size(size_t count, size_t element_size) {
    if (count == 0 || element_size == 0) {
        return 0;
    }

    if (element_size > SIZE_MAX / count) {
        fprintf(stderr, "Error: Memory size calculation would overflow\n");
        return 0;
    }

    return count * element_size;
}

// Function to get memory usage in MB
double get_memory_usage_mb(size_t bytes) {
    return (double)bytes / BYTES_PER_MB;
}

int main(int argc, char *argv[]) {
    size_t size = DEFAULT_SIZE;

    // Parse command-line arguments for custom size
    if (argc > 1) {
        char *endptr;
        long long parsed_size = strtoll(argv[1], &endptr, 10);

        if (*endptr != '\0' || parsed_size <= 0 || parsed_size > SIZE_MAX) {
            fprintf(stderr, "Error: Invalid size argument. Must be a positive integer.\n");
            fprintf(stderr, "Usage: %s [size]\n", argv[0]);
            return 1;
        }

        size = (size_t)parsed_size;
    }

    printf("Attempting to allocate memory for %zu integers (%zu bytes, ~%.2f MB)\n",
           size, size * sizeof(int), get_memory_usage_mb(size * sizeof(int)));

    // Calculate memory size with overflow checking
    size_t total_bytes = calculate_memory_size(size, sizeof(int));
    if (total_bytes == 0) {
        return 1;
    }

    // Start timing
    clock_t start_time = clock();

    // Use calloc for zero-initialized memory (better for large allocations)
    int *array = (int *)calloc(size, sizeof(int));
    if (array == NULL) {
        fprintf(stderr, "Memory allocation failed for %zu bytes\n", total_bytes);
        return 1;
    }

    clock_t alloc_time = clock();
    double alloc_duration = (double)(alloc_time - start_time) / CLOCKS_PER_SEC;

    printf("Memory allocated successfully in %.3f seconds\n", alloc_duration);

    // Fill the array with values (demonstrate memory usage)
    printf("Filling array with values...\n");
    for (size_t i = 0; i < size; i++) {
        array[i] = (int)i;
    }

    clock_t fill_time = clock();
    double fill_duration = (double)(fill_time - alloc_time) / CLOCKS_PER_SEC;

    printf("Array filled in %.3f seconds\n", fill_duration);
    printf("Total setup time: %.3f seconds\n", alloc_duration + fill_duration);

    // Display memory usage information
    printf("\nMemory Statistics:\n");
    printf("- Array size: %zu elements\n", size);
    printf("- Memory used: %zu bytes (%.2f MB)\n", total_bytes, get_memory_usage_mb(total_bytes));
    printf("- Element size: %zu bytes\n", sizeof(int));

    // Keep it allocated for observation
    printf("\nPress Enter to free memory and exit...");
    fflush(stdout);

    // Clear input buffer and wait for user input
    int c;
    while ((c = getchar()) != '\n' && c != EOF);

    // Free memory
    free(array);
    array = NULL;

    clock_t end_time = clock();
    double total_duration = (double)(end_time - start_time) / CLOCKS_PER_SEC;

    printf("Memory freed. Total execution time: %.3f seconds\n", total_duration);

    return 0;
}
