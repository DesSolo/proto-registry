// src/services/api/index.js
import projectService from './projects';
import versionService from './versions';
import fileService from './files';

export {
  projectService,
  versionService,
  fileService,
};

export default {
  projects: projectService,
  versions: versionService,
  files: fileService,
};