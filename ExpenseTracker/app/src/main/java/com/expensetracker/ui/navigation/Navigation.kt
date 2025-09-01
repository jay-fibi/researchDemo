package com.expensetracker.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.expensetracker.ui.screens.AddExpenseScreen
import com.expensetracker.ui.screens.HomeScreen

@Composable
fun ExpenseTrackerNavigation(userId: Long) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                userId = userId,
                onAddExpenseClick = {
                    navController.navigate("add_expense")
                },
                onViewAllExpensesClick = {
                    // TODO: Navigate to expenses list screen
                },
                onSetBudgetClick = {
                    // TODO: Navigate to budget screen
                }
            )
        }

        composable("add_expense") {
            AddExpenseScreen(
                userId = userId,
                onExpenseAdded = {
                    navController.popBackStack()
                },
                onCancel = {
                    navController.popBackStack()
                }
            )
        }
    }
}
