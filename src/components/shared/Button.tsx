import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'alert'; // Determines the color scheme
  onClick?: () => void; // Optional click handler
  disabled?: boolean; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  onClick,
  disabled = false, // Default to false
}) => {
  // Define classes based on variant
  const baseClasses =
    'px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none';

  const variantClasses = {
    primary: 'bg-[#20A4F3] text-white hover:bg-[#1E90E0]',
    secondary: 'bg-[#2EC4B6] text-white hover:bg-[#29B3A5]',
    alert: 'bg-[#FF3366] text-white hover:bg-[#FF0033]',
  };

  const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${
        disabled ? disabledClasses : variantClasses[variant]
      }`}
      onClick={disabled ? undefined : onClick} // Disable onClick when button is disabled
      disabled={disabled} // Apply disabled attribute
    >
      {text}
    </button>
  );
};

export default Button;
