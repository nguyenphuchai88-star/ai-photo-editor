
import React from 'react';

const UndoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 009 9V5" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 00-5 5v2" /></svg>;
const CompareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L4 20M7 16l3 4m6-16v12m0-12L13 4m3 0l3-4" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-5.26M20 15a9 9 0 01-14.13 5.26" /></svg>;
const NewImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;


interface ToolButtonProps {
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ onClick, onMouseDown, onMouseUp, onMouseLeave, disabled, children, tooltip }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className="p-3 bg-slate-800/80 rounded-lg text-gray-300 hover:bg-purple-600 hover:text-white disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
    >
      {children}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {tooltip}
    </div>
  </div>
);


export interface ToolbarProps {
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onNewImage: () => void;
  imageName: string;
  currentImage: string;
  isComparing: boolean;
  setIsComparing: (isComparing: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ undo, redo, reset, canUndo, canRedo, onNewImage, imageName, currentImage, setIsComparing }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `edited-${imageName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-20">
        <div className="container mx-auto p-3 flex justify-between items-center rounded-2xl glassmorphism">
            <div className="flex items-center gap-2">
                <ToolButton onClick={undo} disabled={!canUndo} tooltip="Undo"><UndoIcon /></ToolButton>
                <ToolButton onClick={redo} disabled={!canRedo} tooltip="Redo"><RedoIcon /></ToolButton>
            </div>
            <div className="flex items-center gap-2">
                 <ToolButton
                    onMouseDown={() => setIsComparing(true)}
                    onMouseUp={() => setIsComparing(false)}
                    onMouseLeave={() => setIsComparing(false)}
                    tooltip="Compare (Hold)"
                >
                    <CompareIcon />
                </ToolButton>
                <ToolButton onClick={reset} disabled={!canUndo} tooltip="Reset"><ResetIcon /></ToolButton>
            </div>
            <div className="flex items-center gap-2">
                <ToolButton onClick={onNewImage} tooltip="New Image"><NewImageIcon /></ToolButton>
                <ToolButton onClick={handleDownload} tooltip="Download"><DownloadIcon /></ToolButton>
            </div>
        </div>
    </div>
  );
};
