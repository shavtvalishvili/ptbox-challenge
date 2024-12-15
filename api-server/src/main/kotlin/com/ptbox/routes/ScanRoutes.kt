package com.ptbox.routes

import com.ptbox.models.CreateScanRequest
import com.ptbox.models.UpdateScanPositionRequest
import com.ptbox.services.ScanService
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.scanRoutes(scanService: ScanService) {
    route("/scan") {
        post {
            val request = call.receive<CreateScanRequest>()
            val scan = scanService.initiateScan(request.domain)
            call.respond(scan)
        }

        get("/{id}") {
            val scan = call.parameters["id"]?.let { scanService.getScanById(it.toInt()) }
            if (scan != null) {
                call.respond(scan)
            } else {
                call.respondText("Scan Not Found", ContentType.Text.Plain, HttpStatusCode.NotFound)
            }
        }

        patch("/{id}/position") {
            val scanId = call.parameters["id"]
            val request = call.receive<UpdateScanPositionRequest>()
            if (scanId != null) {
                scanService.updateScanPosition(scanId.toInt(), request.newPosition)
                call.respond(scanService.getScanById(scanId.toInt()))
            } else {
                call.respondText("Scan Not Found", ContentType.Text.Plain, HttpStatusCode.NotFound)
            }
        }
    }

    route("/scans") {
        get {
            val scans = scanService.getAllScans()
            call.respond(scans)
        }
    }
}