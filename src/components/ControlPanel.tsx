import React, { useState, useRef } from 'react';
import { Tab, Hotspot } from '../types.ts';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

// Fix: Export the ControlPanelProps interface.
export interface ControlPanelProps {
  activeTab: Tab;
  onAIGenerate: (prompt: string, message: string) => Promise<void>;
  currentImage: string;
  onCropComplete: (newImage: string) => void;
  hotspot: Hotspot;
  clearHotspot: () => void;
}

const ActionButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors duration-200 flex-grow text-center"
    >
        {children}
    </button>
);

const GenerateButton: React.FC<{onClick: () => void, disabled?: boolean}> = ({ onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        <span>Generate</span>
    </button>
);


function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Failed to get canvas context'));
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
        resolve(canvas.toDataURL('image/png'));
    });
}

const CropPanel: React.FC<{ imageSrc: string; onCropComplete: (img: string) => void; }> = ({ imageSrc, onCropComplete }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>();
    const imgRef = useRef<HTMLImageElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, aspect || 16 / 9, width, height),
            width,
            height,
        );
        setCrop(newCrop);
    }
    
    async function handleApplyCrop() {
        if (completedCrop && imgRef.current) {
            const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop, "cropped.png");
            onCropComplete(croppedImageUrl);
        }
    }

    return (
        <div className="space-y-4">
            <div className="w-full h-96 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                 <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-full"
                >
                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} className="object-contain max-h-96"/>
                </ReactCrop>
            </div>
            <div className="flex gap-4">
                <div className="flex-grow flex gap-2">
                    <ActionButton onClick={() => setAspect(1/1)}>1:1</ActionButton>
                    <ActionButton onClick={() => setAspect(16/9)}>16:9</ActionButton>
                    <ActionButton onClick={() => setAspect(4/3)}>4:3</ActionButton>
                    <ActionButton onClick={() => setAspect(undefined)}>Free</ActionButton>
                </div>
                <button onClick={handleApplyCrop} disabled={!completedCrop} className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-500">
                    Apply Crop
                </button>
            </div>
        </div>
    );
};


export const ControlPanel: React.FC<ControlPanelProps> = ({ activeTab, onAIGenerate, currentImage, onCropComplete, hotspot, clearHotspot }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        let finalPrompt = prompt;
        if (activeTab === Tab.Retouch && hotspot) {
            finalPrompt = `${prompt} (at coordinates x: ${hotspot.x.toFixed(2)}%, y: ${hotspot.y.toFixed(2)}%)`;
        }
        onAIGenerate(finalPrompt, "Performing AI magic...");
        setPrompt('');
        clearHotspot();
    };
    
    const handlePreset = (presetPrompt: string, message: string) => {
        onAIGenerate(presetPrompt, message);
    };

    const renderPanel = () => {
        switch (activeTab) {
            case Tab.Retouch:
                return (
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={hotspot ? "Describe change at hotspot (e.g. 'make shirt red')" : "Click on image to select area, then describe change"}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <GenerateButton onClick={handleGenerate} disabled={!prompt || !hotspot} />
                    </div>
                );
            case Tab.Adjust:
                return (
                    <div className="space-y-3">
                         <div className="flex gap-2 flex-wrap">
                            <ActionButton onClick={() => handlePreset('Professionally blur the background, keeping the main subject sharp.', 'Blurring background...')}>Làm mờ hậu cảnh</ActionButton>
                            <ActionButton onClick={() => handlePreset('Increase the detail and sharpness of the entire image.', 'Enhancing details...')}>Tăng cường chi tiết</ActionButton>
                            <ActionButton onClick={() => handlePreset('Apply a warmer, golden hour lighting effect to the image.', 'Applying warm light...')}>Ánh sáng ấm hơn</ActionButton>
                            <ActionButton onClick={() => handlePreset('Apply professional studio lighting to the main subject.', 'Applying studio light...')}>Ánh sáng studio</ActionButton>
                        </div>
                        <div className="flex gap-4 items-center">
                             <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Or describe your own adjustment..." className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <GenerateButton onClick={handleGenerate} disabled={!prompt} />
                        </div>
                    </div>
                );
            case Tab.Filters:
                return (
                     <div className="space-y-3">
                        <div className="flex gap-2 flex-wrap">
                           <ActionButton onClick={() => handlePreset('Apply a synthwave aesthetic filter, with neon pinks and blues.', 'Applying Synthwave filter...')}>Synthwave</ActionButton>
                           <ActionButton onClick={() => handlePreset('Transform the image into an anime art style.', 'Applying Anime filter...')}>Anime</ActionButton>
                           <ActionButton onClick={() => handlePreset('Apply a Lomo photography effect with vignetting and saturated colors.', 'Applying Lomo filter...')}>Lomo</ActionButton>
                           <ActionButton onClick={() => handlePreset('Apply a digital glitch effect.', 'Applying Glitch filter...')}>Glitch</ActionButton>
                        </div>
                         <div className="flex gap-4 items-center">
                             <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Or describe your own filter..." className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <GenerateButton onClick={handleGenerate} disabled={!prompt} />
                        </div>
                    </div>
                );
            case Tab.Crop:
                return <CropPanel imageSrc={currentImage} onCropComplete={onCropComplete} />;
        }
    };

    return <div className="p-4 rounded-b-2xl glassmorphism">{renderPanel()}</div>;
};
