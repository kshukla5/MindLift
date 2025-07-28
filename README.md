# 🚀 MindLift - Professional Learning Platform

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/kshukla5/MindLift)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://postgresql.org/)

A comprehensive full-stack learning platform with role-based dashboards, video management, and interactive features. Built with React, Node.js, and PostgreSQL.

## ✨ Features

### 🎯 **Role-Based Dashboards**
- **👑 Admin Dashboard**: User management, content moderation, platform analytics
- **🎤 Speaker Dashboard**: Video upload, performance metrics, audience insights
- **📱 Learner Dashboard**: Personal progress, bookmarks, content discovery

### 🎥 **Video Management System**
- Video upload with categorization
- Approval workflow for content moderation
- Interactive video player with React Player
- Category-based filtering and search

### 📖 **Bookmark System**
- One-click bookmark functionality
- Personal bookmark library
- Category-based organization
- Usage analytics and insights

### 🎨 **Professional UI/UX**
- Modern, responsive design
- Mobile-first approach
- Interactive components
- Accessibility features

## � Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kshukla5/MindLift.git
   cd MindLift
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment setup**
   ```bash
   # Create .env file in project root
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mindlift
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your-secret-key
   ```

4. **Database setup**
   ```bash
   # Create database and run schema
   psql -U your_db_user -d mindlift -f backend/sql/schema.sql
   
   # Create admin user
   cd backend && node create_admin.js
   ```

5. **Start the application**
   ```bash
   # Start both servers
   npm run dev
   
   # Or start separately
   npm run backend  # Port 3001
   npm run frontend # Port 3000
   ```

## 🌐 Access Points

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

## � Test Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | kunjalcan@gmail.com | 12345 | Full platform control |
| Speaker | speaker@test.com | password123 | Video upload & analytics |
| Learner | subscriber@example.com | 12345 | Content viewing & bookmarks |

## 📊 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication

### Videos
- `GET /api/videos` - List approved videos
- `POST /api/videos` - Upload video (Speaker/Admin)
- `GET /api/speaker/videos` - Speaker dashboard data
- `PATCH /api/videos/:id/approval` - Approve/reject (Admin)

### Bookmarks
- `GET /api/bookmarks` - User bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:videoId` - Remove bookmark
- `GET /api/bookmarks/dashboard` - Bookmark analytics

### Dashboard Data
- `GET /api/learner/dashboard` - Learner analytics
- `GET /api/admin/stats` - Admin statistics

## 🧪 Testing

### Run Test Scripts
```bash
cd backend

# Test all dashboard functionality
node test_all_dashboards.js

# Test authentication flow
node test_login_flow.js

# Test specific APIs
node test_api.js
node test_bookmark_api.js
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Accessible navigation
- Progressive web app features

3. **Required environment variables:**
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL database configuration
   - `JWT_SECRET` - Secret key for JWT token signing
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` - Email server configuration

**Note:** Stripe integration is currently disabled, so all users can subscribe for free. The `/api/subscribe` endpoint simply marks users as paid without processing payments.

## 🏗️ Technologies

- **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) and [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: [React](https://react.dev/) with React Router
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time**: WebSocket support for live features
- **Testing**: Jest for backend testing
- **Deployment**: Render (backend) and Vercel (frontend)

## 📁 Project Structure

```
MindLift/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & other middleware
│   │   ├── config/         # Database & email configuration
│   │   ├── app.js          # Express application setup
│   │   └── server.js       # Server entry point with WebSocket
│   ├── sql/                # Database schema and seed files
│   └── tests/              # Backend tests
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── public/           # Static assets
├── .env.example           # Environment variables template
├── .env.production        # Production environment template
└── setup.sh              # Automated setup script
```

## 🔧 Features

### User Management
- **Three user roles**: Speaker, Subscriber, Admin
- **JWT Authentication**: Secure token-based authentication
- **Profile Management**: User profiles with customizable settings

### Video Platform
- **Video Upload**: Support for file uploads and YouTube/Vimeo URLs
- **Video Management**: CRUD operations for video content
- **Categorization**: Organize videos by categories
- **Approval System**: Admin approval for uploaded content

### Speaker System
- **Speaker Profiles**: Dedicated profiles for content creators
- **Speaker Dashboard**: Tools for content management
- **Bio & Social Links**: Rich speaker profiles with social media integration

### Admin Features
- **Admin Dashboard**: Comprehensive content and user management
- **User Management**: View and manage all users
- **Content Moderation**: Approve/reject uploaded videos
- **Analytics**: Basic usage statistics

### Additional Features
- **Bookmarking**: Users can bookmark favorite videos
- **Real-time Communication**: WebSocket-based live features
- **Responsive Design**: Mobile-friendly interface
- **Email Integration**: NodeMailer for notifications

## 🛠️ Development Commands

```bash
# Setup and installation
npm run setup              # Run automated setup script
npm run install-all        # Install all dependencies manually

# Development
npm run dev               # Start both backend and frontend
npm run backend           # Start backend server only
npm run frontend          # Start frontend development server

# Testing and building
npm test                  # Run backend tests
npm run build            # Build frontend for production
```

## 📖 API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login

### Users
- `GET /api/users` - Get all users (admin only)

### Speakers
- `GET /api/speakers` - List all speakers
- `POST /api/speakers` - Create speaker profile (admin only)
- `GET /api/speakers/:id` - Get single speaker
- `PUT /api/speakers/:id` - Update speaker (admin only)
- `DELETE /api/speakers/:id` - Delete speaker (admin only)

### Videos
- `GET /api/videos` - List all videos
- `POST /api/videos` - Upload video (speakers/admins only)
- `GET /api/videos/:id` - Get single video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:id` - Remove bookmark

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts with roles (speaker, subscriber, admin)
- **speakers**: Speaker profiles with bio and social links
- **videos**: Video content with metadata and approval status
- **bookmarks**: User bookmarks for videos
- **payments**: Payment records (currently disabled)

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Add environment variables from `.env.production`
5. Deploy and note the public URL

### Frontend (Vercel)
1. Import the project into [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Add `REACT_APP_API_URL` environment variable pointing to your backend URL
4. Deploy to get the production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mindlift.com or create an issue on GitHub.

---

Built with ❤️ by the MindLift Team

# Force Vercel redeploy Mon Jul 28 02:51:58 EDT 2025
