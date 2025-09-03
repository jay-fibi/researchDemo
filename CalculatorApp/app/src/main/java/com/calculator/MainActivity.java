package com.calculator;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private TextView display;
    private String currentInput = "";
    private String operator = "";
    private double firstNumber = 0;
    private boolean isNewOperation = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        display = findViewById(R.id.display);

        // Number buttons
        setupNumberButton(R.id.button_0, "0");
        setupNumberButton(R.id.button_1, "1");
        setupNumberButton(R.id.button_2, "2");
        setupNumberButton(R.id.button_3, "3");
        setupNumberButton(R.id.button_4, "4");
        setupNumberButton(R.id.button_5, "5");
        setupNumberButton(R.id.button_6, "6");
        setupNumberButton(R.id.button_7, "7");
        setupNumberButton(R.id.button_8, "8");
        setupNumberButton(R.id.button_9, "9");

        // Operation buttons
        setupOperationButton(R.id.button_add, "+");
        setupOperationButton(R.id.button_subtract, "-");
        setupOperationButton(R.id.button_multiply, "*");
        setupOperationButton(R.id.button_divide, "/");

        // Special buttons
        setupButton(R.id.button_clear, "C");
        setupButton(R.id.button_equals, "=");
        setupButton(R.id.button_decimal, ".");
        setupButton(R.id.button_backspace, "⌫");
    }

    private void setupNumberButton(int buttonId, String number) {
        Button button = findViewById(buttonId);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isNewOperation) {
                    currentInput = number;
                    isNewOperation = false;
                } else {
                    currentInput += number;
                }
                display.setText(currentInput);
            }
        });
    }

    private void setupOperationButton(int buttonId, String op) {
        Button button = findViewById(buttonId);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!currentInput.isEmpty()) {
                    firstNumber = Double.parseDouble(currentInput);
                    operator = op;
                    isNewOperation = true;
                }
            }
        });
    }

    private void setupButton(int buttonId, String action) {
        Button button = findViewById(buttonId);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (action) {
                    case "C":
                        currentInput = "";
                        operator = "";
                        firstNumber = 0;
                        isNewOperation = true;
                        display.setText("0");
                        break;
                    case "=":
                        if (!operator.isEmpty() && !currentInput.isEmpty()) {
                            double secondNumber = Double.parseDouble(currentInput);
                            double result = calculate(firstNumber, secondNumber, operator);
                            display.setText(String.valueOf(result));
                            currentInput = String.valueOf(result);
                            operator = "";
                            isNewOperation = true;
                        }
                        break;
                    case ".":
                        if (isNewOperation) {
                            currentInput = "0.";
                            isNewOperation = false;
                        } else if (!currentInput.contains(".")) {
                            currentInput += ".";
                        }
                        display.setText(currentInput);
                        break;
                    case "⌫":
                        if (!currentInput.isEmpty()) {
                            currentInput = currentInput.substring(0, currentInput.length() - 1);
                            if (currentInput.isEmpty()) {
                                display.setText("0");
                                isNewOperation = true;
                            } else {
                                display.setText(currentInput);
                            }
                        }
                        break;
                }
            }
        });
    }

    private double calculate(double first, double second, String op) {
        switch (op) {
            case "+":
                return first + second;
            case "-":
                return first - second;
            case "*":
                return first * second;
            case "/":
                if (second != 0) {
                    return first / second;
                } else {
                    return 0; // Handle division by zero
                }
            default:
                return 0;
        }
    }
}
