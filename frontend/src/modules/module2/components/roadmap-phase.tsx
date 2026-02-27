interface RoadmapPhaseProps {
  phase: string;
  title: string;
  items: string[];
}

export function RoadmapPhase({ phase, title, items }: RoadmapPhaseProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
          {phase}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
