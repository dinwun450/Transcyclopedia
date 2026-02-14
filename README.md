<p align="center">
  <img src="https://github.com/dinwun450/Transcyclopedia/blob/main/public/transcyclopediaLogo.png" alt="Description" width="600">
</p>

---

A modern, location-aware public transit information dashboard built with React and Vite. Transcyclopedia provides real-time transit data including routes, stops, departures, service alerts, and an interactive map—all based on your current location.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)

## ✨ Features

### 📊 Overview Dashboard
- **Routes Nearby**: View all transit routes within 500 meters of your location, including route numbers, names, and operating agencies
- **Stops Nearby**: Discover nearby transit stops with expandable departure information
- **Agencies Nearby**: See transit agencies serving your area with contact information (website, email, phone)

### 🔍 Agency Search
- Search for any transit agency by name
- View detailed agency information including:
  - Phone number
  - Email address
  - Website
  - Timezone

### 🕐 Departures
- Look up real-time departures by agency and stop ID
- View estimated vs. scheduled arrival times (estimated times shown in green)
- See route alerts associated with departures

### ⚠️ Service Alerts
- View active service alerts from nearby agencies
- Check route-specific alerts with visual route identification
- Stay informed about service disruptions, detours, and delays

### 🗺️ Interactive Map
- Powered by Mapbox GL with 3D building visualization
- View transit routes plotted on the map with official route colors
- See nearby transit stops with custom markers
- Hover over routes to see route numbers
- Pan and zoom to explore routes in the current view

### 🎨 User Experience
- **Light/Dark Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Fully responsive layout for desktop and mobile devices
- **Real-time Clock & Weather**: Current date, time, and local weather displayed in the header
- **Glassmorphic UI**: Modern, sleek interface with translucent elements

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### API Keys Required

Transcyclopedia requires the following API keys:

1. **Transitland API Key** - For transit data (routes, stops, agencies, departures, alerts)
   - Get your key at: [transit.land](https://www.transit.land/)

2. **OpenWeatherMap API Key** - For weather information
   - Get your key at: [openweathermap.org](https://openweathermap.org/api)

3. **Mapbox Access Token** - For interactive map functionality
   - Get your token at: [mapbox.com](https://www.mapbox.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Transcyclopedia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your API keys:
   ```env
   VITE_TRANSITLAND_API_KEY=your_transitland_api_key
   VITE_WEATHER_KEY=your_openweathermap_api_key
   VITE_MAPBOX_KEY=your_mapbox_access_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📱 Usage

### Granting Location Access

When you first load Transcyclopedia, your browser will request permission to access your location. This is required for:
- Finding nearby routes, stops, and agencies
- Displaying local weather
- Centering the interactive map

### Navigation

Use the left sidebar to navigate between sections:
- **Overview** - Dashboard with nearby transit information
- **Agency** - Search for transit agencies
- **Departures** - Look up departures by agency and stop
- **Alerts** - View service alerts
- **Map** - Interactive transit map
- **About** - Application information

### Accordion Stops

In the Overview section, click the ▾ button on any stop card to expand and view upcoming departures for that stop.

### Theme Toggle

Click the sun/moon icon in the top right to switch between light and dark modes. Your preference is saved and persists across sessions.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) 19.2.0
- **Build Tool**: [Vite](https://vitejs.dev/) 7.2.4
- **Mapping**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) 3.17.0
- **Icons**: [Font Awesome](https://fontawesome.com/) 6.4.0
- **Weather Icons**: [Weather Icons](https://erikflowers.github.io/weather-icons/) 2.0.9
- **Linting**: [ESLint](https://eslint.org/) 9.39.1

## 📁 Project Structure

```
Transcyclopedia/
├── public/
│   └── favicon.ico
├── src/
│   ├── scripts/
│   │   ├── Agency.jsx          # Agency search functionality
│   │   ├── AllAlerts.jsx       # Service alerts handling
│   │   ├── Departures.jsx      # Departure lookups
│   │   ├── InteractiveMap.jsx  # Mapbox map component
│   │   ├── Overview.jsx        # Nearby routes, stops, agencies
│   │   ├── Responsiveness.jsx  # Responsive layout handling
│   │   ├── TimeAndWeather.jsx  # Date, time, and weather
│   │   └── envUnloader.jsx     # Environment variable loader
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   ├── MainConts.css       # Main container styles
│   │   ├── Navbar.css          # Navigation styles
│   │   ├── InterfaceMaterials.css
│   │   ├── Scrollbars.css
│   │   ├── Responsive.css      # Media queries
│   │   └── lightDarkMode.css   # Theme styles
│   ├── main.jsx                # React entry point
│   ├── MainConts.jsx           # Main application component
│   └── Navbar.jsx              # Navigation sidebar
├── .env                        # Environment variables (not committed)
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## 🔌 Data Sources

- **Transit Data**: [Transitland](https://www.transit.land/) - An open platform that aggregates transit data from agencies worldwide
- **Weather Data**: [OpenWeatherMap](https://openweathermap.org/) - Current weather conditions
- **Map Tiles**: [Mapbox](https://www.mapbox.com/) - Interactive maps with 3D buildings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source. Please check the repository for license information.

## 👤 Author

Created by **Dino Wun**

---

*Transcyclopedia - Your encyclopedia for public transit* 🚇🚍🚊
