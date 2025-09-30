import React from 'react'
import { useIntl } from 'react-intl'
import { Card, Row, Col, Divider, Badge, Typography } from 'antd'
import { 
  MessageOutlined, 
  PictureOutlined, 
  VideoCameraOutlined, 
  FileTextOutlined,
  RobotOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

// AI 对话功能总览组件
export const AiOverview: React.FC = () => {
  const intl = useIntl()
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <RobotOutlined style={{ color: '#1890ff' }} />
        {intl.formatMessage({ id: 'ai.title' })}
      </Title>
      <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
        {intl.formatMessage({ id: 'ai.description' })}
      </Paragraph>
    </div>
  )
}

// 多模态对话支持组件
export const MultimodalSupport: React.FC = () => {
  const intl = useIntl()
  
  const features = [
    {
      key: 'text',
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: intl.formatMessage({ id: 'ai.multimodal.text' }),
      description: intl.formatMessage({ id: 'ai.multimodal.textDesc' })
    },
    {
      key: 'image', 
      icon: <PictureOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      title: intl.formatMessage({ id: 'ai.multimodal.image' }),
      description: intl.formatMessage({ id: 'ai.multimodal.imageDesc' })
    },
    {
      key: 'video',
      icon: <VideoCameraOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      title: intl.formatMessage({ id: 'ai.multimodal.video' }),
      description: intl.formatMessage({ id: 'ai.multimodal.videoDesc' })
    },
    {
      key: 'file',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      title: intl.formatMessage({ id: 'ai.multimodal.file' }),
      description: intl.formatMessage({ id: 'ai.multimodal.fileDesc' })
    }
  ]
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ThunderboltOutlined style={{ color: '#faad14' }} />
        {intl.formatMessage({ id: 'ai.multimodal.title' })}
      </Title>
      <Paragraph style={{ marginBottom: '1.5rem', color: '#666' }}>
        {intl.formatMessage({ id: 'ai.multimodal.description' })}
      </Paragraph>
      
      <Row gutter={[16, 16]}>
        {features.map((feature) => (
          <Col xs={24} sm={12} md={6} key={feature.key}>
            <Card 
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              bodyStyle={{ padding: '24px 16px' }}
            >
              <div style={{ marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <Title level={5} style={{ marginBottom: '12px' }}>
                {feature.title}
              </Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {feature.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

// AI 服务商对接组件
export const AiProviders: React.FC = () => {
  const intl = useIntl()
  
  const providers = [
    {
      key: 'deepseek',
      name: intl.formatMessage({ id: 'ai.providers.deepseek' }),
      description: intl.formatMessage({ id: 'ai.providers.deepseekDesc' }),
      color: '#1890ff',
      flag: '🤖'
    },
    {
      key: 'zhipu',
      name: intl.formatMessage({ id: 'ai.providers.zhipu' }),
      description: intl.formatMessage({ id: 'ai.providers.zhipuDesc' }),
      color: '#13c2c2',
      flag: '🧠'
    },
    {
      key: 'qwen',
      name: intl.formatMessage({ id: 'ai.providers.qwen' }),
      description: intl.formatMessage({ id: 'ai.providers.qwenDesc' }),
      color: '#722ed1',
      flag: '🇨🇳'
    },
    {
      key: 'openai',
      name: intl.formatMessage({ id: 'ai.providers.openai' }),
      description: intl.formatMessage({ id: 'ai.providers.openaiDesc' }),
      color: '#52c41a',
      flag: '🤖'
    },
    {
      key: 'openrouter',
      name: intl.formatMessage({ id: 'ai.providers.openrouter' }),
      description: intl.formatMessage({ id: 'ai.providers.openrouterDesc' }),
      color: '#fa8c16',
      flag: '🌐'
    },
    {
      key: 'volcano',
      name: intl.formatMessage({ id: 'ai.providers.volcano' }),
      description: intl.formatMessage({ id: 'ai.providers.volcanoDesc' }),
      color: '#eb2f96',
      flag: '🔥'
    },
    {
      key: 'alibaba',
      name: intl.formatMessage({ id: 'ai.providers.alibaba' }),
      description: intl.formatMessage({ id: 'ai.providers.alibabaDesc' }),
      color: '#faad14',
      flag: '☁️'
    }
  ]
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <GlobalOutlined style={{ color: '#1890ff' }} />
        {intl.formatMessage({ id: 'ai.providers.title' })}
      </Title>
      <Paragraph style={{ marginBottom: '1.5rem', color: '#666' }}>
        {intl.formatMessage({ id: 'ai.providers.description' })}
      </Paragraph>
      
      <Row gutter={[16, 16]}>
        {providers.map((provider) => (
          <Col xs={24} sm={12} md={8} key={provider.key}>
            <Card 
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>
                  {provider.flag}
                </span>
                <Title level={5} style={{ margin: 0, flex: 1 }}>
                  {provider.name}
                </Title>
                <Badge color={provider.color} />
              </div>
              <Text style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {provider.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

// 知识库对接组件
export const KnowledgeBaseIntegration: React.FC = () => {
  const intl = useIntl()
  
  const platforms = [
    {
      key: 'dify',
      name: intl.formatMessage({ id: 'ai.knowledge.dify' }),
      description: intl.formatMessage({ id: 'ai.knowledge.difyDesc' }),
      icon: '🚀',
      color: '#52c41a'
    },
    {
      key: 'coze',
      name: intl.formatMessage({ id: 'ai.knowledge.coze' }),
      description: intl.formatMessage({ id: 'ai.knowledge.cozeDesc' }),
      icon: '🤖',
      color: '#1890ff'
    },
    {
      key: 'ragflow',
      name: intl.formatMessage({ id: 'ai.knowledge.ragflow' }),
      description: intl.formatMessage({ id: 'ai.knowledge.ragflowDesc' }),
      icon: '📚',
      color: '#722ed1'
    }
  ]
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DatabaseOutlined style={{ color: '#722ed1' }} />
        {intl.formatMessage({ id: 'ai.knowledge.title' })}
      </Title>
      <Paragraph style={{ marginBottom: '1.5rem', color: '#666' }}>
        {intl.formatMessage({ id: 'ai.knowledge.description' })}
      </Paragraph>
      
      <Row gutter={[16, 16]}>
        {platforms.map((platform) => (
          <Col xs={24} sm={8} key={platform.key}>
            <Card 
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              bodyStyle={{ padding: '24px 20px' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                {platform.icon}
              </div>
              <Title level={5} style={{ marginBottom: '12px' }}>
                <Badge color={platform.color} style={{ marginRight: '8px' }} />
                {platform.name}
              </Title>
              <Text style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {platform.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

// 完整的AI功能展示组件
export const AiFeatures: React.FC = () => {
  return (
    <div style={{ padding: '0 24px' }}>
      <AiOverview />
      <Divider />
      <MultimodalSupport />
      <Divider />
      <AiProviders />
      <Divider />
      <KnowledgeBaseIntegration />
    </div>
  )
}

export default AiFeatures