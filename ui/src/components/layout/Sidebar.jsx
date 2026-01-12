// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Select, Spin, Tag, Tree } from 'antd';
import { FolderOutlined, DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import Selector from '../common/Selector';
import useVersions from '../../hooks/useVersions';
import useFiles from '../../hooks/useFiles';
import { fetchProjectById, fetchVersionById } from '../../api';
import styles from './Sidebar.module.css';

const Sidebar = ({ onFileSelect }) => {
    const { projectId: projectIdFromUrl, versionId: versionIdFromUrl } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams(); // Оставляем для совместимости
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [urlVersionProcessed, setUrlVersionProcessed] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [urlInitializationComplete, setUrlInitializationComplete] = useState(false);
    const [fileInitializedFromUrl, setFileInitializedFromUrl] = useState(false);
    const [initialFilePathFromUrl, setInitialFilePathFromUrl] = useState(() => {
        const match = location.pathname.match(/\/project\/[^\/]+\/version\/[^\/]+\/file\/(.+)/);
        return match ? decodeURIComponent(match[1]) : null;
    });

    // Извлекаем путь к файлу из URL
    const extractFilePath = React.useCallback(() => {
        const match = location.pathname.match(/\/project\/[^\/]+\/version\/[^\/]+\/file\/(.+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }, [location.pathname]);

    const filePathFromUrl = extractFilePath();

    const {
        versions,
        loading: loadingVersions,
        setProject: setVersionsProject
    } = useVersions(selectedProject?.id);

    const {
        files,
        loading: loadingFiles,
        setVersion: setFilesVersion
    } = useFiles(selectedVersion?.id);

    // Инициализация из URL параметров
    useEffect(() => {
        if (projectIdFromUrl && !selectedProject) {
            // Загружаем проект по ID из URL
            fetchProjectById(projectIdFromUrl)
                .then(data => {
                    if (data.project) {
                        setSelectedProject(data.project);

                        // Загружаем версии для этого проекта
                        setVersionsProject(data.project.id);

                        // Если указана версия, пытаемся найти её
                        if (versionIdFromUrl) {
                            // Сначала пробуем получить версию напрямую по ID
                            fetchVersionById(versionIdFromUrl)
                                .then(versionData => {
                                    if (versionData.version) {
                                        setSelectedVersion(versionData.version);
                                        setUrlVersionProcessed(true);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error loading version by ID from URL:', error);
                                    // Если не удалось получить версию по ID,
                                    // мы будем искать её по ref в другом useEffect
                                });
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading project from URL:', error);
                });
        }
    }, [projectIdFromUrl, selectedProject, setVersionsProject, versionIdFromUrl]);

    // Поиск версии по ref, если не найдена по ID
    useEffect(() => {
        if (versionIdFromUrl && versions.length > 0 && !selectedVersion) {
            const versionByRef = versions.find(v => v.ref === versionIdFromUrl);
            if (versionByRef) {
                setSelectedVersion(versionByRef);
                setUrlVersionProcessed(true);
            }
        }
    }, [versionIdFromUrl, versions, selectedVersion]);

    // Отслеживаем завершение инициализации
    useEffect(() => {
        if (selectedProject && selectedVersion) {
            setUrlInitializationComplete(true);
        }
    }, [selectedProject, selectedVersion]);


    // Обновляем URL при изменении проекта, версии или файла
    useEffect(() => {
        if (selectedProject && selectedVersion && selectedFile) {
            navigate(`/project/${selectedProject.id}/version/${selectedVersion.id}/file/${selectedFile.path}`, { replace: true });
        } else if (selectedProject && selectedVersion) {
            navigate(`/project/${selectedProject.id}/version/${selectedVersion.id}`, { replace: true });
        } else if (selectedProject) {
            navigate(`/project/${selectedProject.id}`, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [selectedProject, selectedVersion, selectedFile, navigate]);

    // Обновляем версии при изменении проекта
    useEffect(() => {
        if (selectedProject) {
            setVersionsProject(selectedProject.id);
        } else {
            setVersionsProject(null);
        }
    }, [selectedProject, setVersionsProject]);

    // Синхронизируем версии из URL только один раз при загрузке
    useEffect(() => {
        if (versionIdFromUrl && versions.length > 0 && !selectedVersion && !urlVersionProcessed) {
            const version = versions.find(v => v.id === versionIdFromUrl);
            if (version) {
                setSelectedVersion(version);
                setUrlVersionProcessed(true);
            }
        }
    }, [versions, versionIdFromUrl, selectedVersion, urlVersionProcessed]);

    // Обновляем файлы при изменении версии
    useEffect(() => {
        if (selectedVersion) {
            setFilesVersion(selectedVersion.id);
        } else {
            setFilesVersion(null);
        }
    }, [selectedVersion, setFilesVersion]);

    // Обработка файла из URL
    useEffect(() => {
        console.log('File processing effect triggered', {
            filePathFromUrl,
            filesLength: files.length,
            hasSelectedProject: !!selectedProject,
            hasSelectedVersion: !!selectedVersion,
            hasSelectedFile: !!selectedFile,
            urlInitializationComplete
        });

        if (initialFilePathFromUrl && files.length > 0 && selectedProject && selectedVersion && urlInitializationComplete && !fileInitializedFromUrl) {
            // Ищем файл по пути (может быть в поле path, filename или name)
            const file = files.find(f =>
                f.path === initialFilePathFromUrl ||
                f.filename === initialFilePathFromUrl ||
                f.name === initialFilePathFromUrl
            );

            if (file) {
                console.log('File found and selected:', file);
                // Вызываем onFileSelect для загрузки содержимого файла
                setSelectedFile(file);
                onFileSelect(file, selectedProject, selectedVersion);
                setFileInitializedFromUrl(true); // Помечаем, что файл из URL уже инициализирован
            } else {
                console.log(`File not found: ${initialFilePathFromUrl}. Available files:`, files.map(f => f.path));
                setFileInitializedFromUrl(true); // Помечаем, что попытка инициализации была
            }
        } else {
            console.log('File processing condition not met', {
                hasInitialFilePathFromUrl: !!initialFilePathFromUrl,
                filesLength: files.length,
                hasSelectedProject: !!selectedProject,
                hasSelectedVersion: !!selectedVersion,
                urlInitializationComplete,
                fileInitializedFromUrl
            });
        }
    }, [files, initialFilePathFromUrl, selectedProject, selectedVersion, selectedFile, urlInitializationComplete, onFileSelect]);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSelectedVersion(null);
        setSelectedFile(null); // Сбрасываем выбранный файл при смене проекта
    };

    const handleVersionChange = (value) => {
        const version = versions.find(v => v.id === value);
        setSelectedVersion(version);
        setSelectedFile(null); // Сбрасываем выбранный файл при смене версии
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const time = d.toLocaleTimeString('ru-RU', { hour12: false });
        const date = d.toLocaleDateString('ru-RU');
        return `${time} ${date}`;
    };

    // Преобразуем flat список файлов в tree structure
    const buildTreeData = React.useMemo(() => {
        const root = { key: 'root', title: 'Корень', children: [] };

        files.forEach(file => {
            const parts = file.path.split('/');
            let current = root;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFile = i === parts.length - 1;

                // Создаем уникальный ключ для каждого узла
                const nodeKey = parts.slice(0, i + 1).join('/');

                // Ищем существующий узел с таким же ключом
                let existingNode = current.children.find(child => child.key === nodeKey);

                if (!existingNode) {
                    existingNode = {
                        key: nodeKey,
                        title: part,
                        isLeaf: isFile,
                        file: isFile ? file : null,
                        children: isFile ? undefined : []
                    };
                    current.children.push(existingNode);
                }

                current = existingNode;
            }
        });

        return root.children;
    }, [files]);

    return (
        <div className={styles.sidebarContainer}>
            <Selector
                onProjectSelect={handleProjectSelect}
                selectedProject={selectedProject}
            />

            {loadingVersions ? (
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Spin size="small" />
                </div>
            ) : selectedProject && versions.length > 0 ? (
                <div style={{ marginTop: '16px' }}>
                    <Select
                        value={selectedVersion?.id}
                        onChange={handleVersionChange}
                        className={styles.versionSelector}
                        size="large"
                        placeholder="Выберите версию"
                        dropdownMatchSelectWidth={false}
                        optionLabelProp="label"
                    >
                        {versions.map((v) => (
                            <Select.Option
                                key={v.id}
                                value={v.id}
                                label={v.ref}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
                                    <div style={{ marginRight: '8px', fontFamily: 'inherit' }}>
                                        <strong style={{ fontFamily: 'inherit' }}>{v.ref}</strong>
                                        <br />
                                        <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'inherit' }}>{v.commit.slice(0, 7)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'inherit' }}>
                      {formatDate(v.updatedAt)}
                    </span>
                                        {selectedVersion?.id === v.id && (
                                            <Tag color="blue" style={{ margin: 0, fontFamily: 'inherit' }}>✓</Tag>
                                        )}
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>

                    {loadingFiles ? (
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <Spin size="small" />
                        </div>
                    ) : files.length > 0 ? (
                        <Tree
                            treeData={buildTreeData}
                            className={styles.treeContainer}
                            defaultExpandAll
                            switcherIcon={ <DownOutlined /> }
                            showIcon
                            icon={(props) => {
                                if (props.isLeaf) {
                                    // Определяем тип файла по расширению и показываем соответствующую иконку
                                    const fileName = props.title;
                                    if (fileName.endsWith('.proto')) {
                                        return <span role="img" aria-label="protobuf" style={{ fontSize: '16px' }}>🔷</span>;
                                    } else if (fileName.endsWith('.json')) {
                                        return <span role="img" aria-label="json" style={{ fontSize: '16px' }}>🔶</span>;
                                    } else {
                                        return <span role="img" aria-label="file" style={{  fontSize: '16px' }}>📄</span>;
                                    }
                                }
                                return <FolderOutlined style={{ fontSize: '16px' }} />;
                            }}
                            onSelect={(selectedKeys, info) => {
                                const file = info.node.file;
                                if (file && selectedProject && selectedVersion) {
                                    console.log('Setting selected file from tree:', file);
                                    setSelectedFile(file);
                                    onFileSelect(file, selectedProject, selectedVersion);
                                }
                            }}
                            selectedKeys={selectedFile ? [selectedFile.path] : []}
                            classNames={{
                                node: styles.treeNode,
                                nodeSelected: styles.treeNodeSelected
                            }}
                        />
                    ) : (
                        <div className={styles.noVersionsMessage}>
                            Нет файлов
                        </div>
                    )}
                </div>
            ) : selectedProject ? (
                <div className={styles.noVersionsMessage}>
                    Нет версий
                </div>
            ) : null}
        </div>
    );
};

export default Sidebar;