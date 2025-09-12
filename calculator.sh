#!/bin/bash

# Simple Calculator Shell Script

echo "Simple Calculator"
echo "Enter first number:"
read num1
echo "Enter second number:"
read num2
echo "Select operation:"
echo "1. Addition"
echo "2. Subtraction"
echo "3. Multiplication"
echo "4. Division"
read operation

case $operation in
    1) result=$((num1 + num2));;
    2) result=$((num1 - num2));;
    3) result=$((num1 * num2));;
    4) if [ $num2 -eq 0 ]; then
           echo "Error: Division by zero"
           exit 1
       else
           result=$((num1 / num2))
       fi;;
    *) echo "Invalid operation"; exit 1;;
esac

echo "Result: $result"
