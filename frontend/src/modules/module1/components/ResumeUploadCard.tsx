import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

interface ResumeUploadCardProps {
  resumeFile: File | null;
  onFileChange: (file: File | null) => void;
}

export function ResumeUploadCard({ resumeFile, onFileChange }: ResumeUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) { // 5MB
          onFileChange(file);
        } else {
          alert('File size must be less than 5MB');
        }
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) {
          onFileChange(file);
        } else {
          alert('File size must be less than 5MB');
        }
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/60 transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Upload Resume
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : resumeFile
            ? 'border-green-300 bg-green-50/30'
            : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {resumeFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{resumeFile.name}</p>
              <p className="text-sm text-slate-500">
                {(resumeFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="mt-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">
                Upload your resume (PDF only)
              </p>
              <p className="text-sm text-slate-500">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Max file size: 5MB
      </p>
    </div>
  );
}
