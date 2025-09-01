package com.expensetracker.data.database.dao

import androidx.room.*
import com.expensetracker.data.model.Budget
import kotlinx.coroutines.flow.Flow
import java.util.Date

@Dao
interface BudgetDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBudget(budget: Budget): Long

    @Update
    suspend fun updateBudget(budget: Budget)

    @Delete
    suspend fun deleteBudget(budget: Budget)

    @Query("SELECT * FROM budgets WHERE budgetId = :budgetId")
    suspend fun getBudgetById(budgetId: Long): Budget?

    @Query("SELECT * FROM budgets WHERE userId = :userId ORDER BY createdAt DESC")
    fun getAllBudgets(userId: Long): Flow<List<Budget>>

    @Query("SELECT * FROM budgets WHERE userId = :userId AND period = :period ORDER BY createdAt DESC")
    fun getBudgetsByPeriod(userId: Long, period: String): Flow<List<Budget>>

    @Query("SELECT * FROM budgets WHERE userId = :userId AND period = :period AND isRecurring = 1 ORDER BY createdAt DESC LIMIT 1")
    suspend fun getCurrentRecurringBudget(userId: Long, period: String): Budget?

    @Query("SELECT * FROM budgets WHERE userId = :userId AND period = :period AND startDate <= :date AND (endDate IS NULL OR endDate >= :date) ORDER BY createdAt DESC LIMIT 1")
    suspend fun getActiveBudgetForDate(userId: Long, period: String, date: Date): Budget?

    @Query("SELECT SUM(amount) FROM budgets WHERE userId = :userId AND period = :period AND isRecurring = 1")
    fun getTotalRecurringBudget(userId: Long, period: String): Flow<Double?>
}
