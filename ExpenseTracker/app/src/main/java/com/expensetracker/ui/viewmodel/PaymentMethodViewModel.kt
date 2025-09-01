package com.expensetracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensetracker.data.model.PaymentMethod
import com.expensetracker.data.repository.PaymentMethodRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PaymentMethodViewModel @Inject constructor(
    private val paymentMethodRepository: PaymentMethodRepository
) : ViewModel() {

    private val _paymentMethods = MutableStateFlow<List<PaymentMethod>>(emptyList())
    val paymentMethods: StateFlow<List<PaymentMethod>> = _paymentMethods

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private var currentUserId: Long = 1L // Default user ID

    fun setUserId(userId: Long) {
        currentUserId = userId
        loadPaymentMethods()
    }

    private fun loadPaymentMethods() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                paymentMethodRepository.getAllPaymentMethods(currentUserId)
                    .collect { paymentMethodList ->
                        _paymentMethods.value = paymentMethodList
                        _isLoading.value = false
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load payment methods"
                _isLoading.value = false
            }
        }
    }

    fun addPaymentMethod(name: String) {
        viewModelScope.launch {
            try {
                val paymentMethod = PaymentMethod(
                    userId = currentUserId,
                    name = name,
                    isDefault = false
                )
                paymentMethodRepository.insertPaymentMethod(paymentMethod)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to add payment method"
            }
        }
    }

    fun updatePaymentMethod(paymentMethod: PaymentMethod) {
        viewModelScope.launch {
            try {
                paymentMethodRepository.updatePaymentMethod(paymentMethod)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to update payment method"
            }
        }
    }

    fun deletePaymentMethod(paymentMethod: PaymentMethod) {
        viewModelScope.launch {
            try {
                paymentMethodRepository.deletePaymentMethod(paymentMethod)
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to delete payment method"
            }
        }
    }

    suspend fun getPaymentMethodById(paymentMethodId: Long): PaymentMethod? {
        return paymentMethodRepository.getPaymentMethodById(paymentMethodId)
    }

    suspend fun getDefaultPaymentMethod(): PaymentMethod? {
        return paymentMethodRepository.getDefaultPaymentMethod(currentUserId)
    }

    fun getPaymentMethodCount(): Flow<Int> {
        return paymentMethodRepository.getPaymentMethodCount(currentUserId)
    }

    fun clearError() {
        _error.value = null
    }
}
