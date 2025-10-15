
import React, { useState, useRef, MouseEvent } from 'react';
import { Tab, OriginalImage, Hotspot } from '../types.ts';
import { TabNavigation, TabNavigationProps } from './TabNavigation.tsx';
import { ControlPanel, ControlPanelProps } from './ControlPanel.tsx';
import { Toolbar, ToolbarProps } from './Toolbar.tsx';

interface EditorProps {
  originalImage: OriginalImage;
  currentImage: string;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAIGenerate: (prompt: string, message: string) => Promise<void>;
  onCropComplete: (newImage: string) => void;
  toolbarProps: Omit<ToolbarProps, 'isComparing' | 'setIsComparing'>;
  error: string | null;
  clearError: () => void;
}

const ImageHotspot: React.FC<{hotspot: NonNullable<Hotspot>}> = ({ hotspot }) => (
    <div
        className="absolute w-6 h-6 rounded-full bg-purple-500/50 border-2 border-white shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    />
);

export const Editor: React.FC<EditorProps> = (props) => {
  const [isComparing, setIsComparing] = useState(false);
  const [hotspot, setHotspot] = useState<Hotspot>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (props.activeTab !== Tab.Retouch || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHotspot({ x, y });
  };
  
  const tabNavProps: TabNavigationProps = { activeTab: props.activeTab, setActiveTab: props.setActiveTab };
  const controlPanelProps: ControlPanelProps = { 
    activeTab: props.activeTab, 
    onAIGenerate: props.onAIGenerate,
    currentImage: props.currentImage,
    onCropComplete: props.onCropComplete,
    hotspot,
    clearHotspot: () => setHotspot(null),
  };
  const toolbarProps: ToolbarProps = { ...props.toolbarProps, isComparing, setIsComparing };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-grow flex flex-col md:flex-row gap-6 items-center justify-center overflow-hidden">
        {/* Image Display */}
        <div className="relative w-full h-full max-h-[70vh] md:max-h-full flex-grow flex items-center justify-center glassmorphism rounded-2xl p-4">
          <div ref={imageContainerRef} onClick={handleImageClick} className="relative w-full h-full cursor-crosshair">
            <img
              src={isComparing ? props.originalImage.dataUrl : props.currentImage}
              alt="User content"
              className="object-contain w-full h-full"
            />
            {props.activeTab === Tab.Retouch && hotspot && <ImageHotspot hotspot={hotspot} />}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-4">
        {props.error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 flex justify-between items-center">
                <span>{props.error}</span>
                <button onClick={props.clearError} className="font-bold text-xl">&times;</button>
            </div>
        )}
        <TabNavigation {...tabNavProps} />
        <ControlPanel {...controlPanelProps} />
      </div>
      <Toolbar {...toolbarProps} />
    </div>
  );
};
