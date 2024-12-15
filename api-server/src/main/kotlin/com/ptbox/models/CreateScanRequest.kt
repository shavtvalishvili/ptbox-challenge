package com.ptbox.models

import kotlinx.serialization.Serializable

@Serializable
data class CreateScanRequest(val domain: String)
