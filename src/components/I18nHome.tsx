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
          <a href="api-reference/auth/login" style={{ 
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
          <a href="api-reference/users/profile" style={{ 
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
          <a href="api-reference/messages/send" style={{ 
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
          <a href="api-reference/tickets/create" style={{ 
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

      <h2>{intl.formatMessage({ id: 'common.quickStart' })}</h2>
      <Card
        title={intl.formatMessage({ id: 'auth.userLogin' })}
        icon="user"
        href="api-reference/auth/login"
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
          title={intl.formatMessage({ id: 'home.modules.authTitle' })}
          icon="key"
          href="api-reference/auth/login"
        >
          {intl.formatMessage({ id: 'home.modules.authDesc' })}
        </Card>
        <Card
          title={intl.formatMessage({ id: 'home.modules.userTitle' })}
          icon="user"
          href="api-reference/users/profile"
        >
          {intl.formatMessage({ id: 'home.modules.userDesc' })}
        </Card>
        <Card
          title={intl.formatMessage({ id: 'home.modules.threadTitle' })}
          icon="message-circle"
          href="api-reference/threads/list"
        >
          {intl.formatMessage({ id: 'home.modules.threadDesc' })}
        </Card>
        <Card
          title={intl.formatMessage({ id: 'home.modules.messageTitle' })}
          icon="send"
          href="api-reference/messages/send"
        >
          {intl.formatMessage({ id: 'home.modules.messageDesc' })}
        </Card>
        <Card
          title={intl.formatMessage({ id: 'home.modules.ticketTitle' })}
          icon="ticket"
          href="api-reference/tickets/create"
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