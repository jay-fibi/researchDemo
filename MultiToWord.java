public class MultiToWord {
    private static final String[] ones = {"", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"};
    private static final String[] teens = {"ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"};
    private static final String[] tens = {"", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"};
    private static final String[] thousands = {"", "thousand", "million", "billion"};

    public static String numberToWords(int n) {
        if (n == 0) {
            return "zero";
        }
        if (n < 0) {
            return "negative " + numberToWords(-n);
        }
        String result = "";
        int i = 0;
        while (n > 0) {
            if (n % 1000 != 0) {
                result = helper(n % 1000) + thousands[i] + (i > 0 ? " " : "") + result;
            }
            n /= 1000;
            i++;
        }
        return result.trim();
    }

    private static String helper(int num) {
        if (num == 0) {
            return "";
        } else if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else if (num < 100) {
            return tens[num / 10] + (num % 10 == 0 ? "" : " " + ones[num % 10]);
        } else {
            return ones[num / 100] + " hundred" + (num % 100 == 0 ? "" : " " + helper(num % 100));
        }
    }

    public static void main(String[] args) {
        int[] numbers = {2, 3, 4, 5};
        long product = 1;
        for (int num : numbers) {
            product *= num;
        }
        System.out.println("The product of 2, 3, 4, 5 is " + numberToWords((int) product));
    }
}
