import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, Download, Eye, Plus, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileUpload as FileUploadType } from '../../types';

interface FileUploadProps {
  eventId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [files, setFiles] = useState<FileUploadType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Load files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem(`files_${eventId}`);
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }
  }, [eventId]);

  // Save files to localStorage
  useEffect(() => {
    localStorage.setItem(`files_${eventId}`, JSON.stringify(files));
  }, [files, eventId]);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            
            // Create file object and add to list
            const newFile: FileUploadType = {
              id: fileId,
              eventId,
              name: file.name,
              url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
              type: file.type,
              size: file.size,
              createdAt: new Date().toISOString()
            };
            
            setFiles(prev => [...prev, newFile]);
            
            // Remove from progress tracking
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
            
            return prev;
          }
          
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
    return '📁';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          File Uploads
        </h2>
        <p className={`
          transition-colors duration-300
          ${isDark ? 'text-white/70' : 'text-gray-600'}
        `}>
          Upload and manage files for your event (flyers, contracts, etc.)
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 mb-6
          ${isDragging
            ? 'border-purple-400 bg-purple-400/10'
            : isDark
              ? 'border-white/20 hover:border-white/40'
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <Upload className={`
          h-12 w-12 mx-auto mb-4 transition-colors duration-300
          ${isDragging ? 'text-purple-400' : isDark ? 'text-white/60' : 'text-gray-500'}
        `} />
        <h3 className={`
          text-lg font-semibold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          Drop files here or click to upload
        </h3>
        <p className={`
          text-sm mb-4 transition-colors duration-300
          ${isDark ? 'text-white/60' : 'text-gray-500'}
        `}>
          Support for images, PDFs, documents, and more
        </p>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Choose Files
        </label>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6 space-y-3">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div
              key={fileId}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'bg-white/5 border border-white/10' 
                  : 'bg-black/5 border border-black/10'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-sm font-medium transition-colors duration-300
                  ${isDark ? 'text-white/90' : 'text-gray-700'}
                `}>
                  Uploading...
                </span>
                <span className={`
                  text-sm transition-colors duration-300
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>
                  {progress}%
                </span>
              </div>
              <div className={`
                w-full h-2 rounded-full transition-all duration-300
                ${isDark ? 'bg-white/10' : 'bg-gray-200'}
              `}>
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className={`
            text-center py-12 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet. Upload your first file above!</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                  : 'bg-black/5 border border-black/10 hover:bg-black/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-2xl">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`
                      font-medium truncate transition-colors duration-300
                      ${isDark ? 'text-white' : 'text-gray-800'}
                    `}>
                      {file.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`
                        transition-colors duration-300
                        ${isDark ? 'text-white/60' : 'text-gray-500'}
                      `}>
                        {formatFileSize(file.size)}
                      </span>
                      <span className={`
                        transition-colors duration-300
                        ${isDark ? 'text-white/60' : 'text-gray-500'}
                      `}>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className={`
                      p-2 rounded-lg transition-colors duration-200
                      ${isDark 
                        ? 'text-white/60 hover:text-white hover:bg-white/10' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                      }
                    `}
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.url;
                      link.download = file.name;
                      link.click();
                    }}
                    className={`
                      p-2 rounded-lg transition-colors duration-200
                      ${isDark 
                        ? 'text-white/60 hover:text-white hover:bg-white/10' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                      }
                    `}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* File Statistics */}
      {files.length > 0 && (
        <div className={`
          mt-6 p-4 rounded-xl transition-all duration-300
          ${isDark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-black/5 border border-black/10'
          }
        `}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {files.length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Total Files
              </div>
            </div>
            <div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Total Size
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {new Set(files.map(f => f.type.split('/')[0])).size}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                File Types
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;