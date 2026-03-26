# 🌿 Calgary Patio Finder

Discover the best patios in YYC with real-time weather tracking and curated recommendations.

![Calgary Patio Finder](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ☀️ Features

- **Real-time Weather Integration** - Live Calgary weather with "Patio Weather Score" based on temperature, wind, and precipitation
- **Smart Filters** - Find patios that match your needs:
  - 🔥 Heated patios (perfect for Calgary winters)
  - ☂️ Covered patios
  - 🐕 Dog-friendly spots
  - 🌅 Sunset views
  - ⏰ Open now
- **"Sunny Right Now" Filter** - Find the best patios for current weather conditions
- **Interactive Map View** - Visual exploration of patio locations
- **Hidden Gems Section** - Curated local favorites off the beaten path
- **Patio Season Countdown** - Track days until patio season (May long weekend)
- **Mobile-Responsive Design** - Instagram-worthy UI that works on any device
- **Last Visited Tracking** - Personal history saved locally

## 🏙️ Calgary Patio Culture

Calgarians take their patios seriously. When the sun comes out, the city transforms into an outdoor dining paradise. Here's what makes Calgary's patio scene unique:

### The Calgary Patio Season

- **Peak Season**: May Long Weekend (Victoria Day) through mid-September
- **Extended Season**: Many patios operate year-round with heaters and covers
- **Chinook Bonus**: Winter chinooks (warm winds) can bring 15°C+ days in January - perfect for heated patios!

### Why Calgary Patios Are Special

1. **Sunshine Capital**: Calgary gets more sunny days than any other major Canadian city (333 days/year)
2. **Long Summer Evenings**: Sunset around 10 PM in June/July means extended patio hours
3. **Diverse Neighborhoods**: From trendy Kensington to historic Inglewood, each area has its own patio personality
4. **Mountain Views**: Many patios offer stunning views of the Rocky Mountains to the west
5. **Year-Round Options**: A growing number of patios are heated and covered for winter enjoyment

### Patio Weather in Calgary

Calgary's weather is famously unpredictable, which makes real-time weather tracking essential:

- **Summer**: Warm days (20-28°C), cool evenings, occasional thunderstorms
- **Spring/Fall**: Variable temperatures, layered clothing recommended
- **Winter**: Chinook winds can bring sudden warm spells; check for heated patios
- **Wind**: Calgary is windy! Covered patios are great for breezy days

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mizoz/calgary-patio-finder.git

# Navigate to the project
cd calgary-patio-finder

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
calgary-patio-finder/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── HomeClient.tsx     # Client-side home component
│   │   ├── not-found.tsx      # 404 page
│   │   └── patio/[slug]/      # Dynamic patio pages
│   ├── components/             # React components
│   │   ├── Hero.tsx           # Hero section with skyline
│   │   ├── WeatherWidget.tsx  # Weather display with patio score
│   │   ├── PatioCard.tsx      # Patio listing card
│   │   ├── PatioMap.tsx       # Interactive map view
│   │   ├── PatioDetail.tsx    # Individual patio page
│   │   ├── Filters.tsx        # Search and filter controls
│   │   └── HiddenGems.tsx     # Hidden gems section
│   ├── data/
│   │   └── patios.ts          # Patio database (25+ locations)
│   └── lib/
│       ├── weather.ts         # Weather API & scoring logic
│       └── utils.ts           # Utility functions
├── public/                     # Static assets
├── README.md
└── LICENSE
```

## 🗺️ Featured Patios

The app includes 25+ real Calgary patios including:

- **River Cafe** - Iconic riverside dining on Prince's Island
- **The Guild** - Downtown's stylish gastropub with fire pits
- **Home & Away** - Kensington's cozy backyard vibes
- **National on 17th** - People-watching paradise
- **Bitter Southerner** - Southern comfort in Inglewood
- **Proof** - Hidden courtyard cocktail bar
- **Protector** - Modern Mexican in Kensington
- **The Ranch** - Rooftop with skyline views

And many more across neighborhoods like Downtown, Beltline, Mission, Kensington, Inglewood, East Village, and Ramsay.

## 🌡️ Patio Weather Score Algorithm

The "Patio Weather Score" (0-100) is calculated using:

| Factor | Weight | Criteria |
|--------|--------|----------|
| Temperature | 40% | Ideal: 20-26°C, Good: 15-30°C, OK: 10-32°C |
| Wind | 25% | Calm: 0-10 km/h, Breezy: 10-30 km/h, Windy: 30+ km/h |
| Precipitation | 25% | Based on current rain and probability |
| Comfort | 10% | Humidity, UV index, "feels like" variance |

## 📱 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Weather API**: Open-Meteo (free, no API key required)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Add more patios to the database
2. Improve the weather scoring algorithm
3. Add new features (reservations integration, reviews, etc.)
4. Fix bugs or improve documentation

### Adding a New Patio

Edit `src/data/patios.ts` and add a new entry following the existing schema:

```typescript
{
  id: 'your-patio-id',
  name: 'Patio Name',
  slug: 'patio-name',
  description: 'Description...',
  address: '123 Street SW',
  neighborhood: 'Beltline',
  coordinates: { lat: 51.0447, lng: -114.0719 },
  features: {
    heated: true,
    covered: false,
    dogFriendly: true,
    sunsetView: false,
    hasLive: false,
    servesFood: true,
    servesCocktails: true,
    reservations: true
  },
  cuisine: ['Canadian', 'Gastropub'],
  priceRange: '$$',
  hours: { ... },
  photos: [],
  website: 'https://example.com',
  phone: '(403) 123-4567',
  highlights: ['Feature 1', 'Feature 2'],
  hiddenGem: false,
  yearRound: true
}
```

## 📄 License

This project is open source under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Icons by [Lucide](https://lucide.dev/)
- Built with love in Calgary, AB 🇨🇦

---

**Made with ☀️ in Calgary**

*Find your perfect patio today!*