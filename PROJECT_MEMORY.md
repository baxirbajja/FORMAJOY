# FormaJOY Project Memory

## Project Overview
FormaJOY is a comprehensive management system for training centers with both web (MERN stack) and mobile (Flutter) versions. The system manages teachers, courses, students, organizations, attendance, and payments. It supports both individual student enrollments and organization-based enrollments with multiple participants.

## Key Components

### User Roles
- **Administrator**: Complete management of teachers, courses, students, organizations, payments, and system access
- **Teacher**: View profile, assigned courses, and payment history
- **Student**: View profile and enrolled courses
- **Organization**: View profile, enrolled courses, and manage participants

### Data Models
- **User**: Base model with authentication details
- **Teacher**: Extended user with contract details and specialization
- **Student**: Extended user with personal details and applicable promotions
- **Organization**: Extended user with company details, contact information, and list of participants
- **Participant**: Individual members of an organization enrolled in courses
- **Course**: Complete course information including schedule and assigned teacher
- **Session**: Individual class sessions
- **Attendance**: Tracking student/participant presence in sessions
- **Payment**: Teacher payment records and organization payment records with confirmation

### Core Features
- Teacher management with contract configuration
- Course creation and scheduling
- Student registration and enrollment
- Organization registration with multiple participants
- Attendance tracking for individual students and organization participants
- Financial management (revenue calculation, teacher payments, organization billing)

## Technology Stack

### Web Version
- **Frontend**: React.js, Redux, Material-UI, Axios, Chart.js
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt

### Mobile Version
- **Framework**: Flutter
- **State Management**: Provider/Bloc
- **Networking**: Dio
- **Storage**: SharedPreferences

## Development Phases
1. **Preparation and Configuration**: Environment setup, dependencies, data models
2. **Backend Development**: API implementation, authentication, core features
3. **Web Frontend Development**: UI creation, API integration, usability testing
4. **Mobile Development**: Mobile adaptation, interface development, backend synchronization
5. **Testing and Deployment**: Integration testing, bug fixing, initial deployment

## API Structure
- /api/auth - Authentication
- /api/users - User management
- /api/teachers - Teacher management
- /api/students - Student management
- /api/organizations - Organization management
- /api/participants - Organization participants management
- /api/courses - Course management
- /api/sessions - Session management
- /api/attendance - Attendance management
- /api/payments - Payment management

## Security Measures
- JWT authentication
- Password hashing
- Role-based access control
- Data validation
- Protection against common attacks (XSS, CSRF)

---
*This document serves as a memory reference for the FormaJOY project and will be updated as development progresses.*