// src/services/api/versions.js
import ApiClient from './base';
import { API_BASE } from './config';

class VersionService extends ApiClient {
  constructor() {
    super(API_BASE);
  }

  getByProjectId(projectId) {
    return this.get('/v1/versions', { projectId });
  }

  getById(id) {
    return this.get(`/v1/versions/${id}`);
  }
}

export default new VersionService();