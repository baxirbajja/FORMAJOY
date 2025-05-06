# FormaJOY Project Specifications

## 1. Overview

FormaJOY is a comprehensive management system for training centers, available in both web (MERN stack) and mobile versions. The system enables management of teachers, courses, students, attendance, and payments.

## 2. Users and Roles

### Administrator
- Complete teacher management (add, modify, delete)
- Course creation and configuration
- Student and organization registration
- Application of promotions/discounts
- Attendance tracking
- Teacher payment management
- Login credentials assignment

### Teacher
- Profile consultation
- View assigned courses
- Payment history consultation
- Payment confirmation

### Student
- Profile consultation
- View enrolled courses

### Organization
- Profile consultation
- Participant management
- View enrolled courses
- Payment history consultation

## 3. Data Models



### Teacher (extends User)
- Phone
- Address
- Specialty
- Profit percentage
- Available hours
- Sessions per week
- Status (active/inactive)

### Student (extends User)
- Phone
- Address
- Date of birth
- Applicable promotion (percentage)

### Organization (extends User)
- Organization name
- Business sector
- Phone
- Address
- Contact person
- Contact email
- Applicable promotion (percentage)
- Participant list (references)

### Participant
- ID
- Organization (reference)
- First Name
- Last Name
- Email
- Phone
- Position/Function
- Enrolled courses (references)

### Course
- ID
- Name
- Description
- Price
- Special organization price
- Total duration (hours)
- Start date
- End date
- Schedule (days and hours)
- Room
- Assigned teacher (reference)
- Status (planned, in progress, completed)
- Enrolled students list (references)
- Enrolled organizations list (references)
- Enrolled participants list (references)

### Session
- ID
- Course (reference)
- Date
- Start time
- End time
- Status (planned, completed, cancelled)

### Attendance
- ID
- Session (reference)
- Student/Participant (reference)
- Type (individual student, organization participant)
- Status (present, absent, late)
- Comment

### Payment
- ID
- Type (teacher, organization)
- Reference (teacher or organization)
- Amount
- Month concerned
- Payment date
- Status (pending, confirmed)
- Payment method
- Invoice (reference)

## 4. Detailed Features

### Teacher Management
- Registration with personal and professional information
- Contract configuration (percentage, sessions, hours)
- Assigned courses tracking
- Automatic monthly payment calculation
- Payment confirmation system

### Course Management
- Creation with complete parameters
- Room and teacher assignment
- Session planning
- Registration tracking (individual students and organizations)
- Course status management
- Special pricing for organizations

### Student Management
- Complete registration
- Course enrollment
- Custom promotion application
- Payment tracking

### Organization Management
- Complete registration with company information
- Participant management (add, modify, delete)
- Course enrollment for participants
- Special rates and promotions application
- Billing and payment tracking

### Attendance Tracking
- Recording for each session (students and organization participants)
- Absence visualization
- Organization attendance reports

### Financial Management
- Course revenue calculation
- Teacher payment calculation
- Organization billing
- Payment confirmation tracking
- Detailed financial reports by client type (individual/organization)

## 5. User Interfaces

### Web Version
- Complete administration interface
- Role-specific dashboards
- Management forms
- Reports and statistics
- Responsive design

### Mobile Version
- Essential features adapted for mobile
- Simplified interface
- Push notifications

## 6. RESTful API

The API will be structured around main resources:
- /api/auth - Authentication
- /api/users - User management
- /api/teachers - Teacher management
- /api/students - Student management
- /api/organizations - Organization management
- /api/participants - Organization participant management
- /api/courses - Course management
- /api/sessions - Session management
- /api/attendance - Attendance management
- /api/payments - Payment management
- /api/invoices - Invoice management

## 7. Security

- JWT Authentication
- Password hashing
- Role-based access control
- Data validation
- Protection against common attacks (XSS, CSRF)

## 8. Development Phases

### Phase 1: Preparation and Setup
- Development environment setup
- Dependencies configuration
- Data model creation

### Phase 2: Backend Development
- RESTful API implementation
- Authentication setup
- Core feature development

### Phase 3: Web Frontend Development
- User interface creation
- API integration
- Usability testing

### Phase 4: Mobile Development
- Feature adaptation for mobile
- Mobile interface development
- Backend synchronization

### Phase 5: Testing and Deployment
- Integration testing
- Bug fixing
- Initial version deployment

## 9. Recommended Technologies

### Web Frontend
- React.js
- Redux for state management
- Material-UI for components
- Axios for HTTP requests
- Chart.js for visualizations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for hashing
- Multer for file management

### Mobile
- Flutter
- Provider/Bloc for state management
- Flutter Navigation
- Dio for HTTP requests
- SharedPreferences for local storage

## 10. Collaboration Guidelines

- Use Git for version control
- Document API to facilitate mobile integration
