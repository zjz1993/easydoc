import { createRoot } from 'react-dom/client'
import siteData from 'easydoc:site-data'
import { App } from './App'

function renderInBrowser() {
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }
  console.log('siteData是', siteData)
  createRoot(containerEl).render(<App />)
}

renderInBrowser()
