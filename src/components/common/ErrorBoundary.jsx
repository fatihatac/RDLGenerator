import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ---------------------------------------------------------------------------
// ErrorBoundary
// Render hatalarını yakalar; tüm uygulamanın çökmesini engeller.
// İki seviyede kullanılır:
//   1. App.jsx sarmalayıcısı (uygulama geneli)
//   2. ReportItemRenderer sarmalayıcısı (her item için izole)
// ---------------------------------------------------------------------------
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { fallback } = this.props;

    // Özel fallback verilmişse onu kullan
    if (fallback) return fallback;

    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertTriangle size={28} className="text-red-500" />
        <div>
          <p className="font-semibold text-red-700 text-sm">
            Bu bileşen yüklenirken bir hata oluştu.
          </p>
          {this.state.error && (
            <p className="text-xs text-red-500 mt-1 font-mono">
              {this.state.error.message}
            </p>
          )}
        </div>
        <button
          onClick={this.handleReset}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
        >
          <RefreshCw size={13} />
          Yeniden Dene
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
