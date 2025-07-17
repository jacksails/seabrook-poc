# Seabrook Rumble - Crisp Flavour Predictor

A fun, browser-based proof of concept that recommends Seabrook crisp flavours based on the sound of your stomach rumble! 🥔🎤

**✨ Brilliant by the bagful ✨** - Britain's original crinkle cut meets advanced audio analysis.

## What It Does

This Next.js application uses the Web Audio API to analyze audio files (your stomach rumbles) and maps key characteristics like volume, pitch, and duration to a 2D coordinate grid. Each authentic Seabrook flavour is positioned in specific zones on this grid, and the app uses a nearest-neighbour approach to find your perfect crisp match.

**Featuring authentic Seabrook flavours:**
- **Beefy** - Rich, meaty crinkle cut goodness
- **Prawn Cocktail** - Yorkshire's favourite since 1979  
- **Cheese & Onion** - The classic combination
- **Sea Salt & Vinegar** - Sharp and tangy perfection
- **Sea Salted** - Pure potato simplicity

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd seabrook-poc
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Environment Variables

Copy `env.example` to `.env.local` and configure:

- `NODE_ENV` - Set to 'development' for local development
- Additional variables are included for future AI/database features

## Features

### 🎵 Audio Analysis
- Upload audio files (.wav, .mp3, .m4a, etc.)
- Web Audio API extracts:
  - Average volume (RMS)
  - Dominant pitch (via zero-crossing rate)
  - Sound duration
- Real-time waveform visualization during processing

### 🎯 Flavour Mapping
- 2D coordinate grid mapping:
  - X-axis: Pitch (low → high frequency)  
  - Y-axis: Volume (quiet → loud)
- Predefined zones for each Seabrook flavour:
  - **Beefy**: Low pitch, High volume
  - **Prawn Cocktail**: High pitch, Low volume
  - **Cheese & Onion**: Mid pitch, Mid volume
  - **Salt & Vinegar**: High pitch, High volume
  - **Plain**: Low pitch, Low volume

### 🎨 Modern UI/UX
- Tailwind CSS + shadcn/ui components
- Framer Motion micro-animations
- Drag-and-drop file upload
- Responsive design
- Visual feedback during processing
- Interactive results with analysis breakdown

## Technical Architecture

```
seabrook-poc/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── AudioUploader.tsx  # File upload with drag-and-drop
│   ├── WaveformVisualizer.tsx  # Audio visualization
│   └── FlavourResult.tsx  # Results display
├── lib/                   # Utility libraries
│   ├── analyseAudio.ts    # Web Audio API analysis logic
│   └── utils.ts           # Tailwind className utilities
├── data/                  # Static data
│   └── flavours.ts        # Seabrook flavours and grid mapping
└── package.json           # Dependencies and scripts
```

## Scripts

- `pnpm dev` - Start development server with automatic port management
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript checks

## Reference Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com)

## Future Enhancements

- Real-time audio recording from microphone
- Advanced pitch detection using FFT libraries
- Machine learning model training on actual rumble data
- Social sharing of flavour recommendations
- Integration with actual Seabrook product catalog

---

**Built with**: Next.js 14, TypeScript, Tailwind CSS, Web Audio API, and a sense of humor! 🚀 