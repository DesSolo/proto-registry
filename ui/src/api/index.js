// src/api/index.js
import api from '../services/api';

// Projects
export const fetchProjects = (name = '') => {
    return api.projects.getAll(name);
};

export const fetchProjectById = (id) => {
    return api.projects.getById(id);
};

// Versions
export const fetchVersionsByProjectId = (projectId) => {
    return api.versions.getByProjectId(projectId);
};

export const fetchVersionById = (id) => {
    return api.versions.getById(id);
};

// Files
export const fetchFilesByVersionId = (versionId) => {
    return api.files.getByVersionId(versionId);
};

// File content
export const fetchFileContent = ({ projectId, ref, path }) => {
    return api.files.getContent({ projectId, ref, path });
};