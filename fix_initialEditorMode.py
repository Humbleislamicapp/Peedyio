import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

state_old = """  const [userSignature, setUserSignature] = useState<{"""

state_new = """  const [initialEditorMode, setInitialEditorMode] = useState<string>('edit');
  const [userSignature, setUserSignature] = useState<{"""

code = code.replace(state_old, state_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

