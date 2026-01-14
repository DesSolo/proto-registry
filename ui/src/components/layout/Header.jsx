import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Button, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import appConfig from '../../config/appConfig';
import styles from './Header.module.css';

const { Header: AntdHeader } = Layout;

const Header = () => {
    const userMenu = {
        items: [
            {
                key: 'help',
                label: (
                    <a href={appConfig.helpUrl} target="_blank" rel="noopener noreferrer">
                        <QuestionCircleOutlined /> Помощь
                    </a>
                )
            }
        ]
    };

    return (
        <AntdHeader className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/main" className={styles.logoLink}>
                    <img src="/logo.svg" alt="Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>{appConfig.appName}</span>
                </Link>
            </div>

            <div className={styles.userInfo}>
                <Space size="middle">
                    <Dropdown menu={userMenu} trigger={['click']}>
                        <Avatar size="small" style={{ cursor: 'pointer' }} />
                    </Dropdown>
                </Space>
            </div>
        </AntdHeader>
    );
};

export default Header;