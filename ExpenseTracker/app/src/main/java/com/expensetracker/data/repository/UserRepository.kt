package com.expensetracker.data.repository

import com.expensetracker.data.database.dao.UserDao
import com.expensetracker.data.model.User
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserRepository @Inject constructor(
    private val userDao: UserDao
) {
    suspend fun insertUser(user: User): Long {
        return userDao.insertUser(user)
    }

    suspend fun updateUser(user: User) {
        userDao.updateUser(user)
    }

    suspend fun deleteUser(user: User) {
        userDao.deleteUser(user)
    }

    suspend fun getUserById(userId: Long): User? {
        return userDao.getUserById(userId)
    }

    fun getAllUsers(): Flow<List<User>> {
        return userDao.getAllUsers()
    }

    suspend fun getUserByEmail(email: String): User? {
        return userDao.getUserByEmail(email)
    }

    fun getUserCount(): Flow<Int> {
        return userDao.getUserCount()
    }

    suspend fun createDefaultUser(): Long {
        val defaultUser = User(
            name = "Default User",
            email = null
        )
        return userDao.insertUser(defaultUser)
    }
}
