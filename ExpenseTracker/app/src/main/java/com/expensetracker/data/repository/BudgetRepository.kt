package com.expensetracker.data.repository

import com.expensetracker.data.database.dao.BudgetDao
import com.expensetracker.data.model.Budget
import kotlinx.coroutines.flow.Flow
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BudgetRepository @Inject constructor(
    private val budgetDao: BudgetDao
) {
    suspend fun insertBudget(budget: Budget): Long {
        return budgetDao.insertBudget(budget)
    }

    suspend fun updateBudget(budget: Budget) {
        budgetDao.updateBudget(budget)
    }

    suspend fun deleteBudget(budget: Budget) {
        budgetDao.deleteBudget(budget)
    }

    suspend fun getBudgetById(budgetId: Long): Budget? {
        return budgetDao.getBudgetById(budgetId)
    }

    fun getAllBudgets(userId: Long): Flow<List<Budget>> {
        return budgetDao.getAllBudgets(userId)
    }

    fun getBudgetsByPeriod(userId: Long, period: String): Flow<List<Budget>> {
        return budgetDao.getBudgetsByPeriod(userId, period)
    }

    suspend fun getCurrentRecurringBudget(userId: Long, period: String): Budget? {
        return budgetDao.getCurrentRecurringBudget(userId, period)
    }

    suspend fun getActiveBudgetForDate(userId: Long, period: String, date: Date): Budget? {
        return budgetDao.getActiveBudgetForDate(userId, period, date)
    }

    fun getTotalRecurringBudget(userId: Long, period: String): Flow<Double?> {
        return budgetDao.getTotalRecurringBudget(userId, period)
    }
}
