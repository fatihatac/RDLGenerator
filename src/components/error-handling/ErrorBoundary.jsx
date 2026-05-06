import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uygulama hatası:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-red-50">
                    <div className="text-center p-8 max-w-md">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">
                            Beklenmedik bir hata oluştu
                        </h2>
                        <p className="text-gray-600 text-sm mb-6 font-mono bg-red-100 p-2 rounded">
                            {this.state.error?.message}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 mx-auto px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            <RefreshCw size={16} />
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;