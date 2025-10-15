import React, { Component } from "https://esm.sh/react@18.2.0";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        "div",
        {
          className:
            "min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4",
        },
        React.createElement(
          "div",
          {
            className:
              "w-full max-w-2xl bg-slate-800 border border-red-500 rounded-2xl p-8 text-center glassmorphism",
          },
          React.createElement(
            "h1",
            { className: "text-3xl font-bold text-red-400 mb-4" },
            "Rất tiếc! Đã xảy ra lỗi."
          ),
          React.createElement(
            "p",
            { className: "text-lg text-gray-300 mb-6" },
            "Ứng dụng đã gặp phải lỗi không mong muốn. Vui lòng kiểm tra chi tiết bên dưới. Đây có thể là sự cố cấu hình (thiếu API key) hoặc sự cố mạng."
          ),
          React.createElement(
            "div",
            {
              className:
                "bg-slate-900 text-left p-4 rounded-lg overflow-auto max-h-60",
            },
            React.createElement(
              "h2",
              { className: "text-xl font-semibold text-red-300 mb-2" },
              "Chi tiết lỗi:"
            ),
            React.createElement(
              "pre",
              {
                className:
                  "text-sm text-red-200 whitespace-pre-wrap",
              },
              this.state.error ? this.state.error.toString() : ""
            ),
            this.state.errorInfo &&
              React.createElement(
                "details",
                { className: "mt-4" },
                React.createElement(
                  "summary",
                  {
                    className: "cursor-pointer text-gray-400",
                  },
                  "Hiển thị Component Stack"
                ),
                React.createElement(
                  "pre",
                  {
                    className:
                      "mt-2 text-xs text-gray-500 whitespace-pre-wrap",
                  },
                  this.state.errorInfo.componentStack
                )
              )
          ),
          React.createElement(
            "button",
            {
              onClick: () => window.location.reload(),
              className:
                "mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105",
            },
            "Tải lại ứng dụng"
          )
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
