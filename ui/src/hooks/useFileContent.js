// src/hooks/useFileContent.js
import { useState } from 'react';
import { fetchFileContent } from '../api';

const useFileContent = () => {
  const [fileContent, setFileContent] = useState('');
  const [filePath, setFilePath] = useState('');
  const [projectId, setProjectId] = useState('');
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFileContent = async (params) => {
    if (!params.projectId || !params.ref || !params.path) {
      setError('Missing required parameters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFileContent(params);
      setFileContent(data.content || '');
      setFilePath(params.path); // Store the file path
      setProjectId(params.projectId); // Store project ID for refresh
      setRef(params.ref); // Store ref for refresh
    } catch (err) {
      console.error('Failed to load file content:', err);
      setError(err.message);
      setFileContent('// Ошибка загрузки файла');
      setFilePath(params.path); // Still store the path even if there's an error
      setProjectId(params.projectId);
      setRef(params.ref);
    } finally {
      setLoading(false);
    }
  };

  const refreshFileContent = async () => {
    if (!projectId || !ref || !filePath) {
      setError('Missing required parameters for refresh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        projectId,
        ref,
        path: filePath,
      };
      const data = await fetchFileContent(params);
      setFileContent(data.content || '');
    } catch (err) {
      console.error('Failed to refresh file content:', err);
      setError(err.message);
      setFileContent('// Ошибка обновления файла');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFileContent('');
    setFilePath('');
    setProjectId('');
    setRef('');
    setError(null);
  };

  return {
    fileContent,
    filePath,
    loading,
    error,
    loadFileContent,
    refreshFileContent,
    reset,
  };
};

export default useFileContent;