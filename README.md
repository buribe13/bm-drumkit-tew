# Drum Machine Interface

An interactive drum sequencer built with Next.js, React, and TailwindCSS. Inspired by Teenage Engineering design aesthetics.

## Features

- **16-step sequencer** with 4 tracks (Kick, Snare, HiHat, Cowbell)
- **Interactive rotary knobs** for Tempo, Volume, and LFO control
- **Waveform viewer** with visual feedback
- **Track selector** with sample browser
- **Play/Stop controls** with tempo-synced playback
- **Real-time audio playback** using Web Audio API

## Getting Started

### Installation

First, install the dependencies:

```bash
npm install
```

If you encounter npm cache issues, you may need to fix permissions:

```bash
sudo chown -R $(whoami) ~/.npm
```

Then try installing again:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the drum machine.

## Adding Your Own Drum Samples

To use your own drum kit samples:

1. Place your `.wav` files in the `public/sounds/` directory
2. Name them as follows:
   - `kick.wav` - Kick drum sample
   - `snare.wav` - Snare drum sample
   - `hihat.wav` - Hi-hat sample
   - `cowbell.wav` - Cowbell sample

3. The application will automatically load these files when available. If a file is not found, it will fall back to generated placeholder sounds.

### Supported Audio Formats

- `.wav` files are recommended for best compatibility
- Files should be mono or stereo
- Sample rate: 44.1kHz is recommended

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Roboto Condensed font
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── DrumMachine.tsx     # Main drum machine component
│   ├── WaveformViewer.tsx  # Waveform display component
│   ├── RotaryKnob.tsx      # Interactive rotary knob component
│   ├── TrackSelector.tsx   # Track selection and sample browser
│   ├── SequencerGrid.tsx   # 16-step sequencer grid
│   ├── PlaybackControls.tsx # Play/Stop buttons
│   └── DrumIcons.tsx       # SVG icons for drum instruments
└── public/
    └── sounds/             # Place your .wav files here
```

## Usage

1. **Select a track**: Click on one of the colored buttons on the left to select a track
2. **Choose a sample**: When a track is selected, a menu will appear showing available samples
3. **Program a pattern**: Click on the sequencer grid to toggle steps on/off
4. **Adjust tempo**: Drag the Tempo knob to change playback speed (60-180 BPM)
5. **Control volume**: Use the Volume knob to adjust overall output level
6. **Play**: Click the Play button to start the sequencer
7. **Stop**: Click the Stop button to stop playback

## Design

The interface is designed to match the Teenage Engineering aesthetic with:
- Roboto Condensed font at 13px
- Minimalist color palette
- Clean, functional UI elements
- Precise spacing and shadows matching the Figma design

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Web Audio API** - Audio playback and synthesis

## License

This project is for personal use.
