#include <stdio.h>
#include <stdlib.h>

int main() {
    const int size = 100000000; // 100 million integers, about 400MB
    int *array = (int *)malloc(size * sizeof(int));
    if (array == NULL) {
        printf("Memory allocation failed\n");
        return 1;
    }
    // Fill the array to ensure memory is used
    for (int i = 0; i < size; i++) {
        array[i] = i;
    }
    printf("Allocated and filled array of %d integers\n", size);
    // Keep it allocated for a while
    getchar(); // Wait for user input to exit
    free(array);
    return 0;
}
