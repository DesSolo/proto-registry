// src/services/api/files.js
import ApiClient from './base';
import { API_BASE } from './config';

class FileService extends ApiClient {
  constructor() {
    super(API_BASE);
  }

  getByVersionId(versionId) {
    return this.get('/v1/files', { versionId });
  }

  getContent({ projectId, ref, path }) {
    const params = new URLSearchParams({
      projectId,
      ref,
      path,
    });
    return this.get(`/v1/files:content?${params.toString()}`);
  }

  getById(id) {
    return this.get(`/v1/files/${id}`);
  }
}

export default new FileService();