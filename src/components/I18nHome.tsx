import React from 'react'
import { useIntl } from 'react-intl'
import { Badge, Card, CardGroup } from '../components'

export const I18nHome: React.FC = () => {
    const intl = useIntl()

    return (
        <div>
            <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px'
            }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>
                    {intl.formatMessage({ id: 'common.quickNavigation' })}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <a href="api/core/auth/login" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#374151',
                        transition: 'all 0.2s'
                    }}>
                        <Badge variant="warning">POST</Badge>
                        <span>{intl.formatMessage({ id: 'auth.userLogin' })}</span>
                    </a>
                    <a href="api/core/users/profile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#374151',
                        transition: 'all 0.2s'
                    }}>
                        <Badge variant="success">GET</Badge>
                        <span>{intl.formatMessage({ id: 'user.profile' })}</span>
                    </a>
                    <a href="api/service/messages/send" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#374151',
                        transition: 'all 0.2s'
                    }}>
                        <Badge variant="warning">POST</Badge>
                        <span>{intl.formatMessage({ id: 'message.send' })}</span>
                    </a>
                    <a href="api/ticket/create" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#374151',
                        transition: 'all 0.2s'
                    }}>
                        <Badge variant="warning">POST</Badge>
                        <span>{intl.formatMessage({ id: 'ticket.create' })}</span>
                    </a>
                </div>
            </div>

            <h2>{intl.formatMessage({ id: 'common.overview' })}</h2>
            <p>{intl.formatMessage({ id: 'home.apiOverview' })}</p>

            {/* AI对话功能突出展示 */}
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '16px',
                padding: '32px',
                margin: '32px 0',
                color: '#0f172a',
                boxShadow: '0 10px 40px rgba(14, 165, 233, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '40px' }}>🤖</span>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: 'bold' }}>
                        {intl.formatMessage({ id: 'ai.title' })}
                    </h2>
                    <span style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                    }}>
                        ✨ 重点功能
                    </span>
                </div>
                <p style={{ margin: '0 0 24px 0', fontSize: '18px', lineHeight: '1.7', color: '#475569' }}>
                    {intl.formatMessage({ id: 'ai.description' })}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>🎯</span>
                            <strong style={{ color: '#1e293b', fontSize: '16px' }}>
                                {intl.formatMessage({ id: 'ai.multimodal.title' })}
                            </strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: '1.6' }}>
                            支持文本、图片、视频、文件等多模态智能对话交互
                        </p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>🌐</span>
                            <strong style={{ color: '#1e293b', fontSize: '16px' }}>
                                {intl.formatMessage({ id: 'ai.providers.title' })}
                            </strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: '1.6' }}>
                            支持DeepSeek、智谱AI、通义千问、OpenAI、火山引擎、阿里百炼等
                        </p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>📚</span>
                            <strong style={{ color: '#1e293b', fontSize: '16px' }}>
                                {intl.formatMessage({ id: 'ai.knowledge.title' })}
                            </strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: '1.6' }}>
                            对接Dify、Coze、RAGFlow等知识库平台
                        </p>
                    </div>
                </div>
            </div>

            <h2>{intl.formatMessage({ id: 'common.quickStart' })}</h2>
            <Card
                title={intl.formatMessage({ id: 'auth.userLogin' })}
                icon="user"
                href="/api/core/auth/login"
            >
                {intl.formatMessage({ id: 'auth.loginDescription' })}
            </Card>

            <h2>{intl.formatMessage({ id: 'common.authentication' })}</h2>

            <h3>{intl.formatMessage({ id: 'auth.bearerTokenAuth' })}</h3>
            <p>{intl.formatMessage({ id: 'auth.bearerTokenDescription' })}</p>
            <pre><code>Authorization: Bearer &lt;access_token&gt;</code></pre>

            <h3>{intl.formatMessage({ id: 'auth.accessTokenLogin' })}</h3>
            <p>{intl.formatMessage({ id: 'auth.accessTokenDescription' })}</p>
            <pre><code>GET /auth/login?accessToken=&lt;access_token&gt;</code></pre>

            <h2>{intl.formatMessage({ id: 'common.baseUrl' })}</h2>

            <h3>REST API</h3>
            <pre><code>https://api.weiyuai.cn/api/v1</code></pre>

            <h3>Web App (AccessToken {intl.formatMessage({ id: 'auth.userLogin' })})</h3>
            <pre><code>https://api.weiyuai.cn</code></pre>

            <h2>{intl.formatMessage({ id: 'common.apiModules' })}</h2>

            <CardGroup cols={2}>
                <Card
                    title={intl.formatMessage({ id: 'home.modules.aiTitle' })}
                    icon="bot"
                    href="/api/ai/chat-completions"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {intl.formatMessage({ id: 'home.modules.aiDesc' })}
                        <span style={{
                            background: '#f5222d',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            marginLeft: '4px'
                        }}>
                            🔥 HOT
                        </span>
                    </div>
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

            <h2>{intl.formatMessage({ id: 'common.responseFormat' })}</h2>
            <p>All API responses follow a consistent JSON format:</p>
            <pre><code>{`{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}`}</code></pre>

            <h2>{intl.formatMessage({ id: 'common.errorHandling' })}</h2>
            <p>When an error occurs, the API returns an appropriate HTTP status code along with an error response:</p>
            <pre><code>{`{
  "error": 400,
  "message": "${intl.formatMessage({ id: 'error.badRequest' })}"
}`}</code></pre>
        </div>
    )
}