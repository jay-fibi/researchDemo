package com.expensetracker.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import java.util.Date

@Entity(
    tableName = "budgets",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["userId"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Budget(
    @PrimaryKey(autoGenerate = true)
    val budgetId: Long = 0,
    val userId: Long,
    val amount: Double,
    val period: String, // "daily", "weekly", "monthly", "yearly"
    val startDate: Date,
    val endDate: Date? = null,
    val isRecurring: Boolean = true,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)
