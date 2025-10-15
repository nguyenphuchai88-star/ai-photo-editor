import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-800 border border-red-500 rounded-2xl p-8 text-center glassmorphism">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Rất tiếc! Đã xảy ra lỗi.</h1>
            <p className="text-lg text-gray-300 mb-6">
              Ứng dụng đã gặp phải một lỗi không mong muốn. Vui lòng kiểm tra chi tiết bên dưới. Đây có thể là sự cố cấu hình (như thiếu API key) hoặc sự cố mạng.
            </p>
            <div className="bg-slate-900 text-left p-4 rounded-lg overflow-auto max-h-60">
              <h2 className="text-xl font-semibold text-red-300 mb-2">Chi tiết lỗi:</h2>
              <pre className="text-sm text-red-200 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <details className="mt-4">
                    <summary className="cursor-pointer text-gray-400">Hiển thị Component Stack</summary>
                    <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                    </pre>
                </details>
              )}
            </div>
             <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            >
                Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
