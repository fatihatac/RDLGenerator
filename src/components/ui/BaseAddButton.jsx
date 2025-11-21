function BaseAddItemButton({ icon, iconColor, bgColor, title, description, onClick, hoverBgColor, hoverBorderColor }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center p-3 ${bgColor} hover:${hoverBgColor} hover:border-${hoverBorderColor} border border-gray-200 rounded-lg transition-all text-left group`}
        >
            <div className={`p-2 rounded mr-3 ${iconColor} group-hover:${hoverBgColor}`}>
                {icon}
            </div>
            <div>
                <span className="block font-medium text-gray-700">{title}</span>
                <span className="text-xs text-gray-500">{description}</span>
            </div>
        </button>
    );
}

export default BaseAddItemButton

