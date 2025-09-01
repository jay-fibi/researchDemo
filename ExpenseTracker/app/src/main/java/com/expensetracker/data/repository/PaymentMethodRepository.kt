package com.expensetracker.data.repository

import com.expensetracker.data.database.dao.PaymentMethodDao
import com.expensetracker.data.model.PaymentMethod
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PaymentMethodRepository @Inject constructor(
    private val paymentMethodDao: PaymentMethodDao
) {
    suspend fun insertPaymentMethod(paymentMethod: PaymentMethod): Long {
        return paymentMethodDao.insertPaymentMethod(paymentMethod)
    }

    suspend fun updatePaymentMethod(paymentMethod: PaymentMethod) {
        paymentMethodDao.updatePaymentMethod(paymentMethod)
    }

    suspend fun deletePaymentMethod(paymentMethod: PaymentMethod) {
        paymentMethodDao.deletePaymentMethod(paymentMethod)
    }

    suspend fun getPaymentMethodById(paymentMethodId: Long): PaymentMethod? {
        return paymentMethodDao.getPaymentMethodById(paymentMethodId)
    }

    fun getAllPaymentMethods(userId: Long): Flow<List<PaymentMethod>> {
        return paymentMethodDao.getAllPaymentMethods(userId)
    }

    suspend fun getDefaultPaymentMethod(userId: Long): PaymentMethod? {
        return paymentMethodDao.getDefaultPaymentMethod(userId)
    }

    suspend fun getPaymentMethodByName(userId: Long, name: String): PaymentMethod? {
        return paymentMethodDao.getPaymentMethodByName(userId, name)
    }

    fun getPaymentMethodCount(userId: Long): Flow<Int> {
        return paymentMethodDao.getPaymentMethodCount(userId)
    }

    suspend fun initializeDefaultPaymentMethods(userId: Long) {
        val defaultPaymentMethods = listOf(
            PaymentMethod(userId = userId, name = "Cash", isDefault = true),
            PaymentMethod(userId = userId, name = "Card", isDefault = false),
            PaymentMethod(userId = userId, name = "Online", isDefault = false)
        )

        for (paymentMethod in defaultPaymentMethods) {
            // Check if payment method already exists
            val existingPaymentMethod = paymentMethodDao.getPaymentMethodByName(userId, paymentMethod.name)
            if (existingPaymentMethod == null) {
                paymentMethodDao.insertPaymentMethod(paymentMethod)
            }
        }
    }
}
