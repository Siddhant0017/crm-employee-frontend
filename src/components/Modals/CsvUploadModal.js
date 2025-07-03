import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvUploadModal.css';

const CsvUploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const formatFileSize = (size) => {
    return size >= 1048576
      ? (size / (1024 * 1024)).toFixed(1) + ' MB'
      : (size / 1024).toFixed(1) + ' KB';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile({
        file: droppedFile,
        name: droppedFile.name,
        size: formatFileSize(droppedFile.size),
      });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile({
        file: selectedFile,
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    console.log('Environment variable:', process.env.REACT_APP_API_BASE_URL);

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file.file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/leads/upload-csv`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      
      console.log('Upload Success:', response.data);
      onUploadSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error uploading CSV:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleClickOutside}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2>CSV Upload</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p>Add your CSV file here</p>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            hidden
          />
          <div className="upload-icon">
            <div className="upload-icon-box">
              <span className="upload-icon-text">CSV</span>
              {file && (
                <button className="upload-icon-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}>
                  ✕
                </button>
              )}
            </div>
          </div>
          <p>Drag your file to upload</p>
          <p className="or-text">OR</p>
          <button className="browse-btn">Browse Files</button>
        </div>

        {/* Uploaded File Details */}
        {file && (
          <div className="uploaded-file">
            <div className="uploaded-file-info">
              <div className="uploaded-file-icon">CSV</div>
              <div>
                <p className="uploaded-file-name">{file.name}</p>
                <p className="uploaded-file-size">{file.size}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="csv-modal-actions">
          <button className="csv-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="csv-upload-btn"
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CsvUploadModal;
