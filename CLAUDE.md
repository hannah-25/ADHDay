# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

ADHDay is a full-stack mental health application with JWT-based authentication that helps users track ADHD symptoms and manage their mental health through assessments, medication tracking, and daily logging.

**Backend (Java Spring Boot):**
- Main package: `hannah.mind.ADHDay`
- Spring Boot 3.5.3 with Java 17
- JPA/Hibernate with H2 database (file-based: `~/adhdaydb`)
- JWT authentication with cookie-based token management
- Domain-driven structure with modules for: auth, assessments, accounts, users, consultations, daily_logs, medication, statistics

**Key architectural patterns:**
- Backend uses domain-driven design with clear separation of concerns
- JWT tokens stored in HTTP-only cookies for security
- CORS configured for localhost:3000 (frontend) ↔ localhost:8080 (backend)

## Common Commands

### Backend (Java Spring Boot)
```bash
# Run Spring Boot application
./gradlew bootRun

# Build the project
./gradlew build

# Run tests
./gradlew test

# Clean build
./gradlew clean build

# H2 Database Console (when running)
# URL: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:file:~/adhdaydb
# Username: sa
# Password: (empty)
```

## Key Configuration Files

- `build.gradle` - Backend dependencies and build configuration
- `src/main/resources/application.yml` - Spring Boot configuration including JWT settings

## Database Schema

The application uses H2 file database with JPA entities:
- `User` - User profile information
- `Account` - Authentication credentials
- `UserAssessment` - Assessment results
- `UserAssessmentAnswer` - Individual assessment answers

DDL auto-mode is set to "update" for development.

## JWT Authentication Flow

1. Login: POST `/api/auth/login` returns access token (15 min) and refresh token (7 days) in cookies
2. Frontend stores tokens in HTTP-only cookies
3. JwtCookieAuthFilter validates tokens on each request
4. Automatic token refresh on 401 responses via axios interceptor
5. Logout: POST `/api/auth/logout` clears cookies

## Assessment System

Mental health assessments are loaded from JSON templates in `src/main/resources/assessments/`:
- `asrs.json` - ADHD assessment
- `gad7.json` - Anxiety assessment  
- `phq9.json` - Depression assessment

Templates are loaded by `AssessmentTemplateLoader` and served via REST API.

## API Endpoints

Key backend endpoints:
- `/api/auth/*` - Authentication (login, signup, refresh, logout)
- `/api/assessments/*` - Mental health assessments
- `/api/accounts/*` - User account management
- `/h2-console` - Database console (development only)

## Development Notes

- Backend runs on port 8080, frontend on port 3000
- CORS is configured for cross-origin requests between frontend and backend
- JWT secret key is configured in application.yml (change for production)
- H2 console is enabled for development database inspection
- Assessment templates can be modified in JSON files without code changes