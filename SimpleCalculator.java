import java.util.Scanner;

public class SimpleCalculator {

    public static double add(double a, double b) {
        return a + b;
    }

    public static double subtract(double a, double b) {
        return a - b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a / b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Simple Calculator");

        boolean continueCalculating = true;
        while (continueCalculating) {
            try {
                System.out.println("Enter first number:");
                double num1 = scanner.nextDouble();

                System.out.println("Enter second number:");
                double num2 = scanner.nextDouble();

                System.out.println("Enter operation (+, -, *, /, add, subtract, multiply, divide):");
                String operation = scanner.next().toLowerCase();

                double result = 0;

                switch (operation) {
                    case "+":
                    case "add":
                        result = add(num1, num2);
                        break;
                    case "-":
                    case "subtract":
                        result = subtract(num1, num2);
                        break;
                    case "*":
                    case "multiply":
                        result = multiply(num1, num2);
                        break;
                    case "/":
                    case "divide":
                        result = divide(num1, num2);
                        break;
                    default:
                        System.out.println("Error: Invalid operation!");
                        continue;
                }

                System.out.println("Result: " + result);

                System.out.println("Do you want to perform another calculation? (y/n)");
                String choice = scanner.next().toLowerCase();
                if (!choice.equals("y") && !choice.equals("yes")) {
                    continueCalculating = false;
                }

            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
                scanner.nextLine(); // clear input buffer
            }
        }

        scanner.close();
    }
}
