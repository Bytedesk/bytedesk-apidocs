import React from 'react'
import { Alert } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

// Alerts
export const Info = ({ children }: WithChildren) => (
  <Alert type="info" message={<div>{children}</div>} showIcon />
)

export const Tip = ({ children }: WithChildren) => (
  <Alert type="success" message={<div>{children}</div>} showIcon />
)

export const Warning = ({ children }: WithChildren) => (
  <Alert type="warning" message={<div>{children}</div>} showIcon />
)

export const Note = Info
export const Check = Tip

export function Update({ label, description, children }: WithChildren<{ label?: string; description?: string }>) {
  return <Alert type="info" message={label || 'Update'} description={description || children} showIcon />
}

export function SnippetIntro() {
  return <Alert type="info" message="Snippet introduction" showIcon />
}