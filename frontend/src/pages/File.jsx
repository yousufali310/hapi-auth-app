import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Download, File } from "lucide-react";
import { useNavigate } from "react-router-dom";
const FileManagementApp = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
        alert("File uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchFiles();
        alert("File deleted successfully");
      } else {
        alert("File deletion failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("File deletion failed");
    }
  };

  const handleDownload = async (file) => {
    try {
      console.log(file);

      const response = await fetch(file.url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", file.fileId);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("File download failed");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 cursor-pointer"
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

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">File Manager</h2>

          <label className="bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600">
            <Upload className="inline w-5 h-5 mr-2" /> Upload
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <ul className="space-y-2">
          {files.length > 0 ? (
            files.map((file) => (
              <li
                key={file.fileId}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-700 font-medium truncate max-w-xs">
                    {file.fileId}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.fileId)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No files available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FileManagementApp;
