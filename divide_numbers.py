#!/usr/bin/env python3

def divide_numbers(num1, num2):
    """
    Divide two numbers and return the result.

    Args:
        num1 (float): The dividend
        num2 (float): The divisor

    Returns:
        float: The quotient of num1 divided by num2

    Raises:
        ValueError: If num2 is zero
    """
    if num2 == 0:
        raise ValueError("Cannot divide by zero")
    return num1 / num2

if __name__ == "__main__":
    try:
        # Get user input
        num1 = float(input("Enter the first number: "))
        num2 = float(input("Enter the second number: "))

        # Perform division
        result = divide_numbers(num1, num2)

        # Display result
        print(f"{num1} divided by {num2} is: {result}")

    except ValueError as e:
        print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
