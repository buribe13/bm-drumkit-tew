'use client';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export default function PlaybackControls({
  isPlaying,
  onPlay,
  onStop,
}: PlaybackControlsProps) {
  return (
    <div className="flex gap-3 items-start">
      <button
        onClick={isPlaying ? onStop : onPlay}
        className="bg-[#ececec] rounded-[4px] p-3 flex flex-col items-center gap-2.5"
      >
        <div className="w-[89px] h-[89px] border-[0.5px] border-white/25 rounded-full flex items-center justify-center">
          {isPlaying ? (
            <div className="w-5 h-5 bg-[#9a9a9a] rounded-[1px]" />
          ) : (
            <div className="w-0 h-0 border-l-[12px] border-l-[#9a9a9a] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
          )}
        </div>
      </button>
      <button
        onClick={onStop}
        className="bg-[#ececec] rounded-[4px] p-3 flex flex-col items-center gap-2.5"
      >
        <div className="w-[89px] h-[89px] border-[0.5px] border-white/25 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-[#9a9a9a] rounded-[1px]" />
        </div>
      </button>
    </div>
  );
}

