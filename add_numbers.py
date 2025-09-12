# Program to add two numbers in Python with error handling

def get_number_input(prompt):
    """Get a valid number input from the user with error handling."""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Please enter a valid number. Try again.")

def main():
    print("Number Addition Program")
    print("----------------------")
    
    # Get user input with error handling
    num1 = get_number_input("Enter the first number: ")
    num2 = get_number_input("Enter the second number: ")
    
    # Calculate the sum
    sum_result = num1 + num2
    
    # Display the result
    print(f"\nThe sum of {num1} and {num2} is {sum_result}")

if __name__ == "__main__":
    main()
