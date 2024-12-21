package com.ptbox.services

import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.api.async.ResultCallback
import com.github.dockerjava.api.model.Frame
import com.github.dockerjava.core.DockerClientBuilder
import com.ptbox.database.ScanDatabase
import com.ptbox.models.Scan
import com.ptbox.models.ScanResult
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

class ScanService(private val database: ScanDatabase, private val sessionManager: WebSocketSessionManager) {
    private val job = Job()
    private val scanServiceScope = CoroutineScope(Dispatchers.Default + job)

    fun initiateScan(domain: String): Scan {
        val startTime = LocalDateTime.now()

        val scan = Scan(
            id = null,
            domain = domain,
            startTime = startTime,
            endTime = null,
            status = ScanResult.Pending.toString(),
            results = null,
            position = null
        )
        val savedScanId = database.saveScan(scan)

        scanServiceScope.launch {
            try {
                val results = runAmassTool(domain)
                val endTime = LocalDateTime.now()
                val status = if (results.isNotEmpty()) ScanResult.Completed.toString() else ScanResult.Failed.toString()

                println("Intermediary result: $results $endTime $status")

                database.updateScanResult(savedScanId, results, endTime, status)
                notifyWebSocket(savedScanId, results, status)
            } catch (e: Exception) {
                println("Error: ${e.message}")
            }
        }

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

    private fun runAmassTool(domain: String): String {
        val dockerClient: DockerClient = DockerClientBuilder.getInstance().build()
        if (dockerClient.listImagesCmd().exec().none { it.repoTags?.contains("caffix/amass") == true }) {
            dockerClient.pullImageCmd("caffix/amass").exec(ResultCallback.Adapter()).awaitCompletion()
        }

        var containerId: String? = null
        val logs = StringBuilder()

        try {
            val container = dockerClient.createContainerCmd("caffix/amass")
                .withCmd("enum", "-d", domain)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .exec()

            containerId = container.id
            dockerClient.startContainerCmd(containerId).exec()

            dockerClient.logContainerCmd(containerId)
                .withStdOut(true)
                .withFollowStream(true)
                .exec(object : ResultCallback.Adapter<Frame>() {
                    override fun onNext(frame: Frame) {
                        logs.append(String(frame.payload) + '\n')
                    }
                }).awaitCompletion(5, TimeUnit.MINUTES)
        } catch (e: Exception) {
            println("Error running Amass tool: ${e.message}")
        } finally {
            if (containerId != null) {
                try {
                    dockerClient.stopContainerCmd(containerId).exec()
                } catch (stopException: Exception) {
                    println("Error stopping container $containerId: ${stopException.message}")
                }
                try {
                    dockerClient.removeContainerCmd(containerId).withForce(true).exec()
                } catch (removeException: Exception) {
                    println("Error removing container $containerId: ${removeException.message}")
                }
            }
        }

        return logs.toString()
    }

    private suspend fun notifyWebSocket(id: Int, results: String, status: String) {
        sessionManager.broadcast(
            mapOf(
                "id" to id,
                "status" to status,
                "results" to results
            ).toString()
        )
    }
}