// src/hooks/useProjects.js
import { useState, useEffect, useRef } from 'react';
import { fetchProjects } from '../api';

const useProjects = (initialQuery = '') => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const debounceTimer = useRef(null);

  const loadProjects = async (searchQuery = '') => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProjects(searchQuery);
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      loadProjects(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const searchProjects = (searchQuery) => {
    setQuery(searchQuery);
  };

  return {
    projects,
    loading,
    error,
    query,
    loadProjects,
    searchProjects,
  };
};

export default useProjects;