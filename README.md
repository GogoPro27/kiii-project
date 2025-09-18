# Book Management App

A full‑stack application for managing a collection of books. The backend is built with Spring Boot exposing a RESTful API, the frontend is a React single‑page app, and MongoDB stores the data.

This project applies the DevOps knowledge I’ve gained throughout my university course—focusing on containerization, environment management, and deployment automation.

## Tech Stack
- Spring Boot (REST API)
- React (UI)
- MongoDB (document database)
- Docker & Docker Compose
- Kubernetes manifests

## Core Capabilities
- CRUD operations for books (e.g., title, author, category)
- List and detail views with basic search/filtering
- Validation and error handling
- Health endpoints and application probes

## DevOps Highlights
- Containerized services and versioned images
- Environment configuration via .env, ConfigMaps, and Secrets
- Readiness/liveness probes for reliability
- Reproducible local and cluster deployments