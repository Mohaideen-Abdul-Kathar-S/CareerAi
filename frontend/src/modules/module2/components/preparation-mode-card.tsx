import { LucideIcon } from 'lucide-react';

interface PreparationModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function PreparationModeCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick
}: PreparationModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-transparent bg-clip-padding shadow-lg scale-105' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
          <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50" />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
        <div className={`
          p-3 rounded-xl transition-colors
          ${isSelected 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : 'bg-gray-100'
          }
        `}>
          <Icon className={`size-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
