// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Select, Spin, Tag, Tree } from 'antd';
import { FolderOutlined, DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import Selector from '../common/Selector';
import useVersions from '../../hooks/useVersions';
import useFiles from '../../hooks/useFiles';
import styles from './Sidebar.module.css';

const Sidebar = ({ onFileSelect }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);

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

    // Обновляем версии при изменении проекта
    React.useEffect(() => {
        if (selectedProject) {
            setVersionsProject(selectedProject.id);
        } else {
            setVersionsProject(null);
        }
    }, [selectedProject, setVersionsProject]);

    // Обновляем файлы при изменении версии
    React.useEffect(() => {
        if (selectedVersion) {
            setFilesVersion(selectedVersion.id);
        } else {
            setFilesVersion(null);
        }
    }, [selectedVersion, setFilesVersion]);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSelectedVersion(null);
    };

    const handleVersionChange = (value) => {
        const version = versions.find(v => v.id === value);
        setSelectedVersion(version);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const time = d.toLocaleTimeString('ru-RU', { hour12: false });
        const date = d.toLocaleDateString('ru-RU');
        return `${time} ${date}`;
    };

    // Преобразуем flat список файлов в tree structure
    const buildTreeData = (files) => {
        const root = { key: 'root', title: 'Корень', children: [] };
        const map = {};

        files.forEach(file => {
            const parts = file.path.split('/');
            let current = root;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFile = i === parts.length - 1;

                if (!map[part]) {
                    const node = {
                        key: `${file.id}-${i}`,
                        title: part,
                        isLeaf: isFile,
                        file: isFile ? file : null,
                    };
                    map[part] = node;
                    current.children = current.children || [];
                    current.children.push(node);
                }

                current = map[part];
            }
        });

        return root.children;
    };

    const treeData = buildTreeData(files);

    return (
        <div className={styles.sidebarContainer}>
            <Selector onProjectSelect={handleProjectSelect} />

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
                            treeData={treeData}
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
                                    onFileSelect(file, selectedProject, selectedVersion);
                                }
                            }}
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