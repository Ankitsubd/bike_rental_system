
const PrimaryButton =({children, onClick, type = 'button', disabled, className }) =>{
    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
            transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}>
                {children}
            </button>
    )
}

export  default PrimaryButton;