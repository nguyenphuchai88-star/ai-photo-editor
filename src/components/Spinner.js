import React from "https://esm.sh/react@18.2.0";

export const Spinner = ({ message }) => {
  return React.createElement(
    "div",
    {
      className:
        "fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm",
    },
    React.createElement(
      "svg",
      {
        className: "animate-spin -ml-1 mr-3 h-12 w-12 text-purple-500",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
      },
      React.createElement("circle", {
        className: "opacity-25",
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        strokeWidth: "4",
      }),
      React.createElement("path", {
        className: "opacity-75",
        fill: "currentColor",
        d:
          "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
      })
    ),
    React.createElement(
      "p",
      { className: "mt-4 text-white text-lg font-semibold" },
      message
    )
  );
};
