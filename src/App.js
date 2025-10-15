import React, { useState, useCallback } from "https://esm.sh/react@18.2.0";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Editor } from "./components/Editor";
import { useImageHistory } from "./hooks/useImageHistory";
import { Tab } from "./types";
import { editImageWithGemini } from "./services/geminiService";
import { Spinner } from "./components/Spinner";

const App = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("AI is thinking...");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(Tab.Retouch);

  const {
    currentImage,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    initializeHistory,
  } = useImageHistory();

  const handleImageUpload = useCallback(
    (image) => {
      setOriginalImage(image);
      initializeHistory(image.dataUrl);
      setActiveTab(Tab.Retouch);
      setError(null);
    },
    [initializeHistory]
  );

  const handleNewImage = () => {
    setOriginalImage(null);
  };

  const handleAIGeneration = useCallback(
    async (prompt, message) => {
      if (!currentImage || !originalImage) return;

      setIsLoading(true);
      setLoadingMessage(message);
      setError(null);
      try {
        const base64Data = currentImage.split(",")[1];
        const newImageBase64 = await editImageWithGemini(
          base64Data,
          originalImage.mimeType,
          prompt
        );
        const newImageDataUrl = `data:${originalImage.mimeType};base64,${newImageBase64}`;
        push(newImageDataUrl);
      } catch (err) {
        setError(err?.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentImage, originalImage, push]
  );

  return (
    React.createElement(
      "div",
      { className: "min-h-screen bg-transparent text-gray-200" },
      isLoading &&
        React.createElement(Spinner, { message: loadingMessage }),
      React.createElement(
        "main",
        { className: "container mx-auto p-4 md:p-8 relative z-10" },
        !originalImage || !currentImage
          ? React.createElement(WelcomeScreen, {
              onImageUpload: handleImageUpload,
            })
          : React.createElement(Editor, {
              originalImage: originalImage,
              currentImage: currentImage,
              activeTab: activeTab,
              setActiveTab: setActiveTab,
              onAIGenerate: handleAIGeneration,
              onCropComplete: push,
              toolbarProps: {
                undo,
                redo,
                reset: () => reset(originalImage.dataUrl),
                canUndo,
                canRedo,
                onNewImage: handleNewImage,
                imageName: originalImage.name,
                currentImage,
              },
              error: error,
              clearError: () => setError(null),
            })
      )
    )
  );
};

export default App;
