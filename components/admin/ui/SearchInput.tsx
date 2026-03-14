import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  debounceMs = 300,
  className = ''
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the change event
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange(''); // Dispatch immediate clear
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#8B949E]" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-[#30363D] rounded-lg leading-5 bg-[#0D0F14] text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] sm:text-sm transition-colors"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
