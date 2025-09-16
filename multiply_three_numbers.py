# Program to multiply three numbers

def multiply_three_numbers(a, b, c):
    """
    Function to multiply three numbers.
    """
    return a * b * c

# Main program
if __name__ == "__main__":
    print("Enter three numbers to multiply:")

    try:
        num1 = float(input("First number: "))
        num2 = float(input("Second number: "))
        num3 = float(input("Third number: "))

        result = multiply_three_numbers(num1, num2, num3)
        print(f"The product of {num1}, {num2}, and {num3} is {result}")
    except ValueError:
        print("Please enter valid numbers.")
