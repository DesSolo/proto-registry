// src/components/layout/Content.jsx
import React from 'react';
import { Spin, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'; // или другая тема по желанию
import styles from './Content.module.css';

// Регистрируем прото-файлы как язык
Prism.languages.proto = {
  comment: /\/\/.*|\/\*[\s\S]*?\*\//,
  string: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  keyword: /\b(?:package|import|option|syntax|message|enum|service|rpc|oneof|repeated|required|optional|reserved)\b/,
  builtin: /\b(?:bool|bytes|double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|string)\b/,
  number: /\b0[xX][\da-fA-F]+\b|\b\d+(\.\d*)?([eE][+-]?\d+)?\b/,
  punctuation: /[{}[\];(),.:|=<>]/,
  operator: /[+\-*/%=!]=?|[<>]=?|&&|\|\|?|[:?]/,
};

const Content = ({ content, filePath, loading, onRefresh }) => {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    // Если нет выбранного файла, показываем информационное сообщение
    if (!filePath) {
        return (
            <Card
                title="Файл не выбран"
                className={styles.contractCard}
                bodyStyle={{
                    padding: '40px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}
            >
                <div className={styles.placeholderText}>
                    Выберите файл из дерева слева для просмотра его содержимого
                </div>
            </Card>
        );
    }

    // Определяем тип файла по содержимому
    const getFileType = () => {
        if (content.includes('syntax =') && content.includes('proto')) {
            return 'proto';
        } else if (content.includes('import ') || content.includes('export ')) {
            return 'javascript';
        } else if (content.includes('{') && content.includes('}')) {
            return 'javascript';
        } else if (content.startsWith('{') || content.startsWith('[')) {
            return 'json';
        }
        return 'markup'; // как fallback
    };

    const fileType = getFileType();
    const highlightedCode = Prism.highlight(content, Prism.languages[fileType], fileType);

    // Разбиваем код на строки и добавляем номера строк
    const lines = content.split('\n');
    const numberedLines = lines.map((line, index) => {
        // Подсвечиваем каждую строку отдельно (хотя это менее эффективно)
        // Но для правильного отображения номеров строк это приемлемо
        return (
            <div key={index} className={styles.lineWrapper}>
                <span className={styles.lineNumber}>{index + 1}</span>
                <span className={styles.lineContent} dangerouslySetInnerHTML={{ __html: Prism.highlight(line, Prism.languages[fileType], fileType) }} />
            </div>
        );
    });

    // Формируем заголовок с иконкой обновления
    const cardTitle = (
        <div className={styles.cardTitle}>
            <span className={styles.filePath}>{filePath}</span>
            <ReloadOutlined
                className={styles.refreshIcon}
                onClick={onRefresh}
                title="Обновить файл"
            />
        </div>
    );

    return (
        <Card
            title={cardTitle}
            className={styles.contractCard}
            bodyStyle={{ padding: 0 }}
        >
            <pre className={styles.container}>
                <code className={`language-${fileType}`}>
                    {numberedLines}
                </code>
            </pre>
        </Card>
    );
};

export default Content;