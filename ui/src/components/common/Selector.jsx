// src/components/common/Selector.jsx
import React, { useState, useEffect } from 'react';
import { AutoComplete, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useProjects from '../../hooks/useProjects';
import sidebarStyles from '../layout/Sidebar.module.css';

const Selector = ({ onProjectSelect, selectedProject }) => {
    const [inputValue, setInputValue] = useState('');
    const { projects, loading, searchProjects } = useProjects('');

    // Обновляем опции при изменении проектов
    const options = React.useMemo(() => {
        return projects.map((p) => ({
            value: p.id,
            label: p.name,
            project: p,
        }));
    }, [projects]);

    // Обновляем inputValue при изменении selectedProject
    useEffect(() => {
        if (selectedProject) {
            setInputValue(selectedProject.name);
        } else {
            setInputValue('');
        }
    }, [selectedProject]);

    const handleSelect = (value, option) => {
        onProjectSelect?.(option.project);
        setInputValue(option.label);
    };

    const handleSearch = (value) => {
        setInputValue(value);
        searchProjects(value);
    };

    return (
        <AutoComplete
            options={options}
            onSelect={handleSelect}
            onSearch={handleSearch}
            placeholder="Поиск по проектам..."
            size="large"
            style={{ width: '100%', marginBottom: '16px', fontFamily: 'inherit' }}
            value={inputValue}
            allowClear
            notFoundContent={loading ? <Spin size="small" /> : 'Не найдено'}
            prefix={<SearchOutlined />}
            suffix={loading ? <Spin size="small" /> : null}
            className={sidebarStyles.versionSelector}
        />
    );
};

export default Selector;