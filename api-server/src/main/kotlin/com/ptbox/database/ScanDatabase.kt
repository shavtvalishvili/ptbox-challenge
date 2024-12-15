package com.ptbox.database

import com.ptbox.models.Scan
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.minus
import org.jetbrains.exposed.sql.SqlExpressionBuilder.plus
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction

class ScanDatabase(dbUrl: String, driver: String, dbUser: String, dbPassword: String) {

    object Scans : Table("scans") {
        val id = integer("id").autoIncrement()
        val domain = varchar("domain", 255)
        val startTime = datetime("start_time")
        val endTime = datetime("end_time").nullable()
        val status = varchar("status", 50)
        val results = text("results")
        val position = integer("position").autoIncrement()
        override val primaryKey = PrimaryKey(id)
    }

    init {
        Database.connect(
            dbUrl, driver, dbUser, dbPassword
        )
        transaction {
            SchemaUtils.create(Scans)

            repeat(10) { index ->
                Scans.insert {
                    it[domain] = "example${index + 1}.com"
                    it[startTime] = java.time.LocalDateTime.now()
                    it[endTime] = null
                    it[status] = "Pending"
                    it[results] =
                        "example.com (FQDN) --> node --> www.example.com (FQDN) --> a_record --> 123.456.789.01 (IPAddress)"
                }
            }
        }
    }

    fun saveScan(scan: Scan) {
        transaction {
            Scans.insert {
                it[domain] = scan.domain
                it[startTime] = scan.startTime
                it[endTime] = scan.endTime
                it[status] = scan.status
                it[results] = scan.results
            }
        }
    }

    fun getAllScans(): List<Scan> {
        return transaction {
            Scans.selectAll().orderBy(Scans.position to SortOrder.ASC).map {
                Scan(
                    id = it[Scans.id],
                    domain = it[Scans.domain],
                    startTime = it[Scans.startTime],
                    endTime = it[Scans.endTime],
                    status = it[Scans.status],
                    results = it[Scans.results],
                    position = it[Scans.position]
                )
            }
        }
    }

    fun getScanById(scanId: Int): Scan {
        return transaction {
            Scans.selectAll().where { Scans.id eq scanId }.single().let {
                Scan(
                    id = it[Scans.id],
                    domain = it[Scans.domain],
                    startTime = it[Scans.startTime],
                    endTime = it[Scans.endTime],
                    status = it[Scans.status],
                    results = it[Scans.results],
                    position = it[Scans.position]
                )
            }
        }
    }

    fun updateScanPosition(scanId: Int, newPosition: Int) {
        transaction {
            val currentPosition =
                Scans.select(Scans.position).where { Scans.id eq scanId }.singleOrNull()?.get(Scans.position)
                    ?: throw IllegalArgumentException("Item not found")

            if (newPosition > currentPosition) {
                Scans.update({
                    (Scans.position greaterEq currentPosition) and (Scans.position lessEq newPosition)
                }) {
                    it[position] = position - 1
                }
            } else if (newPosition < currentPosition) {
                Scans.update({
                    (Scans.position greaterEq newPosition) and (Scans.position less currentPosition)
                }) {
                    it[position] = position + 1
                }
            }

            Scans.update({ Scans.id eq scanId }) {
                it[position] = newPosition
            }
        }
    }
}