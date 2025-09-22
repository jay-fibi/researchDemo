import java.util.Scanner;
import java.util.InputMismatchException;

/**
 * A simple calculator program that adds two numbers with proper error handling
 * and input validation.
 */
public class NumberAdditionCalculator {

    // Constants for user messages
    private static final String PROMPT_FIRST_NUMBER = "Enter first number: ";
    private static final String PROMPT_SECOND_NUMBER = "Enter second number: ";
    private static final String RESULT_MESSAGE = "The sum of %d and %d is: %d%n";
    private static final String ERROR_INVALID_INPUT = "Error: Please enter valid integers only.";
    private static final String ERROR_OVERFLOW = "Error: Numbers are too large to add safely.";
    private static final String ERROR_GENERAL = "An unexpected error occurred: %s%n";

    /**
     * Main method that orchestrates the number addition process.
     *
     * @param args command line arguments (not used)
     */
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int firstNumber = getValidatedNumber(scanner, PROMPT_FIRST_NUMBER);
            int secondNumber = getValidatedNumber(scanner, PROMPT_SECOND_NUMBER);

            long sum = calculateSum(firstNumber, secondNumber);
            displayResult(firstNumber, secondNumber, sum);

        } catch (Exception e) {
            System.err.printf(ERROR_GENERAL, e.getMessage());
            System.exit(1);
        }
    }

    /**
     * Prompts user for a number and validates the input.
     *
     * @param scanner the Scanner object to read input
     * @param prompt the message to display to the user
     * @return the validated integer input
     * @throws InputMismatchException if input is not a valid integer
     */
    private static int getValidatedNumber(Scanner scanner, String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                return scanner.nextInt();
            } catch (InputMismatchException e) {
                System.out.println(ERROR_INVALID_INPUT);
                scanner.nextLine(); // Clear the invalid input
            }
        }
    }

    /**
     * Calculates the sum of two numbers using long to prevent overflow.
     *
     * @param firstNumber the first number to add
     * @param secondNumber the second number to add
     * @return the sum as a long value
     */
    private static long calculateSum(int firstNumber, int secondNumber) {
        // Use long to handle potential overflow
        return (long) firstNumber + secondNumber;
    }

    /**
     * Displays the result of the addition.
     *
     * @param firstNumber the first number
     * @param secondNumber the second number
     * @param sum the calculated sum
     */
    private static void displayResult(int firstNumber, int secondNumber, long sum) {
        System.out.printf(RESULT_MESSAGE, firstNumber, secondNumber, sum);
    }
}
