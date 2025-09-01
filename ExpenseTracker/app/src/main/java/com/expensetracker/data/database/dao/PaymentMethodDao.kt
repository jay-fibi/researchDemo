package com.expensetracker.data.database.dao

import androidx.room.*
import com.expensetracker.data.model.PaymentMethod
import kotlinx.coroutines.flow.Flow

@Dao
interface PaymentMethodDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPaymentMethod(paymentMethod: PaymentMethod): Long

    @Update
    suspend fun updatePaymentMethod(paymentMethod: PaymentMethod)

    @Delete
    suspend fun deletePaymentMethod(paymentMethod: PaymentMethod)

    @Query("SELECT * FROM payment_methods WHERE paymentMethodId = :paymentMethodId")
    suspend fun getPaymentMethodById(paymentMethodId: Long): PaymentMethod?

    @Query("SELECT * FROM payment_methods WHERE userId = :userId ORDER BY name ASC")
    fun getAllPaymentMethods(userId: Long): Flow<List<PaymentMethod>>

    @Query("SELECT * FROM payment_methods WHERE userId = :userId AND isDefault = 1 LIMIT 1")
    suspend fun getDefaultPaymentMethod(userId: Long): PaymentMethod?

    @Query("SELECT * FROM payment_methods WHERE userId = :userId AND name = :name")
    suspend fun getPaymentMethodByName(userId: Long, name: String): PaymentMethod?

    @Query("SELECT COUNT(*) FROM payment_methods WHERE userId = :userId")
    fun getPaymentMethodCount(userId: Long): Flow<Int>
}
