# ptbox-challenge

## Project Overview

This OSINT web application enables users to scan specified domains using the Amass tool. The application is built using Kotlin (Ktor) for the backend, React for the frontend, and is containerized using Docker. It supports persistence using PostgreSQL and leverages `kotlinx.serialization` for data handling.

## Features
- Scan domains to gather OSINT data (e.g., subdomains, IPs, emails).
- View scan history, including start and end times for each scan.
- Access scan details via a dedicated URL.
- Reorder scan cards on the front end (if implemented).
- Fully containerized application for deployment ease.

## Prerequisites
- Docker installed on your system.
- PostgreSQL (optional if not using an external DB).
- Java 17 (Ktor requires at least Java 17).
- Kotlin 2.0+ and Gradle 8.0+.

## Steps to Build and Run

1. **Clone the repository**:
    ```bash
    git clone https://github.com/shavtvalishvili/ptbox-challenge
    cd ptbox-challenge
    ```

2. **Build the Docker containers**:
    ```bash
    docker-compose build
    ```

3. **Run the application**:
    ```bash
    docker-compose up
    ```

4. **Access the application**:
    - Frontend: [http://localhost:5175](http://localhost:5175)
    - Backend API: [http://localhost:8080](http://localhost:8080)

## Backend API Endpoints

### 1. Initiate a Scan
- **POST** `/scan`
- **Request Body**:
    ```json
    {
      "domain": "example.com"
    }
    ```
- **Response**:
    ```json
    {
      "id": 1,
      "domain": "example.com",
      "startTime": "2024-12-14T12:00:00Z",
      "endTime": "2024-12-14T12:05:00Z",
      "result": "example.com (FQDN) --> node --> www.example.com (FQDN) --> a_record --> 123.456.789.01 (IPAddress)",
      "position": 1
    }
    ```

### 2. Get Scan History
- **GET** `/scans`
- **Response**:
    ```json
    [
      {
        "id": 1,
        "domain": "example.com",
        "startTime": "2024-12-14T12:00:00Z",
        "endTime": "2024-12-14T12:05:00Z",
        "result": "example.com (FQDN) --> node --> www.example.com (FQDN) --> a_record --> 123.456.789.01 (IPAddress)",
        "position": 1
      }
    ]
    ```

### 3. Get Scan by ID
- **GET** `/scan/{id}`
- **Response**:
    ```json
    {
      "id": 1,
      "domain": "example.com",
      "startTime": "2024-12-14T12:00:00Z",
      "endTime": "2024-12-14T12:05:00Z",
      "result": "example.com (FQDN) --> node --> www.example.com (FQDN) --> a_record --> 123.456.789.01 (IPAddress)",
      "position": 1
    }
    ```

### 4. Update Scan Position
- **PATCH** `/scan/{id}/position`
- **Request Body**:
    ```json
    {
      "position": 2
    }
    ```
- **Response**:
    ```json
    {
      "id": 1,
      "domain": "example.com",
      "startTime": "2024-12-14T12:00:00Z",
      "endTime": "2024-12-14T12:05:00Z",
      "result": "example.com (FQDN) --> node --> www.example.com (FQDN) --> a_record --> 123.456.789.01 (IPAddress)",
      "position": 2
    }
    ```

## License

This project is licensed under the Apache License 2.0.