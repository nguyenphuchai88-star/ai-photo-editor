import React, { useState, useRef } from "https://esm.sh/react@18.2.0";
import { Tab } from "../types";
import { TabNavigation } from "./TabNavigation";
import { ControlPanel } from "./ControlPanel";
import { Toolbar } from "./Toolbar";

const ImageHotspot = ({ hotspot }) => (
  React.createElement("div", {
    className:
      "absolute w-6 h-6 rounded-full bg-purple-500/50 border-2 border-white shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse",
    style: { left: `${hotspot.x}%`, top: `${hotspot.y}%` },
  })
);

export const Editor = (props) => {
  const [isComparing, setIsComparing] = useState(false);
  const [hotspot, setHotspot] = useState(null);
  const imageContainerRef = useRef(null);

  const handleImageClick = (e) => {
    if (props.activeTab !== Tab.Retouch || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHotspot({ x, y });
  };

  const tabNavProps = {
    activeTab: props.activeTab,
    setActiveTab: props.setActiveTab,
  };

  const controlPanelProps = {
    activeTab: props.activeTab,
    onAIGenerate: props.onAIGenerate,
    currentImage: props.currentImage,
    onCropComplete: props.onCropComplete,
    hotspot,
    clearHotspot: () => setHotspot(null),
  };

  const toolbarProps = {
    ...props.toolbarProps,
    isComparing,
    setIsComparing,
  };

  return React.createElement(
    "div",
    { className: "flex flex-col h-[calc(100vh-4rem)]" },
    React.createElement(
      "div",
      {
        className:
          "flex-grow flex flex-col md:flex-row gap-6 items-center justify-center overflow-hidden",
      },
      React.createElement(
        "div",
        {
          className:
            "relative w-full h-full max-h-[70vh] md:max-h-full flex-grow flex items-center justify-center glassmorphism rounded-2xl p-4",
        },
        React.createElement(
          "div",
          {
            ref: imageContainerRef,
            onClick: handleImageClick,
            className: "relative w-full h-full cursor-crosshair",
          },
          React.createElement("img", {
            src: isComparing
              ? props.originalImage.dataUrl
              : props.currentImage,
            alt: "User content",
            className: "object-contain w-full h-full",
          }),
          props.activeTab === Tab.Retouch &&
            hotspot &&
            React.createElement(ImageHotspot, { hotspot })
        )
      )
    ),
    React.createElement(
      "div",
      { className: "flex-shrink-0 mt-4" },
      props.error &&
        React.createElement(
          "div",
          {
            className:
              "bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 flex justify-between items-center",
          },
          React.createElement("span", null, props.error),
          React.createElement(
            "button",
            {
              onClick: props.clearError,
              className: "font-bold text-xl",
            },
            "×"
          )
        ),
      React.createElement(TabNavigation, tabNavProps),
      React.createElement(ControlPanel, controlPanelProps)
    ),
    React.createElement(Toolbar, toolbarProps)
  );
};
