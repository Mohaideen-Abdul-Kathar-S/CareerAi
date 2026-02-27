interface SkillTagProps {
  skill: string;
}

export function SkillTag({ skill }: SkillTagProps) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-900 border border-blue-200">
      {skill}
    </span>
  );
}
