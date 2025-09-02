package com.expensetracker.data.repository

import com.expensetracker.data.database.dao.ExpenseDao
import com.expensetracker.data.model.Expense
import kotlinx.coroutines.flow.Flow
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExpenseRepository @Inject constructor(
    private val expenseDao: ExpenseDao
) {
    suspend fun insertExpense(expense: Expense): Long {
        return expenseDao.insertExpense(expense)
    }

    suspend fun updateExpense(expense: Expense) {
        expenseDao.updateExpense(expense)
    }

    suspend fun deleteExpense(expense: Expense) {
        expenseDao.deleteExpense(expense)
    }

    suspend fun getExpenseById(expenseId: Long): Expense? {
        return expenseDao.getExpenseById(expenseId)
    }

    fun getAllExpenses(userId: Long): Flow<List<Expense>> {
        return expenseDao.getAllExpenses(userId)
    }

    fun getExpensesByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<List<Expense>> {
        return expenseDao.getExpensesByDateRange(userId, startDate, endDate)
    }

    fun getExpensesByCategory(userId: Long, categoryId: Long): Flow<List<Expense>> {
        return expenseDao.getExpensesByCategory(userId, categoryId)
    }

    fun getTotalExpensesByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<Double?> {
        return expenseDao.getTotalExpensesByDateRange(userId, startDate, endDate)
    }

    fun getTotalExpensesByCategoryAndDateRange(
        userId: Long,
        categoryId: Long,
        startDate: Date,
        endDate: Date
    ): Flow<Double?> {
        return expenseDao.getTotalExpensesByCategoryAndDateRange(userId, categoryId, startDate, endDate)
    }

    fun getExpenseCountByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<Int> {
        return expenseDao.getExpenseCountByDateRange(userId, startDate, endDate)
    }

    fun getRecentExpenses(userId: Long, limit: Int = 10): Flow<List<Expense>> {
        return expenseDao.getRecentExpenses(userId, limit)
    }

    fun getExpensesForDate(userId: Long, startDate: Date, endDate: Date): Flow<List<Expense>> {
        return expenseDao.getExpensesForDate(userId, startDate, endDate)
    }
}
