import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import App from './pages/App'
import { mdxComponents } from './mdx-components'
import './styles.css'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/apidocs">
      <MDXProvider components={mdxComponents as any}>
        <App />
      </MDXProvider>
    </BrowserRouter>
  </React.StrictMode>
)
