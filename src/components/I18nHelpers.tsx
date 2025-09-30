import React from 'react'
import { useIntl } from 'react-intl'

interface I18nTextProps {
  id: string
  values?: Record<string, any>
}

export const I18nText: React.FC<I18nTextProps> = ({ id, values }) => {
  const intl = useIntl()
  return <>{intl.formatMessage({ id }, values)}</>
}

interface I18nHeadingProps {
  id: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  style?: React.CSSProperties
}

export const I18nHeading: React.FC<I18nHeadingProps> = ({ id, level = 2, style }) => {
  const intl = useIntl()
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  return <Tag style={style}>{intl.formatMessage({ id })}</Tag>
}