'use client';

interface SequencerGridProps {
  tracks: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  steps: number;
  sequence: Record<string, boolean[]>;
  onStepToggle: (trackId: string, stepIndex: number) => void;
  currentStep: number;
  isPlaying: boolean;
}

export default function SequencerGrid({
  tracks,
  steps,
  sequence,
  onStepToggle,
  currentStep,
  isPlaying,
}: SequencerGridProps) {
  return (
    <div className="bg-white rounded-r-[4px] p-6 flex flex-col gap-6">
      {tracks.map((track, trackIndex) => (
        <div key={track.id} className="flex gap-6 items-center">
          {Array.from({ length: steps }, (_, stepIndex) => {
            const isActive = sequence[track.id]?.[stepIndex] || false;
            const isCurrent = isPlaying && currentStep === stepIndex;

            return (
              <button
                key={stepIndex}
                onClick={() => onStepToggle(track.id, stepIndex)}
                className={`rounded-full w-[50px] h-[50px] border border-black/5 flex items-center justify-center transition-all ${
                  isActive
                    ? 'opacity-100'
                    : trackIndex === 0
                    ? 'opacity-100'
                    : 'opacity-20'
                }`}
                style={{
                  backgroundColor: isActive ? track.color : '#9a9a9a',
                  outline: isCurrent ? `2px solid ${track.color}` : 'none',
                  outlineOffset: '2px',
                }}
              >
                {isActive && (
                  <div className="w-3 h-3 rounded-[10px] bg-white/20 backdrop-blur-[2px]" />
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

