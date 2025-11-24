function BaseAddItemButton({
    icon,
    title,
    description,
    onClick,
    className,
    iconClassName
}) {

    return (
        <button
            onClick={onClick}
            className={`flex items-center p-3 border border-gray-200 rounded-lg transition-all text-left group ${className}`}
        >
            <div className={`p-2 rounded mr-3 transition-colors ${iconClassName}`}>
                {icon}
            </div>
            <div>
                <span className="block font-medium text-gray-700">{title}</span>
                <span className="text-xs text-gray-500">{description}</span>
            </div>
        </button>
    );
}

export default BaseAddItemButton;


