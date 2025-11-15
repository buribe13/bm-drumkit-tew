'use client';

import { useState, useEffect, useRef } from 'react';
import WaveformViewer from './WaveformViewer';
import RotaryKnob from './RotaryKnob';
import TrackSelector from './TrackSelector';
import SequencerGrid from './SequencerGrid';
import PlaybackControls from './PlaybackControls';
import { BassIcon, SnareIcon, HiHatIcon, CowbellIcon } from './DrumIcons';

const TRACKS = [
  { id: 'kick', name: 'Kick', color: '#00ac6a', icon: <BassIcon /> },
  { id: 'snare', name: 'Snare', color: '#e6e65e', icon: <SnareIcon /> },
  { id: 'hihat', name: 'HiHat', color: '#f489a0', icon: <HiHatIcon /> },
  { id: 'cowbell', name: 'Cowbell', color: '#00475b', icon: <CowbellIcon /> },
];

const STEPS = 16;

export default function DrumMachine() {
  const [selectedTrack, setSelectedTrack] = useState('kick');
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(80);
  const [lfo, setLfo] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequence, setSequence] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {};
    TRACKS.forEach((track) => {
      initial[track.id] = new Array(STEPS).fill(false);
    });
    // Set some default pattern
    initial['kick'][0] = true;
    initial['kick'][4] = true;
    initial['kick'][8] = true;
    initial['kick'][12] = true;
    initial['snare'][4] = true;
    initial['snare'][12] = true;
    return initial;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Initialize audio context and load sounds
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Try to load sound files, fallback to generated sounds
    const loadSounds = async () => {
      const soundFiles: Record<string, string> = {
        kick: '/sounds/kick.wav',
        snare: '/sounds/snare.wav',
        hihat: '/sounds/hihat.wav',
        cowbell: '/sounds/cowbell.wav',
      };

      for (const [trackId, path] of Object.entries(soundFiles)) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
            audioBuffersRef.current[trackId] = audioBuffer;
          }
        } catch (error) {
          // File doesn't exist, will use generated sound
          console.log(`Sound file not found for ${trackId}, using generated sound`);
        }
      }
    };

    loadSounds();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play a sound for a track
  const playSound = (trackId: string) => {
    if (!audioContextRef.current) return;

    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = volume / 100;
    gainNode.connect(audioContextRef.current.destination);

    // If we have a loaded audio buffer, use it
    if (audioBuffersRef.current[trackId]) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffersRef.current[trackId];
      source.connect(gainNode);
      source.start();
      audioSourcesRef.current.push(source);
    } else {
      // Fallback to generated sound
      const oscillator = audioContextRef.current.createOscillator();
      const frequencies: Record<string, number> = {
        kick: 60,
        snare: 200,
        hihat: 800,
        cowbell: 400,
      };

      oscillator.type = trackId === 'kick' ? 'sine' : 'square';
      oscillator.frequency.value = frequencies[trackId] || 200;
      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  };

  // Sequencer playback
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / tempo / 4) * 1000; // 16th notes

      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % STEPS;

          // Play sounds for active steps
          TRACKS.forEach((track) => {
            if (sequence[track.id]?.[nextStep]) {
              playSound(track.id);
            }
          });

          return nextStep;
        });
      }, stepDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentStep(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tempo, sequence, volume]);

  const handleStepToggle = (trackId: string, stepIndex: number) => {
    setSequence((prev) => {
      const newSequence = { ...prev };
      if (!newSequence[trackId]) {
        newSequence[trackId] = new Array(STEPS).fill(false);
      }
      newSequence[trackId] = [...newSequence[trackId]];
      newSequence[trackId][stepIndex] = !newSequence[trackId][stepIndex];
      return newSequence;
    });
  };

  const handlePlay = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-[#d8d8d8] p-6 flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col gap-2.5 items-end w-full max-w-7xl">
        {/* Top section: Waveform and Knobs */}
        <div className="flex gap-3 items-end w-full">
          <div className="flex-1">
            <WaveformViewer />
          </div>
          <div className="flex gap-2.5">
            <RotaryKnob
              label="Tempo"
              color="#00ac6a"
              value={tempo}
              onChange={setTempo}
              min={60}
              max={180}
            />
            <RotaryKnob
              label="Volume"
              color="#e65ea7"
              value={volume}
              onChange={setVolume}
              min={0}
              max={100}
            />
            <RotaryKnob
              label="LFO"
              color="#4c9dfd"
              value={lfo}
              onChange={setLfo}
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Sequencer section */}
        <div className="flex items-center rounded-[12px] w-full">
          <TrackSelector
            tracks={TRACKS}
            selectedTrack={selectedTrack}
            onTrackSelect={setSelectedTrack}
          />
          <SequencerGrid
            tracks={TRACKS}
            steps={STEPS}
            sequence={sequence}
            onStepToggle={handleStepToggle}
            currentStep={currentStep}
            isPlaying={isPlaying}
          />
        </div>

        {/* Playback controls */}
        <div className="flex gap-3">
          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
}

