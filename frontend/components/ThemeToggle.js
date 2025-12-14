import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 border ${theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-orange-500 border-gray-200 hover:bg-gray-100 shadow-md'
                }`}
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
    );
}
