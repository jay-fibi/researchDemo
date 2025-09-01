package com.expensetracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensetracker.data.model.Budget
import com.expensetracker.data.repository.BudgetRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

@HiltViewModel
class BudgetViewModel @Inject constructor(
    private val budgetRepository: BudgetRepository
) : ViewModel() {

    private val _budgets = MutableStateFlow<List<Budget>>(emptyList())
    val budgets: StateFlow<List<Budget>> = _budgets

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private var currentUserId: Long = 1L // Default user ID

    fun setUserId(userId: Long) {
        currentUserId = userId
        loadBudgets()
    }

    private fun loadBudgets() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                budgetRepository.getAllBudgets(currentUserId)
                    .collect { budgetList ->
                        _budgets.value = budgetList
                        _isLoading.value = false
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load budgets"
                _isLoading.value = false
            }
        }
    }

    fun addBudget(
        amount: Double,
        period: String,
        startDate: Date = Date(),
        endDate: Date? = null,
        isRecurring: Boolean = true
    ) {
        viewModelScope.launch {
            try {
                val budget = Budget(
                    userId = currentUserId,
                    amount = amount,
                    period = period,
                    startDate = startDate,
                    endDate = endDate,
                    isRecurring = isRecurring
                )
                budgetRepository.insertBudget(budget)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to add budget"
            }
        }
    }

    fun updateBudget(budget: Budget) {
        viewModelScope.launch {
            try {
                budgetRepository.updateBudget(budget)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to update budget"
            }
        }
    }

    fun deleteBudget(budget: Budget) {
        viewModelScope.launch {
            try {
                budgetRepository.deleteBudget(budget)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to delete budget"
            }
        }
    }

    fun getBudgetsByPeriod(period: String): Flow<List<Budget>> {
        return budgetRepository.getBudgetsByPeriod(currentUserId, period)
    }

    suspend fun getCurrentRecurringBudget(period: String): Budget? {
        return budgetRepository.getCurrentRecurringBudget(currentUserId, period)
    }

    suspend fun getActiveBudgetForDate(period: String, date: Date): Budget? {
        return budgetRepository.getActiveBudgetForDate(currentUserId, period, date)
    }

    fun getTotalRecurringBudget(period: String): Flow<Double?> {
        return budgetRepository.getTotalRecurringBudget(currentUserId, period)
    }

    fun clearError() {
        _error.value = null
    }
}
