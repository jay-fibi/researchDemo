# Program to multiply three numbers

def multiply_three_numbers(a, b, c):
    """
    Function to multiply three numbers.
    """
    # Calculate and return the product of the three numbers
    return a * b * c

# Main program
if __name__ == "__main__":
    # Prompt user to enter three numbers
    print("Enter three numbers to multiply:")

    try:
        # Get first number from user input
        num1 = float(input("First number: "))
        # Get second number from user input
        num2 = float(input("Second number: "))
        # Get third number from user input
        num3 = float(input("Third number: "))

        # Call the function to multiply the numbers
        result = multiply_three_numbers(num1, num2, num3)
        # Print the result
        print(f"The product of {num1}, {num2}, and {num3} is {result}")
    except ValueError:
        # Handle invalid input
        print("Please enter valid numbers.")
