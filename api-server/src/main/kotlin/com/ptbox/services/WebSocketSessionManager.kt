package com.ptbox.services

import io.ktor.websocket.*
import java.util.*
import java.util.concurrent.ConcurrentHashMap

class WebSocketSessionManager {
    private val sessions = Collections.newSetFromMap<DefaultWebSocketSession?>(ConcurrentHashMap())

    fun addSession(session: DefaultWebSocketSession) {
        sessions += session
    }

    fun removeSession(session: DefaultWebSocketSession) {
        sessions -= session
    }

    suspend fun broadcast(message: String) {
        val iterator = sessions.iterator()
        while (iterator.hasNext()) {
            val session = iterator.next()
            try {
                session?.send(Frame.Text(message))
            } catch (e: Exception) {
                iterator.remove()
                println("Session removed due to error: ${e.localizedMessage}")
            }
        }
    }
}