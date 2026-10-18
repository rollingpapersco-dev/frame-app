import React from 'react'
import ReactDOM from 'react-dom/client'
// Self-hosted so the export capture can embed the font reliably.
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import Editor from './Editor.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>
)
