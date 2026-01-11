// src/pages/MainPage.jsx
import React from 'react';
import { Layout } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Content from '../components/layout/Content';
import useFileContent from '../hooks/useFileContent';

const { Sider, Content: AntdContent } = Layout;

const MainPage = () => {
  const { toggleTheme, currentTheme } = useTheme();

  const { fileContent, filePath, loading: loadingContent, loadFileContent, refreshFileContent } = useFileContent();

  const handleFileSelect = (file, project, version) => {
    if (!file || !project || !version) return;

    loadFileContent({
      projectId: project.id,
      ref: version.ref,
      path: file.path,
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
      <Layout>
        <Sider width={350}>
          <Sidebar onFileSelect={handleFileSelect} />
        </Sider>
        <AntdContent style={{ padding: '16px' }}>
          <Content
            content={fileContent}
            filePath={filePath}
            loading={loadingContent}
            onRefresh={refreshFileContent}
          />
        </AntdContent>
      </Layout>
    </Layout>
  );
};

export default MainPage;