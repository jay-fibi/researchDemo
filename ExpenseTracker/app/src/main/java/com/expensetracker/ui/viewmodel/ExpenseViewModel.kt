package com.expensetracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensetracker.data.model.Expense
import com.expensetracker.data.repository.ExpenseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

@HiltViewModel
class ExpenseViewModel @Inject constructor(
    private val expenseRepository: ExpenseRepository
) : ViewModel() {

    private val _expenses = MutableStateFlow<List<Expense>>(emptyList())
    val expenses: StateFlow<List<Expense>> = _expenses

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private var currentUserId: Long = 1L // Default user ID

    fun setUserId(userId: Long) {
        currentUserId = userId
        loadExpenses()
    }

    private fun loadExpenses() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                expenseRepository.getAllExpenses(currentUserId)
                    .collect { expenseList ->
                        _expenses.value = expenseList
                        _isLoading.value = false
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load expenses"
                _isLoading.value = false
            }
        }
    }

    fun addExpense(
        amount: Double,
        description: String,
        categoryId: Long? = null,
        paymentMethod: String,
        date: Date = Date()
    ) {
        viewModelScope.launch {
            try {
                val expense = Expense(
                    userId = currentUserId,
                    categoryId = categoryId,
                    amount = amount,
                    date = date,
                    description = description,
                    paymentMethod = paymentMethod
                )
                expenseRepository.insertExpense(expense)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to add expense"
            }
        }
    }

    fun updateExpense(expense: Expense) {
        viewModelScope.launch {
            try {
                expenseRepository.updateExpense(expense)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to update expense"
            }
        }
    }

    fun deleteExpense(expense: Expense) {
        viewModelScope.launch {
            try {
                expenseRepository.deleteExpense(expense)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to delete expense"
            }
        }
    }

    fun getExpensesByDateRange(startDate: Date, endDate: Date): Flow<List<Expense>> {
        return expenseRepository.getExpensesByDateRange(currentUserId, startDate, endDate)
    }

    fun getTotalExpensesByDateRange(startDate: Date, endDate: Date): Flow<Double?> {
        return expenseRepository.getTotalExpensesByDateRange(currentUserId, startDate, endDate)
    }

    fun getRecentExpenses(limit: Int = 10): Flow<List<Expense>> {
        return expenseRepository.getRecentExpenses(currentUserId, limit)
    }

    fun clearError() {
        _error.value = null
    }
}
