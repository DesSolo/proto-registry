// src/pages/HelpPage.jsx
import React from 'react';
import { Card, Typography, Divider, List } from 'antd';

const { Title, Paragraph } = Typography;

const HelpPage = () => {
  const helpTopics = [
    {
      title: 'Поиск проектов',
      description: 'Используйте поле поиска в левой панели для поиска нужного проекта по названию.'
    },
    {
      title: 'Выбор версии',
      description: 'После выбора проекта вы можете выбрать нужную версию из списка доступных версий.'
    },
    {
      title: 'Просмотр файлов',
      description: 'В дереве файлов выберите нужный файл для просмотра его содержимого в правой части экрана.'
    },
    {
      title: 'Навигация',
      description: 'Вы можете перемещаться между проектами, версиями и файлами с помощью боковой панели.'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Справка</Title>
        <Divider />
        
        <Paragraph>
          Добро пожаловать в proto-registry-ui. Это приложение позволяет просматривать 
          protobuf-файлы из различных проектов и версий.
        </Paragraph>
        
        <Title level={4}>Темы справки:</Title>
        <List
          dataSource={helpTopics}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
        
        <Divider />
        <Paragraph>
          Для получения дополнительной помощи обратитесь к администратору системы.
        </Paragraph>
      </Card>
    </div>
  );
};

export default HelpPage;