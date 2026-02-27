import { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UploadPageProps {
  onStartScreening: (payload: {
    files: File[];
    jobRole?: string;
    jobDescription?: string;
  }) => Promise<void>;
}

export function UploadPage({ onStartScreening }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...droppedFiles].slice(0, 50));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf'
      );
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 50));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleStartScreening = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await onStartScreening({
        files,
        jobRole,
        jobDescription,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while analyzing resumes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">

        {/* Section 1: Multi Resume Upload Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Candidate Resumes</h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging
                ? 'border-[#2563EB] bg-blue-50'
                : 'border-gray-300 hover:border-[#2563EB] hover:bg-gray-50'
              }`}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700 mb-2">
                Upload multiple resumes (PDF only)
              </p>
              <p className="text-gray-500">
                Up to 50 files supported
              </p>
            </label>
          </div>

          {/* File List Preview */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-gray-700 mb-3">Uploaded Files ({files.length})</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#2563EB]" />
                      <span className="text-gray-700">{file.name}</span>
                      <span className="text-gray-400 text-sm">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <Button
              className="w-full mt-6 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white h-12 text-base rounded-xl shadow-lg"
              onClick={() => {
                // Scroll to job role section
                document.getElementById('job-role-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Proceed to Screening
            </Button>
          )}
        </div>

        {/* Section 2: Job Role Selection */}
        <div id="job-role-section" className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Job Role for Screening</h2>

          <div className="space-y-6">
            {/* Option 1: Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option 1: Select Job Role
              </label>
              <Select value={jobRole} onValueChange={setJobRole}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Choose a job role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Option 2: Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option 2: Paste Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="min-h-[150px] rounded-xl"
              />
            </div>

            {/* Start Screening Button */}
            <Button
              onClick={handleStartScreening}
              disabled={files.length === 0 || (!jobRole && !jobDescription) || isLoading}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white h-12 text-base rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI is analyzing resumes...
                </>
              ) : (
                'Start AI Screening'
              )}
            </Button>

            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
