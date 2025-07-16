# MindLift - Complete Setup and Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd MindLift
   npm run install-all
   ```

2. **Environment Configuration**
   Create a `.env` file in the project root:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mindlift
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your-secret-key
   ```

3. **Database Setup**
   ```bash
   # Create database and run schema
   psql -U your_db_user -d mindlift -f backend/sql/schema.sql
   
   # Create admin user
   cd backend && node create_admin.js
   ```

4. **Start the Application**
   ```bash
   # Option 1: Start both servers simultaneously
   npm run dev
   
   # Option 2: Start servers separately
   npm run backend  # Backend on port 3001
   npm run frontend # Frontend on port 3000
   ```

## 📱 Application Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 👥 User Roles & Credentials

### 🔐 Test Accounts

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| Admin | kunjalcan@gmail.com | 12345 | Full system access, user management, video approval |
| Speaker | speaker@test.com | password123 | Video upload, speaker dashboard, analytics |
| Subscriber | subscriber@example.com | 12345 | Video viewing, bookmarking, learner dashboard |

## 🎯 Features Overview

### 📊 Dashboard System

#### **Learner/Subscriber Dashboard**
- **Personal Statistics**: Bookmark counts, categories explored, weekly/monthly activity
- **Platform Statistics**: Total videos, active speakers, new content
- **Recent Activity**: Latest bookmarks, category breakdown
- **Video Discovery**: Recent videos, popular categories
- **Responsive Design**: Mobile-friendly interface

#### **Speaker Dashboard**
- **Video Management**: Upload, edit, delete videos
- **Performance Metrics**: Views, engagement, approval status
- **Recent Activity**: Upload history, status updates
- **Tips & Guidance**: Platform best practices
- **Analytics**: Video performance tracking

#### **Admin Dashboard**
- **User Management**: View all users, manage roles
- **Content Moderation**: Approve/reject videos
- **Platform Statistics**: System-wide metrics
- **Video Management**: Full CRUD operations

### 🎥 Video System

#### **Video Upload (Speakers)**
- **Supported Formats**: MP4, MOV, AVI
- **Categorization**: Motivation, Leadership, Technology, etc.
- **Approval Workflow**: Admin review required
- **Metadata**: Title, description, category, tags

#### **Video Discovery (All Users)**
- **Browse by Category**: Filtered video lists
- **Search Functionality**: Title and description search
- **Approval Status**: Only approved videos shown to subscribers
- **Responsive Player**: React Player integration

### 📖 Bookmark System

#### **Personal Library**
- **Add/Remove Bookmarks**: One-click bookmark management
- **Category Organization**: Automatic categorization
- **Statistics Tracking**: Usage analytics
- **Recent Activity**: Chronological bookmark history

#### **Analytics**
- **Usage Patterns**: Weekly/monthly bookmark trends
- **Category Breakdown**: Percentage distribution
- **Discovery Metrics**: Popular categories, content preferences

## 🛠️ API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Videos
- `GET /api/videos` - List all approved videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos` - Upload new video (Speaker/Admin)
- `PUT /api/videos/:id` - Update video (Speaker/Admin)
- `DELETE /api/videos/:id` - Delete video (Speaker/Admin)
- `GET /api/videos/unapproved` - List pending videos (Admin)
- `PATCH /api/videos/:id/approval` - Approve/reject video (Admin)

### Speaker Features
- `GET /api/speaker/videos` - Get speaker's videos and stats
- `GET /api/speaker/stats` - Get speaker analytics

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:videoId` - Remove bookmark
- `GET /api/bookmarks/dashboard` - Get bookmark statistics

### Dashboard Data
- `GET /api/learner/dashboard` - Get learner dashboard data
- `GET /api/admin/stats` - Get admin dashboard statistics

### Users
- `GET /api/users` - List all users (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## 🎨 Frontend Structure

### Pages
- **Home**: Landing page with hero section and features
- **Features**: Detailed feature showcase
- **Login/Signup**: Authentication forms
- **Dashboard**: Role-based dashboard routing
- **Video Library**: Browse and search videos
- **Profile**: User profile management

### Components
- **Navbar**: Responsive navigation with authentication
- **VideoGrid**: Video listing with filtering
- **VideoPlayer**: Integrated video player
- **Dashboard Components**: Role-specific dashboard widgets
- **Forms**: Authentication and video upload forms

## 🔧 Technical Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **File Upload**: multer
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Video Player**: React Player
- **Styling**: CSS3 with responsive design
- **Build Tool**: Create React App

### Database Schema
- **Users**: Authentication and profile data
- **Videos**: Video metadata and approval status
- **Bookmarks**: User-video relationships
- **Categories**: Video categorization

## 🧪 Testing

### Available Test Scripts
```bash
# Test all dashboard functionalities
cd backend && node test_all_dashboards.js

# Test authentication flow
cd backend && node test_login_flow.js

# Test specific API endpoints
cd backend && node test_api.js
cd backend && node test_bookmark_api.js
cd backend && node test_learner_dashboard.js
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Dashboard access for each role
- [ ] Video upload and approval workflow
- [ ] Bookmark functionality
- [ ] Responsive design on mobile
- [ ] Error handling and validation

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Update `.env` with production values
2. **Database**: Set up production PostgreSQL instance
3. **Build Frontend**: `npm run build`
4. **Server Configuration**: Configure reverse proxy (nginx)
5. **SSL Certificate**: Enable HTTPS
6. **Process Management**: Use PM2 or similar

### Security Considerations
- JWT secret should be cryptographically secure
- Database credentials should be protected
- API rate limiting should be implemented
- Input validation is active on all endpoints
- CORS is configured for production domains

## 📞 Support

For technical support or feature requests:
1. Check existing documentation
2. Review test scripts for usage examples
3. Examine API endpoints for integration details
4. Check browser console for frontend errors
5. Review backend logs for API issues

## 🎉 Success Metrics

The MindLift platform successfully delivers:
- ✅ Robust authentication system
- ✅ Role-based access control
- ✅ Professional user dashboards
- ✅ Complete video management system
- ✅ Interactive bookmark functionality
- ✅ Responsive, modern UI design
- ✅ Scalable backend architecture
- ✅ Comprehensive testing coverage

**Status**: Production Ready 🚀
