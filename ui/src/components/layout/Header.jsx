import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Button, Space, Tooltip } from 'antd';
import { SettingOutlined, QuestionCircleOutlined, SkinOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Header.module.css';

const { Header: AntdHeader } = Layout;

const Header = () => {
    const { toggleTheme, currentTheme } = useTheme();

    const userMenu = {
        items: [
            {
                key: 'settings',
                label: (
                    <Link to="/settings">
                        <SettingOutlined /> Настройки
                    </Link>
                )
            },
            {
                key: 'help',
                label: (
                    <Link to="/help">
                        <QuestionCircleOutlined /> Помощь
                    </Link>
                )
            }
        ]
    };

    // Determine the current theme icon and handle click
    let themeIcon;
    if (currentTheme === 'dark') {
        themeIcon = <MoonOutlined />;
    } else {
        // For system theme, determine based on actual system preference
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeIcon = isSystemDark ? <MoonOutlined /> : <SunOutlined />;
    }

    // Handle theme toggle - cycle between dark and system
    const handleThemeToggle = () => {
        // Toggle between dark and system themes
        const newTheme = currentTheme === 'dark' ? 'system' : 'dark';
        toggleTheme(newTheme);
    };

    return (
        <AntdHeader className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/main" className={styles.logoLink}>
                    <img src="/logo.svg" alt="Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>proto-registry-ui</span>
                </Link>
            </div>

            <div className={styles.userInfo}>
                <Space size="middle">
                    <Tooltip title="Переключить тему">
                        <Button
                            type="text"
                            icon={themeIcon}
                            onClick={handleThemeToggle}
                        />
                    </Tooltip>

                    <div className={styles.navLinks}>
                        <Button type="text">
                            <Link to="/main">Главная</Link>
                        </Button>
                        <Button type="text">
                            <Link to="/settings">Настройки</Link>
                        </Button>
                        <Button type="text">
                            <Link to="/help">Справка</Link>
                        </Button>
                    </div>
                    <Dropdown menu={userMenu} trigger={['click']}>
                        <Avatar size="small" style={{ cursor: 'pointer' }} />
                    </Dropdown>
                </Space>
            </div>
        </AntdHeader>
    );
};

export default Header;