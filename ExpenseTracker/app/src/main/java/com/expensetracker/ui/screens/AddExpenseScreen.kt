package com.expensetracker.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.expensetracker.ui.viewmodel.ExpenseViewModel
import com.expensetracker.ui.viewmodel.CategoryViewModel
import com.expensetracker.ui.viewmodel.PaymentMethodViewModel
import com.expensetracker.data.model.Category
import com.expensetracker.data.model.PaymentMethod
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddExpenseScreen(
    userId: Long,
    onExpenseAdded: () -> Unit = {},
    onCancel: () -> Unit = {}
) {
    val expenseViewModel: ExpenseViewModel = hiltViewModel()
    val categoryViewModel: CategoryViewModel = hiltViewModel()
    val paymentMethodViewModel: PaymentMethodViewModel = hiltViewModel()

    // Set user ID for view models
    LaunchedEffect(userId) {
        expenseViewModel.setUserId(userId)
        categoryViewModel.setUserId(userId)
        paymentMethodViewModel.setUserId(userId)
    }

    val categories by categoryViewModel.categories.collectAsState()
    val paymentMethods by paymentMethodViewModel.paymentMethods.collectAsState()

    var amount by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf<Category?>(null) }
    var selectedPaymentMethod by remember { mutableStateOf<PaymentMethod?>(null) }
    var selectedDate by remember { mutableStateOf(Date()) }
    var showDatePicker by remember { mutableStateOf(false) }
    var showCategoryDropdown by remember { mutableStateOf(false) }
    var showPaymentMethodDropdown by remember { mutableStateOf(false) }

    val isFormValid = amount.isNotBlank() && description.isNotBlank() &&
                     selectedCategory != null && selectedPaymentMethod != null

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Text(
            text = "Add Expense",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Amount Input
        OutlinedTextField(
            value = amount,
            onValueChange = { amount = it },
            label = { Text("Amount") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Description Input
        OutlinedTextField(
            value = description,
            onValueChange = { description = it },
            label = { Text("Description") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Category Selection
        ExposedDropdownMenuBox(
            expanded = showCategoryDropdown,
            onExpandedChange = { showCategoryDropdown = it }
        ) {
            OutlinedTextField(
                value = selectedCategory?.name ?: "Select Category",
                onValueChange = {},
                readOnly = true,
                label = { Text("Category") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showCategoryDropdown) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor()
            )

            ExposedDropdownMenu(
                expanded = showCategoryDropdown,
                onDismissRequest = { showCategoryDropdown = false }
            ) {
                categories.forEach { category ->
                    DropdownMenuItem(
                        text = { Text(category.name) },
                        onClick = {
                            selectedCategory = category
                            showCategoryDropdown = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Payment Method Selection
        ExposedDropdownMenuBox(
            expanded = showPaymentMethodDropdown,
            onExpandedChange = { showPaymentMethodDropdown = it }
        ) {
            OutlinedTextField(
                value = selectedPaymentMethod?.name ?: "Select Payment Method",
                onValueChange = {},
                readOnly = true,
                label = { Text("Payment Method") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showPaymentMethodDropdown) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor()
            )

            ExposedDropdownMenu(
                expanded = showPaymentMethodDropdown,
                onDismissRequest = { showPaymentMethodDropdown = false }
            ) {
                paymentMethods.forEach { paymentMethod ->
                    DropdownMenuItem(
                        text = { Text(paymentMethod.name) },
                        onClick = {
                            selectedPaymentMethod = paymentMethod
                            showPaymentMethodDropdown = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f)
            ) {
                Text("Cancel")
            }

            Button(
                onClick = {
                    if (isFormValid) {
                        val expenseAmount = amount.toDoubleOrNull() ?: 0.0
                        expenseViewModel.addExpense(
                            amount = expenseAmount,
                            description = description,
                            categoryId = selectedCategory?.categoryId,
                            paymentMethod = selectedPaymentMethod?.name ?: "",
                            date = selectedDate
                        )
                        onExpenseAdded()
                    }
                },
                enabled = isFormValid,
                modifier = Modifier.weight(1f)
            ) {
                Text("Add Expense")
            }
        }
    }
}
