package com.ptbox.database

import com.ptbox.models.Scan
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.minus
import org.jetbrains.exposed.sql.SqlExpressionBuilder.plus
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

class ScanDatabase(dbUrl: String, driver: String, dbUser: String, dbPassword: String) {

    object Scans : Table("scans") {
        val id = integer("id").autoIncrement()
        val domain = varchar("domain", 255)
        val startTime = datetime("start_time")
        val endTime = datetime("end_time").nullable()
        val status = varchar("status", 50)
        val results = text("results").nullable()
        val position = integer("position").autoIncrement()
        override val primaryKey = PrimaryKey(id)
    }

    init {
        Database.connect(
            dbUrl, driver, dbUser, dbPassword
        )
        transaction {
            SchemaUtils.create(Scans)

            if (Scans.selectAll().count() == 0L) {
                repeat(10) { index ->
                    Scans.insert {
                        it[domain] = "example${index + 1}.com"
                        it[startTime] = java.time.LocalDateTime.now()
                        it[endTime] = null
                        it[status] = "Pending"
                        it[results] =
                            """
                                example.com (FQDN) --> ns_record --> ns-1513.awsdns-66.com (FQDN)
                                example.com (FQDN) --> ns_record --> ns-1582.awsdns-00.au (FQDN)
                                example.com (FQDN) --> ns_record --> ns-267.awsdns-33.com (FQDN)
                                example.com (FQDN) --> ns_record --> ns-507.awsdns-07.net (FQDN)
                                ns-987.awsdns-06.net (FQDN) --> a_record --> 423.251.444.22 (IPAddress)
                                ns-987.awsdns-06.net (FQDN) --> aaaa_record --> 2600:9822:5001:8322::1 (IPAddress)
                                205.251.192.0/21 (Netblock) --> contains --> 205.251.194.44 (IPAddress)
                                2600:9000:5300::/45 (Netblock) --> contains --> 2600:9000:4442:0129::1 (IPAddress)
                            """.trimIndent()
                    }
                }
            }
        }
    }

    fun saveScan(scan: Scan): Int {
        return transaction {
            Scans.insert {
                it[domain] = scan.domain
                it[startTime] = scan.startTime
                it[endTime] = scan.endTime
                it[status] = scan.status
                it[results] = scan.results
            }.resultedValues!!.first()[Scans.id]
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

    fun updateScanResult(scanId: Int, newResults: String, newEndTime: LocalDateTime, newStatus: String) {
        transaction {
            Scans.update({ Scans.id eq scanId }) {
                it[results] = newResults
                it[status] = newStatus
                it[endTime] = newEndTime
            }
        }
    }
}