package com.ptbox.services

import com.ptbox.database.ScanDatabase
import com.ptbox.models.Scan
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.LocalDateTime

class ScanService(private val database: ScanDatabase) {

    suspend fun initiateScan(domain: String): Scan {
        val startTime = LocalDateTime.now()
        val results = runAmassTool(domain)
        val endTime = LocalDateTime.now()

        val scan = Scan(
            id = null,
            domain = domain,
            startTime = startTime,
            endTime = endTime,
            status = if (results.isNotEmpty()) "Completed" else "Failed",
            results = results,
            position = null
        )

        database.saveScan(scan)
        return scan
    }

    fun getAllScans(): List<Scan> {
        return database.getAllScans()
    }

    fun getScanById(scanId: Int): Scan {
        return database.getScanById(scanId)
    }

    fun updateScanPosition(scanId: Int, newPosition: Int) {
        return database.updateScanPosition(scanId, newPosition)
    }

    private suspend fun runAmassTool(domain: String): String {
        return withContext(Dispatchers.IO) {
            val processBuilder = ProcessBuilder(
                "amass", "enum", "-d", domain,
            ).apply {
                redirectErrorStream(true)
            }

            val process = processBuilder.start()
            val results = process.inputStream.bufferedReader().use { it.readText() }
            process.waitFor()

            if (process.exitValue() != 0) {
                throw RuntimeException(
                    "Amass tool execution failed: ${
                        process.errorStream.bufferedReader().use { it.readText() }
                    }"
                )
            }

            return@withContext results
        }
    }
}