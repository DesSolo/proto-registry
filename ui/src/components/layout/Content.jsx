// src/components/layout/Content.jsx
import React from 'react';
import { Spin, Card, Tooltip, message } from 'antd';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'; // или другая тема по желанию
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
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
                styles={{
                    body: {
                        padding: '40px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }
                }}
            >
                <div className={styles.placeholderText}>
                    Выберите файл из дерева слева для просмотра его содержимого
                </div>
            </Card>
        );
    }

    // Проверяем, является ли содержимое OpenAPI/Swagger спецификацией
    const isOpenApiSpec = () => {
        try {
            // Пробуем распарсить JSON/YAML и проверить наличие ключевых полей OpenAPI
            const trimmedContent = content.trim();

            // Проверяем наличие ключевых полей OpenAPI в начале файла
            if (trimmedContent.includes('openapi:') || trimmedContent.includes('"openapi":') ||
                trimmedContent.includes('swagger:') || trimmedContent.includes('"swagger":')) {
                return true;
            }

            // Для JSON пробуем парсить и проверить структуру
            if (trimmedContent.startsWith('{')) {
                const parsed = JSON.parse(trimmedContent);
                return parsed.openapi || parsed.swagger ? true : false;
            }

            return false;
        } catch (e) {
            // Если не удается распарсить, проверяем по наличию ключевых слов
            return content.includes('openapi:') || content.includes('swagger:');
        }
    };

    // Определяем тип файла по содержимому
    const getFileType = () => {
        if (isOpenApiSpec()) {
            return 'openapi';
        }
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

    // Если это OpenAPI спецификация, отображаем с помощью Swagger UI
    if (fileType === 'openapi') {
        // Пытаемся определить формат (JSON или YAML) и передать соответствующий контент
        let specContent = content;

        // Если это JSON строка, пробуем распарсить и вернуть объект
        if (content.trim().startsWith('{')) {
            try {
                specContent = JSON.parse(content);
            } catch (e) {
                // Если не удается распарсить, передаем как есть
                specContent = content;
            }
        }

        // Формируем заголовок с иконками обновления и копирования
        const cardTitle = (
            <div className={styles.cardTitle}>
                <span className={styles.filePath}>{filePath}</span>
                <Tooltip title="Копировать в буфер">
                    <CopyOutlined
                        onClick={() => copyToClipboard()}
                        style={{ marginLeft: '12px' }}
                    />
                </Tooltip>
                <Tooltip title="Обновить">
                    <SyncOutlined
                        onClick={onRefresh}
                        style={{ marginLeft: '12px' }}
                    />
                </Tooltip>
            </div>
        );

        return (
            <Card
                title={cardTitle}
                className={styles.contractCard}
                styles={{ body: { padding: 0, height: '100%' } }}
            >
                <div style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                    <SwaggerUI spec={specContent} />
                </div>
            </Card>
        );
    }

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

    // Функция для копирования содержимого в буфер обмена
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content);
            message.success('Содержимое скопировано в буфер обмена');
        } catch (err) {
            console.error('Ошибка при копировании в буфер обмена:', err);
            message.error('Не удалось скопировать содержимое');
        }
    };

    // Формируем заголовок с иконками обновления и копирования
    const cardTitle = (
        <div className={styles.cardTitle}>
            <span className={styles.filePath}>{filePath}</span>
            <Tooltip title="Копировать в буфер">
                <CopyOutlined
                    onClick={copyToClipboard}
                    style={{ marginLeft: '12px' }}
                />
            </Tooltip>
            <Tooltip title="Обновить">
                <SyncOutlined
                    onClick={onRefresh}
                    style={{ marginLeft: '12px' }}
                />
            </Tooltip>
        </div>
    );

    return (
        <Card
            title={cardTitle}
            className={styles.contractCard}
            styles={{ body: { padding: 0 }}}
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