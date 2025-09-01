package com.expensetracker.data.repository

import com.expensetracker.data.database.dao.CategoryDao
import com.expensetracker.data.model.Category
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CategoryRepository @Inject constructor(
    private val categoryDao: CategoryDao
) {
    suspend fun insertCategory(category: Category): Long {
        return categoryDao.insertCategory(category)
    }

    suspend fun updateCategory(category: Category) {
        categoryDao.updateCategory(category)
    }

    suspend fun deleteCategory(category: Category) {
        categoryDao.deleteCategory(category)
    }

    suspend fun getCategoryById(categoryId: Long): Category? {
        return categoryDao.getCategoryById(categoryId)
    }

    fun getAllCategories(userId: Long): Flow<List<Category>> {
        return categoryDao.getAllCategories(userId)
    }

    fun getUserCategories(userId: Long): Flow<List<Category>> {
        return categoryDao.getUserCategories(userId)
    }

    fun getDefaultCategories(): Flow<List<Category>> {
        return categoryDao.getDefaultCategories()
    }

    suspend fun getCategoryByName(name: String, userId: Long): Category? {
        return categoryDao.getCategoryByName(name, userId)
    }

    fun getCategoryCount(userId: Long): Flow<Int> {
        return categoryDao.getCategoryCount(userId)
    }

    suspend fun initializeDefaultCategories() {
        val defaultCategories = listOf(
            Category(name = "Food & Dining", color = "#FF6B6B", icon = "restaurant", isDefault = true),
            Category(name = "Transportation", color = "#4ECDC4", icon = "directions_car", isDefault = true),
            Category(name = "Entertainment", color = "#45B7D1", icon = "movie", isDefault = true),
            Category(name = "Shopping", color = "#96CEB4", icon = "shopping_cart", isDefault = true),
            Category(name = "Bills & Utilities", color = "#FFEAA7", icon = "receipt", isDefault = true),
            Category(name = "Health & Medical", color = "#DDA0DD", icon = "local_hospital", isDefault = true),
            Category(name = "Education", color = "#98D8C8", icon = "school", isDefault = true),
            Category(name = "Travel", color = "#F7DC6F", icon = "flight", isDefault = true),
            Category(name = "Other", color = "#BDC3C7", icon = "category", isDefault = true)
        )

        for (category in defaultCategories) {
            // Check if category already exists
            val existingCategory = categoryDao.getCategoryByName(category.name, 0)
            if (existingCategory == null) {
                categoryDao.insertCategory(category)
            }
        }
    }
}
