import React from 'react';
import { Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface JobDescriptionCardProps {
  jobDescription: string;
  selectedRole: string;
  onJobDescriptionChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

const predefinedRoles = [
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'AI Engineer', label: 'AI Engineer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
];

export function JobDescriptionCard({
  jobDescription,
  selectedRole,
  onJobDescriptionChange,
  onRoleChange,
}: JobDescriptionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/60 transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-purple-600" />
        Job Description
      </h3>

      <div className="space-y-6">
        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paste Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-40 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none bg-slate-50/50 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Divider with OR */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-slate-500 font-medium">
              OR
            </span>
          </div>
        </div>

        {/* Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Predefined Role
          </label>
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full h-12 px-4 border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/50 transition-all">
              <SelectValue placeholder="Choose a role..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              {predefinedRoles.map((role) => (
                <SelectItem
                  key={role.value}
                  value={role.value}
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 rounded-lg"
                >
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
