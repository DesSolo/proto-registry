// src/pages/SettingsPage.jsx
import React from 'react';
import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const SettingsPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Настройки приложения</Title>
        <Divider />
        
        <Paragraph>
          Здесь будут настройки приложения proto-registry-ui.
        </Paragraph>
        
        <Paragraph>
          В будущем можно добавить:
        </Paragraph>
        
        <ul>
          <li>Настройки темы (светлая/темная)</li>
          <li>Настройки отображения файлов</li>
          <li>Настройки подключения к API</li>
          <li>Настройки уведомлений</li>
        </ul>
      </Card>
    </div>
  );
};

export default SettingsPage;