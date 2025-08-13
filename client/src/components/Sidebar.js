import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronRight, FaChevronLeft, FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa';
import './Sidebar.css';

const DirectoryItem = ({ item, level, onFileSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toggleExpand = async () => {
    if (!expanded && item.type === 'directory' && children.length === 0) {
      try {
        setLoading(true);
        console.log('Fetching directory contents for:', item.path);
        const response = await axios.get(`http://localhost:5001/api/files?dir=${item.path}`);
        if (response.data.success) {
          setChildren(response.data.files);
          console.log('Directory contents loaded:', response.data.files);
        } else {
          setError('Failed to load directory contents');
        }
      } catch (err) {
        console.error('Error loading directory contents:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  const handleFileClick = async (e) => {
    e.stopPropagation(); // Prevent triggering directory toggle
    
    if (item.type === 'file') {
      try {
        console.log('Fetching file content for:', item.path);
        const response = await axios.get(`http://localhost:5001/api/files/${encodeURIComponent(item.path)}`);
        console.log('File API response:', response.data);
        if (response.data.success) {
          console.log('Calling onFileSelect with:', item.path, response.data.content ? response.data.content.substring(0, 50) + '...' : 'No content');
          onFileSelect(item.path, response.data.content);
        } else {
          console.error('API returned success: false');
        }
      } catch (error) {
        console.error('Failed to load file content:', error);
      }
    }
  };

  const indentStyle = {
    paddingLeft: `${level * 16}px`
  };

  return (
    <>
      <li 
        className={`sidebar-item ${item.type === 'directory' ? 'directory' : 'file'}`}
        style={indentStyle}
        onClick={item.type === 'directory' ? toggleExpand : handleFileClick}
      >
        {item.type === 'directory' ? (
          <>
            {expanded ? <FaFolderOpen className="folder-icon" /> : <FaFolder className="folder-icon" />}
            <span>{expanded ? '▼ ' : '▶ '}{item.name}</span>
          </>
        ) : (
          <>
            <FaFile className="file-icon" />
            <span>{item.name}</span>
          </>
        )}
      </li>
      
      {expanded && item.type === 'directory' && (
        <li className="directory-children">
          {loading ? (
            <div className="loading" style={indentStyle}>Loading...</div>
          ) : error ? (
            <div className="error" style={indentStyle}>{error}</div>
          ) : children.length === 0 ? (
            <div className="empty-message" style={indentStyle}>Empty directory</div>
          ) : (
            <ul>
              {children.map(child => (
                <DirectoryItem 
                  key={child.path} 
                  item={child} 
                  level={level + 1} 
                  onFileSelect={onFileSelect} 
                />
              ))}
            </ul>
          )}
        </li>
      )}
    </>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before making new request
        console.log('Fetching files from: http://localhost:5001/api/files');
        const response = await axios.get('http://localhost:5001/api/files');
        console.log('API response:', response.data);
        if (response.data.success) {
          setFiles(response.data.files);
          console.log('Files loaded:', response.data.files);
        } else {
          setError('Failed to load files');
          console.error('API returned error:', response.data);
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
        console.error('API call failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Files</h3>
        <button 
          className="toggle-button" 
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      
      <div className="sidebar-content">
        {loading ? (
          <div className="loading">Loading files...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : files.length === 0 ? (
          <div className="empty-message">No C++ files found</div>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <DirectoryItem 
                key={file.path} 
                item={file} 
                level={0} 
                onFileSelect={onFileSelect} 
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
