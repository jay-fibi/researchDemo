package com.expensetracker.data.database.dao

import androidx.room.*
import com.expensetracker.data.model.Expense
import kotlinx.coroutines.flow.Flow
import java.util.Date

@Dao
interface ExpenseDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExpense(expense: Expense): Long

    @Update
    suspend fun updateExpense(expense: Expense)

    @Delete
    suspend fun deleteExpense(expense: Expense)

    @Query("SELECT * FROM expenses WHERE expenseId = :expenseId")
    suspend fun getExpenseById(expenseId: Long): Expense?

    @Query("SELECT * FROM expenses WHERE userId = :userId ORDER BY date DESC")
    fun getAllExpenses(userId: Long): Flow<List<Expense>>

    @Query("SELECT * FROM expenses WHERE userId = :userId AND date >= :startDate AND date <= :endDate ORDER BY date DESC")
    fun getExpensesByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<List<Expense>>

    @Query("SELECT * FROM expenses WHERE userId = :userId AND categoryId = :categoryId ORDER BY date DESC")
    fun getExpensesByCategory(userId: Long, categoryId: Long): Flow<List<Expense>>

    @Query("SELECT SUM(amount) FROM expenses WHERE userId = :userId AND date >= :startDate AND date <= :endDate")
    fun getTotalExpensesByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<Double?>

    @Query("SELECT SUM(amount) FROM expenses WHERE userId = :userId AND categoryId = :categoryId AND date >= :startDate AND date <= :endDate")
    fun getTotalExpensesByCategoryAndDateRange(userId: Long, categoryId: Long, startDate: Date, endDate: Date): Flow<Double?>

    @Query("SELECT COUNT(*) FROM expenses WHERE userId = :userId AND date >= :startDate AND date <= :endDate")
    fun getExpenseCountByDateRange(userId: Long, startDate: Date, endDate: Date): Flow<Int>

    @Query("SELECT * FROM expenses WHERE userId = :userId ORDER BY date DESC LIMIT :limit")
    fun getRecentExpenses(userId: Long, limit: Int = 10): Flow<List<Expense>>

    @Query("SELECT * FROM expenses WHERE userId = :userId AND date >= :startDate AND date < :endDate ORDER BY date DESC")
    fun getExpensesForDate(userId: Long, startDate: Date, endDate: Date): Flow<List<Expense>>
}
