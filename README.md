# MindLift
MindLift is your daily dose of motivation, mindset mastery, and personal growth. Unlock your full potential with empowering content designed to elevate your thinking and transform your life.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/skywardcloud/MindLift.git
cd MindLift

# Run the automated setup
npm run setup

# Edit .env with your database credentials
# Then set up the database:
createdb mindlift
psql -d mindlift -f backend/sql/schema.sql

# Start the application
npm run dev
```

Visit http://localhost:3000 to view the application.

## 📋 Environment Setup

### Required Environment Variables

1. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual values:
   - Database credentials (PostgreSQL)
   - JWT secret key
   - Email server settings (for NodeMailer)
   - Stripe keys (if you want to re-enable payments)

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

