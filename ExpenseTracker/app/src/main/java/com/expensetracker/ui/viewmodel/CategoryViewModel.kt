package com.expensetracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensetracker.data.model.Category
import com.expensetracker.data.repository.CategoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CategoryViewModel @Inject constructor(
    private val categoryRepository: CategoryRepository
) : ViewModel() {

    private val _categories = MutableStateFlow<List<Category>>(emptyList())
    val categories: StateFlow<List<Category>> = _categories

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private var currentUserId: Long = 1L // Default user ID

    fun setUserId(userId: Long) {
        currentUserId = userId
        loadCategories()
    }

    private fun loadCategories() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                categoryRepository.getAllCategories(currentUserId)
                    .collect { categoryList ->
                        _categories.value = categoryList
                        _isLoading.value = false
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load categories"
                _isLoading.value = false
            }
        }
    }

    fun addCategory(
        name: String,
        color: String,
        icon: String
    ) {
        viewModelScope.launch {
            try {
                val category = Category(
                    userId = currentUserId,
                    name = name,
                    color = color,
                    icon = icon,
                    isDefault = false
                )
                categoryRepository.insertCategory(category)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to add category"
            }
        }
    }

    fun updateCategory(category: Category) {
        viewModelScope.launch {
            try {
                categoryRepository.updateCategory(category)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to update category"
            }
        }
    }

    fun deleteCategory(category: Category) {
        viewModelScope.launch {
            try {
                categoryRepository.deleteCategory(category)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to delete category"
            }
        }
    }

    suspend fun getCategoryById(categoryId: Long): Category? {
        return categoryRepository.getCategoryById(categoryId)
    }

    suspend fun getCategoryByName(name: String): Category? {
        return categoryRepository.getCategoryByName(name, currentUserId)
    }

    fun getUserCategories(): Flow<List<Category>> {
        return categoryRepository.getUserCategories(currentUserId)
    }

    fun getDefaultCategories(): Flow<List<Category>> {
        return categoryRepository.getDefaultCategories()
    }

    fun getCategoryCount(): Flow<Int> {
        return categoryRepository.getCategoryCount(currentUserId)
    }

    fun clearError() {
        _error.value = null
    }
}
