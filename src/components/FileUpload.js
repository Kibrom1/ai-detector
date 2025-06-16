import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFile } from '@fortawesome/free-solid-svg-icons';

function FileUpload({ onFileSelect, fileInfo }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect({
        name: file.name,
        size: file.size,
        type: file.type,
        content: e.target.result
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-upload" data-testid="file-upload">
      <div
        className="drop-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-testid="drop-zone"
      >
        <FontAwesomeIcon icon={faUpload} className="upload-icon" />
        <p>Drag and drop your file here</p>
        <p>or</p>
        <label className="file-input-label">
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.js,.py,.java,.cpp,.html,.css"
            data-testid="file-input"
          />
          Choose File
        </label>
      </div>
      {fileInfo && (
        <div className="file-info" data-testid="file-info">
          <FontAwesomeIcon icon={faFile} />
          <div className="file-details">
            <p className="file-name">{fileInfo.name}</p>
            <p className="file-size">
              {(fileInfo.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload; 