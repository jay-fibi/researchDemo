def add_two_numbers(a, b):
    """Function to add two numbers."""
    return a + b

# Main program
if __name__ == "__main__":
    try:
        num1 = float(input("Enter the first number: "))
        num2 = float(input("Enter the second number: "))
        result = add_two_numbers(num1, num2)
        print(f"The sum of {num1} and {num2} is {result}")
    except ValueError:
        print("Please enter valid numbers.")
