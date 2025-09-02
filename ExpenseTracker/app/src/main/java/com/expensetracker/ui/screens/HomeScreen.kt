package com.expensetracker.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.expensetracker.data.model.Expense
import com.expensetracker.ui.viewmodel.ExpenseViewModel
import com.expensetracker.ui.viewmodel.BudgetViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HomeScreen(
    userId: Long,
    onAddExpenseClick: () -> Unit = {},
    onViewAllExpensesClick: () -> Unit = {},
    onSetBudgetClick: () -> Unit = {}
) {
    val expenseViewModel: ExpenseViewModel = hiltViewModel()
    val budgetViewModel: BudgetViewModel = hiltViewModel()

    // Set user ID for view models
    LaunchedEffect(userId) {
        expenseViewModel.setUserId(userId)
        budgetViewModel.setUserId(userId)
    }

    val expenses by expenseViewModel.expenses.collectAsState()
    val isLoading by expenseViewModel.isLoading.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Text(
            text = "Expense Tracker",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedButton(
                onClick = onAddExpenseClick,
                modifier = Modifier.weight(1f)
            ) {
                Text("Add Expense")
            }

            OutlinedButton(
                onClick = onSetBudgetClick,
                modifier = Modifier.weight(1f)
            ) {
                Text("Set Budget")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Today's Summary
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Today's Summary",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                val todayExpenses = expenses.filter { expense ->
                    val today = Calendar.getInstance()
                    val expenseDate = Calendar.getInstance().apply { time = expense.date }
                    today.get(Calendar.YEAR) == expenseDate.get(Calendar.YEAR) &&
                    today.get(Calendar.DAY_OF_YEAR) == expenseDate.get(Calendar.DAY_OF_YEAR)
                }

                val totalToday = todayExpenses.sumOf { it.amount }

                Text(
                    text = "Spent Today: ₹${String.format("%.2f", totalToday)}",
                    style = MaterialTheme.typography.bodyLarge
                )

                Text(
                    text = "Transactions: ${todayExpenses.size}",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Expenses
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Recent Expenses",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            TextButton(onClick = onViewAllExpensesClick) {
                Text("View All")
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (expenses.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No expenses yet. Add your first expense!",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        } else {
            LazyColumn {
                items(expenses.take(5)) { expense ->
                    ExpenseItem(expense = expense)
                }
            }
        }
    }
}

@Composable
fun ExpenseItem(expense: Expense) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = expense.description,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )

                Text(
                    text = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault()).format(expense.date),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text(
                    text = expense.paymentMethod,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Text(
                text = "₹${String.format("%.2f", expense.amount)}",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}
