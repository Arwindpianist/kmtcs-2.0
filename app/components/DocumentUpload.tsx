'use client';

import { useState, useRef } from 'react';
import TrainingCourseForm from './TrainingCourseForm';

interface ExtractedData {
  title: string;
  description: string;
  duration: string;
  price: number | null;
  objectives: string[];
  course_contents: string;
  target_audience: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
}

interface DocumentUploadProps {
  onDataExtracted: (data: ExtractedData) => void;
  onError: (error: string) => void;
}

export default function DocumentUpload({ onDataExtracted, onError }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    fileName: string;
    status: string;
    extractedData?: ExtractedData;
    errorMessage?: string;
  }>>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [currentExtractedData, setCurrentExtractedData] = useState<ExtractedData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        setUploadProgress((i / files.length) * 100);
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setUploadedFiles(prev => [...prev, {
            id: result.id,
            fileName: file.name,
            status: result.extractedData ? 'completed' : 'failed',
            extractedData: result.extractedData,
            errorMessage: result.errorMessage
          }]);

          if (result.extractedData) {
            setCurrentExtractedData(result.extractedData);
            setShowForm(true);
            onDataExtracted(result.extractedData);
          }
        } else {
          setUploadedFiles(prev => [...prev, {
            id: Date.now().toString(),
            fileName: file.name,
            status: 'failed',
            errorMessage: result.error
          }]);
          onError(result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadedFiles(prev => [...prev, {
          id: Date.now().toString(),
          fileName: file.name,
          status: 'failed',
          errorMessage: 'Upload failed'
        }]);
        onError('Upload failed');
      }
    }

    setUploadProgress(100);
    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        input.files = files;
        handleFileUpload({ target: { files } } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const clearUploads = () => {
    setUploadedFiles([]);
    setShowForm(false);
    setCurrentExtractedData(null);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSaving(true);
    try {
      // Save to training_courses table
      const { data, error } = await fetch('/api/training-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(res => res.json());

      if (error) {
        throw new Error(error);
      }

      // Update the uploaded file status
      setUploadedFiles(prev => prev.map(file => 
        file.extractedData?.title === formData.title 
          ? { ...file, status: 'saved' }
          : file
      ));

      setShowForm(false);
      setCurrentExtractedData(null);
      
    } catch (error) {
      console.error('Save error:', error);
      onError('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentExtractedData(null);
  };

  if (showForm && currentExtractedData) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Review and Edit Extracted Data
          </h3>
          <p className="text-blue-700">
            Please review and edit the extracted information from "{currentExtractedData.title}" before saving.
          </p>
        </div>
        
        <TrainingCourseForm
          initialData={{
            title: currentExtractedData.title,
            description: currentExtractedData.description,
            duration: currentExtractedData.duration,
            price: currentExtractedData.price,
            objectives: currentExtractedData.objectives,
            course_contents: currentExtractedData.course_contents,
            target_audience: currentExtractedData.target_audience,
            methodology: currentExtractedData.methodology,
            certification: currentExtractedData.certification,
            hrdcorp_approval_no: currentExtractedData.hrdcorp_approval_no,
            service_type: 'technical_training', // Default, can be changed
            status: true
          }}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isUploading 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Upload training documents</span>
              <input
                id="file-upload"
                ref={fileInputRef}
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".docx,.doc,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          
          <p className="text-xs text-gray-500">
            DOCX, DOC, or TXT files up to 10MB
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Processing... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>

      {/* Upload Results */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Upload Results</h3>
            <button
              onClick={clearUploads}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`p-3 rounded-lg border ${
                  file.status === 'completed' || file.status === 'saved'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {file.fileName}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        file.status === 'completed' || file.status === 'saved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {file.status === 'saved' ? 'saved' : file.status}
                    </span>
                  </div>
                </div>
                
                {file.status === 'completed' && file.extractedData && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Title:</strong> {file.extractedData.title || 'Not found'}</p>
                    <p><strong>Duration:</strong> {file.extractedData.duration || 'Not found'}</p>
                    <p><strong>Price:</strong> {file.extractedData.price ? `RM ${file.extractedData.price}` : 'Not found'}</p>
                    <p><strong>HRDCorp:</strong> {file.extractedData.hrdcorp_approval_no || 'Not found'}</p>
                  </div>
                )}
                
                {file.status === 'failed' && file.errorMessage && (
                  <div className="mt-2 text-sm text-red-600">
                    <p><strong>Error:</strong> {file.errorMessage}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 