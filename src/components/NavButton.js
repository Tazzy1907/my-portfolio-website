import { Link } from 'react-router-dom';

const NavButton = ({ icon: Icon, label, to, color, active = false, size = 'default' }) => {
  const colorClasses = {
    teal: active 
      ? 'bg-[#2DD4BF] text-[#1E1E1E] ring-2 ring-[#5EEAD4]' 
      : 'bg-[#2DD4BF] text-[#1E1E1E] hover:bg-[#5EEAD4]',
    purple: active 
      ? 'bg-[#A855F7] text-white ring-2 ring-[#C084FC]' 
      : 'bg-[#A855F7] text-white hover:bg-[#C084FC]'
  };

  // Size variants - responsive with icon-only on very small screens for default size
  const sizeClasses = {
    default: 'px-3 py-2 sm:px-4 text-sm gap-2',
    large: 'px-5 py-2.5 text-base gap-2'
  };

  const iconSize = size === 'large' ? 18 : 16;

  return (
    <Link 
      to={to}
      className={`
        flex items-center rounded-lg font-semibold transition-all duration-200 font-mono
        ${sizeClasses[size]}
        ${colorClasses[color]}
        hover:scale-105
      `}
    >
      <Icon size={iconSize} />
      {/* Hide label on very small screens for default size buttons */}
      <span className={size === 'default' ? 'hidden sm:inline' : ''}>
        {label}
      </span>
    </Link>
  );
};

export default NavButton;

