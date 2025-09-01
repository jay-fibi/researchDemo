package com.expensetracker.data.database.dao

import androidx.room.*
import com.expensetracker.data.model.Category
import kotlinx.coroutines.flow.Flow

@Dao
interface CategoryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategory(category: Category): Long

    @Update
    suspend fun updateCategory(category: Category)

    @Delete
    suspend fun deleteCategory(category: Category)

    @Query("SELECT * FROM categories WHERE categoryId = :categoryId")
    suspend fun getCategoryById(categoryId: Long): Category?

    @Query("SELECT * FROM categories WHERE userId = :userId OR userId IS NULL ORDER BY name ASC")
    fun getAllCategories(userId: Long): Flow<List<Category>>

    @Query("SELECT * FROM categories WHERE userId = :userId ORDER BY name ASC")
    fun getUserCategories(userId: Long): Flow<List<Category>>

    @Query("SELECT * FROM categories WHERE userId IS NULL ORDER BY name ASC")
    fun getDefaultCategories(): Flow<List<Category>>

    @Query("SELECT * FROM categories WHERE name = :name AND (userId = :userId OR userId IS NULL)")
    suspend fun getCategoryByName(name: String, userId: Long): Category?

    @Query("SELECT COUNT(*) FROM categories WHERE userId = :userId OR userId IS NULL")
    fun getCategoryCount(userId: Long): Flow<Int>
}
