package com.ptbox.models;

import kotlinx.serialization.Serializable;

@Serializable
data class UpdateScanPositionRequest(val newPosition: Int)
