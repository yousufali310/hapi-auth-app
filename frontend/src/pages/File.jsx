import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Trash2,
  Download,
  File,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FileManagementApp = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFiles();

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
      showNotification('Failed to load files', 'error');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      uploadFile(droppedFiles[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          fetchFiles();
          showNotification(`${file.name} uploaded successfully`, 'success');
        } else {
          showNotification('File upload failed', 'error');
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        showNotification('File upload failed', 'error');
        setUploading(false);
      };

      xhr.open('POST', `${VITE_API_BASE_URL}/files/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('File upload failed', 'error');
      setUploading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFiles();
        showNotification('File deleted successfully', 'success');
      } else {
        showNotification('File deletion failed', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('File deletion failed', 'error');
    }
  };

  const handleDownload = async (file) => {
    try {
      showNotification('Downloading file...', 'info');

      const response = await fetch(file.url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', file.fileId);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('File downloaded successfully', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showNotification('File download failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const showNotification = (message, type = 'info') => {
    if (type === 'error') {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return <File className="w-6 h-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-6 h-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-6 h-6 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <File className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Notification System */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white backdrop-blur-lg bg-opacity-80 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg
                className="h-7 w-7 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              File Manager
            </h1>
          </div>

          {/* Drag & Drop Area */}
          <div
            ref={dropAreaRef}
            className={`relative p-8 transition-all cursor-pointer ${
              uploading ? 'opacity-50' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {isDragging
                  ? 'Drop your file here'
                  : 'Drag & drop your file here'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <label className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg cursor-pointer hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ">
                {/* Hidden browse button */}
                Browse Files
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-xs text-gray-400 mt-4">
                Supported file types: PDF, DOC, XLS, JPG, PNG
              </p>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
                <div className="w-64 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-indigo-600">
                      Uploading...
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Your Files
            </h2>

            {files.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <li
                      key={file.fileId}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {getFileIcon(file.fileId)}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {file.fileId}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} •{' '}
                            {new Date(
                              file.lastModified || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.fileId)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-100 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="mt-4 text-gray-500">No files available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagementApp;
