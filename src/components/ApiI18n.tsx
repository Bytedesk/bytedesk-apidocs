import React from 'react'
import { useIntl } from 'react-intl'

interface ApiDocHeaderProps {
  titleKey: string
  descriptionKey: string
  endpoint: string
  method: string
}

export const ApiDocHeader: React.FC<ApiDocHeaderProps> = ({ 
  titleKey, 
  descriptionKey, 
  endpoint, 
  method 
}) => {
  const intl = useIntl()
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px' 
    }}>
      <div>
        <h1 style={{ margin: 0 }}>
          {intl.formatMessage({ id: titleKey })}
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>
          {intl.formatMessage({ id: descriptionKey })}
        </p>
      </div>
      {/* TryButton will be added by the MDX file */}
    </div>
  )
}

interface ApiSectionProps {
  titleKey: string
  children: React.ReactNode
}

export const ApiSection: React.FC<ApiSectionProps> = ({ titleKey, children }) => {
  const intl = useIntl()
  
  return (
    <div>
      <h2>{intl.formatMessage({ id: titleKey })}</h2>
      {children}
    </div>
  )
}

interface ApiFieldProps {
  name: string
  descriptionKey: string
  required?: boolean
}

export const ApiField: React.FC<ApiFieldProps> = ({ name, descriptionKey, required = false }) => {
  const intl = useIntl()
  
  return (
    <div style={{ marginBottom: '8px' }}>
      <code style={{ fontWeight: 'bold' }}>{name}</code>
      {required && (
        <span style={{ 
          color: '#dc2626', 
          marginLeft: '8px', 
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {intl.formatMessage({ id: 'api.required' })}
        </span>
      )}
      : {intl.formatMessage({ id: descriptionKey })}
    </div>
  )
}

interface ApiUsageListProps {
  items: string[]
}

export const ApiUsageList: React.FC<ApiUsageListProps> = ({ items }) => {
  const intl = useIntl()
  
  return (
    <ul>
      {items.map((itemKey, index) => (
        <li key={index}>{intl.formatMessage({ id: itemKey })}</li>
      ))}
    </ul>
  )
}

interface ApiSecurityListProps {
  items: string[]
}

export const ApiSecurityList: React.FC<ApiSecurityListProps> = ({ items }) => {
  const intl = useIntl()
  
  return (
    <ul>
      {items.map((itemKey, index) => (
        <li key={index}>{intl.formatMessage({ id: itemKey })}</li>
      ))}
    </ul>
  )
}

interface ApiLoginMethodsProps {}

export const ApiLoginMethods: React.FC<ApiLoginMethodsProps> = () => {
  const intl = useIntl()
  
  return (
    <ul>
      <li>
        <strong>{intl.formatMessage({ id: 'auth.loginMethodUsername' })}</strong>: {intl.formatMessage({ id: 'auth.loginMethodUsernameDesc' })}
      </li>
      <li>
        <strong>{intl.formatMessage({ id: 'auth.loginMethodMobile' })}</strong>: {intl.formatMessage({ id: 'auth.loginMethodMobileDesc' })}
      </li>
      <li>
        <strong>{intl.formatMessage({ id: 'auth.loginMethodEmail' })}</strong>: {intl.formatMessage({ id: 'auth.loginMethodEmailDesc' })}
      </li>
      <li>
        <strong>{intl.formatMessage({ id: 'auth.loginMethodCode' })}</strong>: {intl.formatMessage({ id: 'auth.loginMethodCodeDesc' })}
      </li>
    </ul>
  )
}

interface ApiUserStatusProps {}

export const ApiUserStatus: React.FC<ApiUserStatusProps> = () => {
  const intl = useIntl()
  
  return (
    <div>
      <ul>
        <li><strong>ACTIVE</strong>: {intl.formatMessage({ id: 'user.statusActive' })}</li>
        <li><strong>INACTIVE</strong>: {intl.formatMessage({ id: 'user.statusInactive' })}</li>
        <li><strong>BANNED</strong>: {intl.formatMessage({ id: 'user.statusBanned' })}</li>
      </ul>
    </div>
  )
}