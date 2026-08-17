import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

pattern = r"(const \[userSignature, setUserSignature\] = useState<\{[^}]+\}>\(\{\}\);)"
replacement = r"\1\n  const [initialEditorMode, setInitialEditorMode] = useState<string>('edit');"

code = re.sub(pattern, replacement, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

