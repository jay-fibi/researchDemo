import java.util.Scanner;

public class SubtractNumbers {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter first number: ");
        float num1 = scanner.nextFloat();

        System.out.print("Enter second number: ");
        float num2 = scanner.nextFloat();

        float difference = num1 - num2;

        System.out.println("The difference between " + num1 + " and " + num2 + " is: " + difference);

        scanner.close();
    }
}
