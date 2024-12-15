package com.ptbox

import com.ptbox.models.CreateScanRequest
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {

    @Test
    fun testGet() = testApplication {
        application {
            module()
        }
        client.get("/scans").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }

    @Test
    fun testPost() = testApplication {
        application {
            module()
        }
        val createScanRequest = CreateScanRequest(domain = "google.com")
        client.post("/scans") {
            contentType(ContentType.Application.Json)
            setBody(createScanRequest)
        }.apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}
