import React from 'react'
import { Select } from 'antd'
import { useI18n } from './I18nProvider'
import { locales } from '../locales'

const { Option } = Select

interface LanguageSelectorProps {
  style?: React.CSSProperties
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { locale, setLocale } = useI18n()

  const handleChange = (value: string) => {
    setLocale(value)
  }

  return (
    <Select
      value={locale}
      onChange={handleChange}
      style={{ 
        minWidth: 120, 
        ...style 
      }}
      size="small"
      variant="borderless"
      styles={{
        popup: {
          root: {
            minWidth: 140
          }
        }
      }}
    >
      {locales.map((loc) => (
        <Option key={loc.code} value={loc.code}>
          <span style={{ marginRight: 6 }}>{loc.flag}</span>
          {loc.name}
        </Option>
      ))}
    </Select>
  )
}