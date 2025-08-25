# 🚀 OrbitIQ - Space Data & Missions Hub

**Your one-stop platform for space exploration, satellite tracking, and mission data**

OrbitIQ is a comprehensive web application that brings the cosmos to your fingertips with real-time satellite tracking, mission databases, launch calendars, and space news aggregation.

![OrbitIQ Banner](https://via.placeholder.com/800x200/0a0a0f/06b6d4?text=OrbitIQ+-+Space+Data+%26+Missions+Hub)

## ✨ Features

### 🛰️ **Live Satellite Tracking**
- Real-time ISS position tracking
- Track thousands of satellites using N2YO API
- Interactive satellite data with orbital parameters
- Filter by category, status, and country

### 🚀 **Mission Database**
- Comprehensive space missions from NASA, SpaceX, ISRO, ESA
- Mission timelines, crew information, and achievements
- SpaceX API integration for latest mission data
- Advanced search and filtering capabilities

### 📅 **Launch Calendar**
- Upcoming rocket launches with countdown timers
- Launch probability and status tracking
- Integration with Launch Library API
- Live webcast links and mission details

### 📰 **Space News Hub**
- Curated space news from trusted sources
- NASA and SpaceX specific news feeds
- Trending space topics and discoveries
- Real-time news aggregation

### 📊 **Mission Dashboard**
- Personalized space exploration command center
- Live statistics and analytics
- Quick actions and recent activity feed
- Real-time ISS tracking widget

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Three.js** - 3D visualizations (planned)
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **date-fns** - Date utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### APIs & Services
- **N2YO API** - Satellite tracking data
- **SpaceX API** - SpaceX mission data
- **Launch Library API** - Launch information
- **NewsAPI** - Space news aggregation
- **ISS Open Notify API** - ISS position data

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- API Keys (see configuration section)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/orbitiq.git
cd orbitiq
```

2. **Install dependencies**
```bash
npm run install-deps
```

3. **Configure environment variables**
```bash
# Copy environment template
cp server/.env.example server/.env

# Edit server/.env with your configuration
```

4. **Start the development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/orbitiq

# Server
PORT=5000
NODE_ENV=development

# API Keys
NASA_API_KEY=your_nasa_api_key_here
N2YO_API_KEY=your_n2yo_api_key_here
NEWS_API_KEY=your_news_api_key_here

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
```

### API Keys Setup

1. **N2YO API** (Satellite Tracking)
   - Visit: https://www.n2yo.com/api/
   - Sign up for a free account
   - Get your API key from the dashboard

2. **NewsAPI** (Space News)
   - Visit: https://newsapi.org/
   - Register for a free account
   - Copy your API key

3. **NASA API** (Optional)
   - Visit: https://api.nasa.gov/
   - Generate a free API key

## 📁 Project Structure

```
orbitiq/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── index.js            # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Satellites
- `GET /api/satellites` - Get all satellites
- `GET /api/satellites/:noradId` - Get satellite by NORAD ID
- `GET /api/satellites/:noradId/position` - Get real-time position
- `GET /api/satellites/iss/position` - Get ISS position

### Missions
- `GET /api/missions` - Get all missions
- `GET /api/missions/:id` - Get mission by ID
- `GET /api/missions/spacex/sync` - Sync SpaceX missions
- `GET /api/missions/stats/overview` - Get mission statistics

### Launches
- `GET /api/launches` - Get all launches
- `GET /api/launches/upcoming/next` - Get upcoming launches
- `GET /api/launches/sync/upcoming` - Sync upcoming launches
- `GET /api/launches/stats/overview` - Get launch statistics

### News
- `GET /api/news` - Get space news
- `GET /api/news/nasa` - Get NASA news
- `GET /api/news/spacex` - Get SpaceX news
- `GET /api/news/trending` - Get trending topics

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update preferences

## 🎨 UI Components

### Custom Styles
- **Glass Card Effect** - `.glass-card`
- **Primary Button** - `.btn-primary`
- **Secondary Button** - `.btn-secondary`
- **Space Theme Colors** - Custom color palette

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client && npm run build

# Start production server
cd ../server && npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secret
- Configure API rate limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** - For providing open space data APIs
- **SpaceX** - For their comprehensive launch API
- **N2YO** - For satellite tracking services
- **Launch Library** - For launch schedule data
- **NewsAPI** - For news aggregation services

## 📞 Support

- 📧 Email: support@orbitiq.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/orbitiq/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/orbitiq/discussions)

---

**Made with ❤️ for space enthusiasts worldwide** 🌍🚀

*OrbitIQ - Bringing the cosmos to your fingertips*
