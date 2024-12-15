package com.ptbox.models

import kotlinx.serialization.Serializable
import serialization.LocalDateTimeSerializer
import java.time.LocalDateTime

@Serializable
data class Scan(
    val id: Int?,
    val domain: String,
    @Serializable(with = LocalDateTimeSerializer::class) val startTime: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) val endTime: LocalDateTime?,
    val status: String,
    val results: String,
    val position: Int?
)