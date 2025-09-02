package com.expensetracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensetracker.data.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val categoryRepository: CategoryRepository,
    private val paymentMethodRepository: PaymentMethodRepository
) : ViewModel() {

    private val _currentUserId = MutableStateFlow<Long?>(null)
    val currentUserId: StateFlow<Long?> = _currentUserId

    private val _isInitialized = MutableStateFlow(false)
    val isInitialized: StateFlow<Boolean> = _isInitialized

    init {
        initializeApp()
    }

    private fun initializeApp() {
        viewModelScope.launch {
            try {
                // Check if there's already a user
                val userCount = userRepository.getUserCount().first()
                val userId = if (userCount > 0) {
                    // Get the first user (for simplicity, assuming single user app)
                    val users = userRepository.getAllUsers().first()
                    users.firstOrNull()?.userId
                } else {
                    // Create default user
                    userRepository.createDefaultUser()
                }

                userId?.let { id ->
                    _currentUserId.value = id

                    // Initialize default categories if not already done
                    categoryRepository.initializeDefaultCategories()

                    // Initialize default payment methods
                    paymentMethodRepository.initializeDefaultPaymentMethods(id)
                }

                _isInitialized.value = true
            } catch (e: Exception) {
                // Handle initialization error
                _isInitialized.value = true // Still mark as initialized to avoid infinite loading
            }
        }
    }

    fun getCurrentUserId(): Long? {
        return _currentUserId.value
    }
}
