function Alert({ type, message }) {
    function getStyles() {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-100 border-green-400',
                    textColor: 'text-green-700',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ),
                };
            case 'error':
                return {
                    bgColor: 'bg-red-100 border-red-400',
                    textColor: 'text-red-700',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    ),
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-100 border-yellow-400',
                    textColor: 'text-yellow-700',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.493 2.897-1.493 3.662 0l7.332 14.28c.767 1.494-.286 3.099-1.832 3.099H2.757c-1.546 0-2.6-1.605-1.832-3.099l7.332-14.28zM10 13a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    ),
                };
            case 'info':
            default:
                return {
                    bgColor: 'bg-blue-100 border-blue-400',
                    textColor: 'text-blue-700',
                    icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    ),
                };
        }
    };

    const { bgColor, textColor, icon } = getStyles();

    return (
        <div
            className={`p-4 border-l-4 rounded-md shadow-lg ${bgColor} ${textColor} flex items-start space-x-3`}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">{icon}</div> {/* İkon alanı */}
            <p className="font-medium text-sm leading-snug">
                {message} {/* Mesaj içeriği */}
            </p>
        </div>
    );
};

export default Alert;