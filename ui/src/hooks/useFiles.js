// src/hooks/useFiles.js
import { useState, useEffect } from 'react';
import { fetchFilesByVersionId } from '../api';

const useFiles = (initialVersionId = null) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionId, setVersionId] = useState(initialVersionId);

  const loadFiles = async (id) => {
    if (!id) {
      setFiles([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchFilesByVersionId(id);
      setFiles(data.files || []);
    } catch (err) {
      console.error('Failed to load files:', err);
      setError(err.message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(versionId);
  }, [versionId]);

  const setVersion = (id) => {
    setVersionId(id);
  };

  return {
    files,
    loading,
    error,
    versionId,
    loadFiles,
    setVersion,
  };
};

export default useFiles;