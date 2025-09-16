#!/bin/bash

# Improved Calculator Shell Script with floating point support and input validation

calculate() {
    local op=$1
    local num1=$2
    local num2=$3

    case $op in
        1) echo "scale=2; $num1 + $num2" | bc ;;
        2) echo "scale=2; $num1 - $num2" | bc ;;
        3) echo "scale=2; $num1 * $num2" | bc ;;
        4) if [ $(echo "$num2 == 0" | bc) -eq 1 ]; then
               echo "Error: Division by zero"
               return 1
           else
               echo "scale=2; $num1 / $num2" | bc
           fi ;;
        *) echo "Invalid operation"
           return 1 ;;
    esac
}

while true; do
    echo "Simple Calculator"
    echo "Enter first number (or 'q' to quit):"
    read num1
    if [ "$num1" == "q" ]; then
        break
    fi
    if ! [[ $num1 =~ ^-?[0-9]+(\.[0-9]+)?$ ]]; then
        echo "Invalid number. Please enter a valid number."
        continue
    fi

    echo "Enter second number:"
    read num2
    if ! [[ $num2 =~ ^-?[0-9]+(\.[0-9]+)?$ ]]; then
        echo "Invalid number. Please enter a valid number."
        continue
    fi

    echo "Select operation:"
    echo "1. Addition"
    echo "2. Subtraction"
    echo "3. Multiplication"
    echo "4. Division"
    read operation

    result=$(calculate $operation $num1 $num2)
    if [ $? -eq 0 ]; then
        echo "Result: $result"
    fi
    echo ""
done

echo "Goodbye!"
