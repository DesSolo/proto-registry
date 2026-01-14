import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Button, Space } from 'antd';
import { SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const { Header: AntdHeader } = Layout;

const Header = () => {
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