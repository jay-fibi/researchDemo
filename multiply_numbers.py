def number_to_words(n):
    if n == 0:
        return "zero"

    ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    thousands = ["", "thousand", "million", "billion"]

    def helper(num):
        if num == 0:
            return ""
        elif num < 10:
            return ones[num]
        elif num < 20:
            return teens[num - 10]
        elif num < 100:
            return tens[num // 10] + ("" if num % 10 == 0 else " " + ones[num % 10])
        else:
            return ones[num // 100] + " hundred" + ("" if num % 100 == 0 else " " + helper(num % 100))

    if n < 0:
        return "negative " + number_to_words(-n)

    result = ""
    for i, word in enumerate(thousands):
        if n % 1000 != 0:
            result = helper(n % 1000) + " " + word + " " + result
        n //= 1000
        if n == 0:
            break

    return result.strip()

# Multiply the numbers
numbers = [2, 3, 4, 5]
product = 1
for num in numbers:
    product *= num

# Show the value in words
print(f"The product of {', '.join(map(str, numbers))} is {number_to_words(product)}")
