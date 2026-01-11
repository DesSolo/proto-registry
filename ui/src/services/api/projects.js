// src/services/api/projects.js
import ApiClient from './base';
import { API_BASE } from './config';

class ProjectService extends ApiClient {
  constructor() {
    super(API_BASE);
  }

  getAll(name = '') {
    const params = name ? { name } : {};
    return this.get('/v1/projects', params);
  }

  getById(id) {
    return this.get(`/v1/projects/${id}`);
  }
}

export default new ProjectService();