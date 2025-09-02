package com.expensetracker.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey(autoGenerate = true)
    val categoryId: Long = 0,
    val userId: Long? = null, // null for default categories
    val name: String,
    val color: String, // Hex color code
    val icon: String, // Icon identifier
    val isDefault: Boolean = false,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)
