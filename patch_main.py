import re

with open('src/main.tsx', 'r') as f:
    code = f.read()

import_old = "import App from './App.tsx';"
import_new = "import App from './App.tsx';\nimport { AuthProvider } from './contexts/AuthContext.tsx';"
code = code.replace(import_old, import_new)

render_old = """  <StrictMode>
    <App />
  </StrictMode>"""
render_new = """  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>"""
code = code.replace(render_old, render_new)

with open('src/main.tsx', 'w') as f:
    f.write(code)

