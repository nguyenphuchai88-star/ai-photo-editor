
import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { Editor } from './components/Editor.tsx';
import { useImageHistory } from './hooks/useImageHistory.ts';
import { Tab, OriginalImage } from './types.ts';
import { editImageWithGemini } from './services/geminiService.ts';
import { Spinner } from './components/Spinner.tsx';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('AI is thinking...');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Retouch);
  
  const { currentImage, push, undo, redo, reset, canUndo, canRedo, initializeHistory } = useImageHistory();

  const handleImageUpload = useCallback((image: OriginalImage) => {
    setOriginalImage(image);
    initializeHistory(image.dataUrl);
    setActiveTab(Tab.Retouch);
    setError(null);
  }, [initializeHistory]);

  const handleNewImage = () => {
    setOriginalImage(null);
  };

  const handleAIGeneration = useCallback(async (prompt: string, message: string) => {
    if (!currentImage || !originalImage) return;

    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);
    try {
      const base64Data = currentImage.split(',')[1];
      const newImageBase64 = await editImageWithGemini(base64Data, originalImage.mimeType, prompt);
      const newImageDataUrl = `data:${originalImage.mimeType};base64,${newImageBase64}`;
      push(newImageDataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, originalImage, push]);
  
  return (
    <div className="min-h-screen bg-transparent text-gray-200">
      {isLoading && <Spinner message={loadingMessage} />}
      <main className="container mx-auto p-4 md:p-8 relative z-10">
        {!originalImage || !currentImage ? (
          <WelcomeScreen onImageUpload={handleImageUpload} />
        ) : (
          <Editor
            originalImage={originalImage}
            currentImage={currentImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAIGenerate={handleAIGeneration}
            onCropComplete={push}
            toolbarProps={{
              undo,
              redo,
              reset: () => reset(originalImage.dataUrl),
              canUndo,
              canRedo,
              onNewImage: handleNewImage,
              imageName: originalImage.name,
              currentImage,
            }}
            error={error}
            clearError={() => setError(null)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
