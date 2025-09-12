public class DivisionCalculator {
    public static void main(String[] args) {
        // Check if two arguments are provided
        if (args.length != 2) {
            System.out.println("Usage: java DivisionCalculator <num1> <num2>");
            return;
        }
        
        try {
            // Parse the input values as floating-point numbers
            float num1 = Float.parseFloat(args[0]);
            float num2 = Float.parseFloat(args[1]);
            
            // Check for division by zero
            if (num2 == 0.0f) {
                System.out.println("Error: Division by zero is not allowed");
                return;
            }
            
            // Perform the division
            float result = num1 / num2;
            
            // Display the result
            System.out.println("The result of dividing " + num1 + " by " + num2 + " is: " + result);
        } catch (NumberFormatException e) {
            System.out.println("Error: Please provide valid floating-point numbers");
        }
    }
}
