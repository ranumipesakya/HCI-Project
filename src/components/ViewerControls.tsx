import { Box, Maximize2, Video } from 'lucide-react';

interface ViewerControlsProps {
  onPresetClick: (preset: 'front' | 'side' | 'top' | 'perspective') => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export function ViewerControls({
  onPresetClick,
  autoRotate,
  onToggleAutoRotate
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#2d2926]/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/10">
      <button
        onClick={() => onPresetClick('front')}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Front View">
        <Box className="w-5 h-5" />
      </button>
      <button
        onClick={() => onPresetClick('side')}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Side View">
        <Video className="w-5 h-5" />
      </button>
      <button
        onClick={() => onPresetClick('top')}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Top View">
        <Maximize2 className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-white/20 mx-1" />
      <button
        onClick={onToggleAutoRotate}
        className={`p-2 rounded-full transition-colors flex items-center gap-2 px-4 ${autoRotate ? 'bg-[#7d8c6e] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        <span className="text-sm font-medium">Auto</span>
      </button>
    </div>
  );
}
