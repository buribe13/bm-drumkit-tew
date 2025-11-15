'use client';

import { useState } from 'react';
import { BassIcon, SnareIcon, HiHatIcon, CowbellIcon } from './DrumIcons';

interface Track {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface TrackSelectorProps {
  tracks: Track[];
  selectedTrack: string;
  onTrackSelect: (trackId: string) => void;
  onSampleSelect?: (sampleName: string) => void;
}

export default function TrackSelector({
  tracks,
  selectedTrack,
  onTrackSelect,
  onSampleSelect,
}: TrackSelectorProps) {
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const selectedTrackData = tracks.find((t) => t.id === selectedTrack);

  const samples = Array.from({ length: 8 }, (_, i) => `${selectedTrackData?.name || 'Kick'} ${i + 1}`);

  return (
    <div className="flex items-center rounded-[12px]">
      <div className="border border-white rounded-l-[4px] bg-transparent flex flex-col gap-6 p-6 border-solid">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              onTrackSelect(track.id);
              if (track.id === selectedTrack) {
                setShowSampleMenu(!showSampleMenu);
              } else {
                setShowSampleMenu(true);
              }
            }}
            className={`rounded-full w-[50px] h-[50px] border border-black/5 flex items-center justify-center transition-opacity ${
              track.id === selectedTrack
                ? 'opacity-100'
                : 'opacity-20 hover:opacity-40'
            }`}
            style={{ backgroundColor: track.color }}
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">
              {track.icon}
            </div>
          </button>
        ))}
      </div>

      {showSampleMenu && selectedTrackData && (
        <div className="bg-white/40 backdrop-blur-[6px] rounded-[4px] shadow-[0px_1px_16px_1px_rgba(0,0,0,0.1)] p-3 flex flex-col gap-3">
          <p className="text-[#9a9a9a] text-[12px] font-normal leading-none">
            Select {selectedTrackData.name}
          </p>
          <div className="flex flex-col gap-0.5">
            {samples.map((sample, index) => (
              <button
                key={index}
                onClick={() => onSampleSelect?.(sample)}
                className="flex items-center justify-center gap-2.5 hover:bg-white/20 rounded px-2 py-1"
              >
                <p className="text-[12px] font-normal leading-[0.92] text-black">
                  {sample}
                </p>
                <div className="bg-[#1d1d1d] p-1 rounded">
                  <div className="w-[17px] h-[9px] bg-[#00ED95] rounded-sm" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

