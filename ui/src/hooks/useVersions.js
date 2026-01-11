// src/hooks/useVersions.js
import { useState, useEffect } from 'react';
import { fetchVersionsByProjectId } from '../api';

const useVersions = (initialProjectId = null) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState(initialProjectId);

  const loadVersions = async (id) => {
    if (!id) {
      setVersions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchVersionsByProjectId(id);
      setVersions(data.versions || []);
    } catch (err) {
      console.error('Failed to load versions:', err);
      setError(err.message);
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersions(projectId);
  }, [projectId]);

  const setProject = (id) => {
    setProjectId(id);
  };

  return {
    versions,
    loading,
    error,
    projectId,
    loadVersions,
    setProject,
  };
};

export default useVersions;