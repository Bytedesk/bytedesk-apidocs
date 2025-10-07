import React from 'react'
import { useIntl } from 'react-intl'
import { Card as AntCard, Space, Tag, Row, Col, Alert, Typography } from 'antd'
import { RobotOutlined, ThunderboltOutlined, GlobalOutlined, BookOutlined } from '@ant-design/icons'
import { Badge, Card, CardGroup } from '../components'
import './I18nHome.module.css'

const { Title, Paragraph, Text } = Typography

export const I18nHome: React.FC = () => {
    const intl = useIntl()

    return (
        <div>
            {/* 快速导航 */}
            <AntCard
                size="small"
                style={{ marginBottom: 32 }}
                styles={{
                    body: { padding: '20px' }
                }}
            >
                <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
                    {intl.formatMessage({ id: 'common.quickNavigation' })}
                </Title>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={6}>
                        <a href="api/core/auth/login" style={{ textDecoration: 'none' }}>
                            <AntCard
                                size="small"
                                hoverable
                                styles={{
                                    body: { padding: '8px 12px' }
                                }}
                            >
                                <Space>
                                    <Badge variant="warning">POST</Badge>
                                    <Text>{intl.formatMessage({ id: 'auth.userLogin' })}</Text>
                                </Space>
                            </AntCard>
                        </a>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <a href="api/core/users/profile" style={{ textDecoration: 'none' }}>
                            <AntCard
                                size="small"
                                hoverable
                                styles={{
                                    body: { padding: '8px 12px' }
                                }}
                            >
                                <Space>
                                    <Badge variant="success">GET</Badge>
                                    <Text>{intl.formatMessage({ id: 'user.profile' })}</Text>
                                </Space>
                            </AntCard>
                        </a>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <a href="api/service/messages/send" style={{ textDecoration: 'none' }}>
                            <AntCard
                                size="small"
                                hoverable
                                styles={{
                                    body: { padding: '8px 12px' }
                                }}
                            >
                                <Space>
                                    <Badge variant="warning">POST</Badge>
                                    <Text>{intl.formatMessage({ id: 'message.send' })}</Text>
                                </Space>
                            </AntCard>
                        </a>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <a href="api/ticket/create" style={{ textDecoration: 'none' }}>
                            <AntCard
                                size="small"
                                hoverable
                                styles={{
                                    body: { padding: '8px 12px' }
                                }}
                            >
                                <Space>
                                    <Badge variant="warning">POST</Badge>
                                    <Text>{intl.formatMessage({ id: 'ticket.create' })}</Text>
                                </Space>
                            </AntCard>
                        </a>
                    </Col>
                </Row>
            </AntCard>

            <Title level={2}>{intl.formatMessage({ id: 'common.overview' })}</Title>
            <Paragraph>{intl.formatMessage({ id: 'home.apiOverview' })}</Paragraph>

            {/* AI对话功能突出展示 */}
            <Alert
                message={
                    <Space align="center" size="middle">
                        <RobotOutlined style={{ fontSize: 32 }} />
                        <Title level={2} style={{ margin: 0 }}>
                            {intl.formatMessage({ id: 'ai.title' })}
                        </Title>
                        <Tag
                            color="blue"
                            style={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                padding: '6px 16px',
                                borderRadius: 20
                            }}
                        >
                            ✨ 重点功能
                        </Tag>
                    </Space>
                }
                description={
                    <>
                        <Paragraph style={{ fontSize: 18, marginBottom: 24 }}>
                            {intl.formatMessage({ id: 'ai.description' })}
                        </Paragraph>
                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={8}>
                                <AntCard size="small">
                                    <Space direction="vertical" size="small">
                                        <Space>
                                            <ThunderboltOutlined style={{ fontSize: 24 }} />
                                            <Text strong style={{ fontSize: 16 }}>
                                                {intl.formatMessage({ id: 'ai.multimodal.title' })}
                                            </Text>
                                        </Space>
                                        <Paragraph style={{ margin: 0, fontSize: 15 }}>
                                            支持文本、图片、视频、文件等多模态智能对话交互
                                        </Paragraph>
                                    </Space>
                                </AntCard>
                            </Col>
                            <Col xs={24} md={8}>
                                <AntCard size="small">
                                    <Space direction="vertical" size="small">
                                        <Space>
                                            <GlobalOutlined style={{ fontSize: 24 }} />
                                            <Text strong style={{ fontSize: 16 }}>
                                                {intl.formatMessage({ id: 'ai.providers.title' })}
                                            </Text>
                                        </Space>
                                        <Paragraph style={{ margin: 0, fontSize: 15 }}>
                                            支持DeepSeek、智谱AI、通义千问、OpenAI、火山引擎、阿里百炼等
                                        </Paragraph>
                                    </Space>
                                </AntCard>
                            </Col>
                            <Col xs={24} md={8}>
                                <AntCard size="small">
                                    <Space direction="vertical" size="small">
                                        <Space>
                                            <BookOutlined style={{ fontSize: 24 }} />
                                            <Text strong style={{ fontSize: 16 }}>
                                                {intl.formatMessage({ id: 'ai.knowledge.title' })}
                                            </Text>
                                        </Space>
                                        <Paragraph style={{ margin: 0, fontSize: 15 }}>
                                            对接Dify、Coze、RAGFlow等知识库平台
                                        </Paragraph>
                                    </Space>
                                </AntCard>
                            </Col>
                        </Row>
                    </>
                }
                type="info"
                style={{ marginBottom: 32, marginTop: 32 }}
            />

            <Title level={2}>{intl.formatMessage({ id: 'common.quickStart' })}</Title>
            <Card
                title={intl.formatMessage({ id: 'auth.userLogin' })}
                icon="user"
                href="/api/core/auth/login"
            >
                {intl.formatMessage({ id: 'auth.loginDescription' })}
            </Card>

            <Title level={2}>{intl.formatMessage({ id: 'common.authentication' })}</Title>

            <Title level={3}>{intl.formatMessage({ id: 'auth.bearerTokenAuth' })}</Title>
            <Paragraph>{intl.formatMessage({ id: 'auth.bearerTokenDescription' })}</Paragraph>
            <pre><code>Authorization: Bearer &lt;access_token&gt;</code></pre>

            <Title level={3}>{intl.formatMessage({ id: 'auth.accessTokenLogin' })}</Title>
            <Paragraph>{intl.formatMessage({ id: 'auth.accessTokenDescription' })}</Paragraph>
            <pre><code>GET /auth/login?accessToken=&lt;access_token&gt;</code></pre>

            <Title level={2}>{intl.formatMessage({ id: 'common.baseUrl' })}</Title>

            <Title level={3}>REST API</Title>
            <pre><code>https://api.weiyuai.cn/api/v1</code></pre>

            <Title level={3}>Web App (AccessToken {intl.formatMessage({ id: 'auth.userLogin' })})</Title>
            <pre><code>https://api.weiyuai.cn</code></pre>

            <Title level={2}>{intl.formatMessage({ id: 'common.apiModules' })}</Title>

            <CardGroup cols={2}>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.aiTitle' })}
                    icon="bot"
                    href="/api/ai/chat-completions"
                >
                    <Space>
                        <Text>{intl.formatMessage({ id: 'home.modules.aiDesc' })}</Text>
                        <Tag color="red" style={{ fontWeight: 'bold' }}>
                            🔥 HOT
                        </Tag>
                    </Space>
                </Card>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.authTitle' })}
                    icon="key"
                    href="/api/core/auth/login"
                >
                    {intl.formatMessage({ id: 'home.modules.authDesc' })}
                </Card>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.userTitle' })}
                    icon="user"
                    href="/api/core/users/profile"
                >
                    {intl.formatMessage({ id: 'home.modules.userDesc' })}
                </Card>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.threadTitle' })}
                    icon="message-circle"
                    href="/api/service/threads/list"
                >
                    {intl.formatMessage({ id: 'home.modules.threadDesc' })}
                </Card>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.messageTitle' })}
                    icon="send"
                    href="/api/service/messages/send"
                >
                    {intl.formatMessage({ id: 'home.modules.messageDesc' })}
                </Card>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.ticketTitle' })}
                    icon="ticket"
                    href="/api/ticket/create"
                >
                    {intl.formatMessage({ id: 'home.modules.ticketDesc' })}
                </Card>
            </CardGroup>

            <Title level={2}>{intl.formatMessage({ id: 'common.responseFormat' })}</Title>
            <Paragraph>All API responses follow a consistent JSON format:</Paragraph>
            <pre><code>{`{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}`}</code></pre>

            <Title level={2}>{intl.formatMessage({ id: 'common.errorHandling' })}</Title>
            <Paragraph>When an error occurs, the API returns an appropriate HTTP status code along with an error response:</Paragraph>
            <pre><code>{`{
  "error": 400,
  "message": "${intl.formatMessage({ id: 'error.badRequest' })}"
}`}</code></pre>
        </div>
    )
}