package com.expensetracker.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.expensetracker.ui.navigation.ExpenseTrackerNavigation
import com.expensetracker.ui.theme.ExpenseTrackerTheme
import com.expensetracker.ui.viewmodel.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val mainViewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ExpenseTrackerTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val currentUserId by mainViewModel.currentUserId.collectAsState()
                    val isInitialized by mainViewModel.isInitialized.collectAsState()

                    if (isInitialized) {
                        currentUserId?.let { userId ->
                            MainScreen(userId = userId)
                        } ?: run {
                            // Handle case where user ID is null
                            LoadingScreen()
                        }
                    } else {
                        LoadingScreen()
                    }
                }
            }
        }
    }
}

@Composable
fun LoadingScreen() {
    // Simple loading screen - you can enhance this later
    androidx.compose.material3.Text("Loading...")
}

@Composable
fun MainScreen(userId: Long) {
    ExpenseTrackerNavigation(userId = userId)
}
