import { Component } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Zap } from 'lucide-react';
import useReportStore from '../../store/useReportStore';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uygulama hatası:', error, errorInfo);
        this.setState({ errorInfo });
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Force a re-round to clear the error state
        window.dispatchEvent(new Event('resize'));
    };

    clearReport = () => {
        // Clear the report data to start fresh
        useReportStore.getState().resetReport();
        this.resetError();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-red-50">
                    <div className="text-center p-8 max-w-md">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">
                            Beklenmedik bir hata oluştu
                        </h2>
                        {this.state.errorInfo && (
                            <div className="text-left mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Teknik Detaylar
                                </h3>
                                <p className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded">
                                    {this.state.errorInfo.componentStack || ''}
                                </p>
                            </div>
                        )}
                        <p className="text-gray-600 text-sm mb-6 font-mono bg-red-100 p-2 rounded">
                            {this.state.error?.message}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 justify-center">
                            <button
                                onClick={this.clearReport}
                                className="flex items-center gap-2 w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Zap size={16} />
                                Raporunu Temizle
                            </button>
                            <button
                                onClick={this.resetError}
                                className="flex items-center gap-2 w-full sm:w-auto px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                <RefreshCw size={16} />
                                Sayfayı Yenile
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;