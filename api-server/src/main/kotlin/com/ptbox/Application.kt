package com.ptbox

import com.ptbox.database.ScanDatabase
import com.ptbox.routes.scanRoutes
import com.ptbox.services.ScanService
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json

fun main() {
    embeddedServer(Netty) {
        install(CORS)
    }.start(wait = true)
}

fun Application.module() {
    val dbUrl = System.getenv("DATABASE_URL") ?: throw IllegalStateException("DATABASE_URL is not set")
    val dbUser = System.getenv("DATABASE_USER") ?: throw IllegalStateException("DATABASE_USER is not set")
    val dbPassword = System.getenv("DATABASE_PASSWORD") ?: throw IllegalStateException("DATABASE_PASSWORD is not set")

    val db = ScanDatabase(dbUrl, driver = "org.postgresql.Driver", dbUser, dbPassword)
    val scanService = ScanService(db)

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowHeader(HttpHeaders.ContentType)
        anyHost()
    }

    routing {
        scanRoutes(scanService)
    }
}
