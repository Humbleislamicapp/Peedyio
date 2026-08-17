import re

with open('src/components/EditHub.tsx', 'r') as f:
    code = f.read()

code = code.replace("interface EditHubProps {", "interface EditHubProps {\n  title?: string;\n  description?: string;")
code = code.replace("export const EditHub: React.FC<EditHubProps> = ({", "export const EditHub: React.FC<EditHubProps> = ({\n  title = 'Edit PDF Document',\n  description = 'Add text, highlight, draw, and annotate your PDF files directly in your browser.',")
code = code.replace("Edit PDF Document", "{title}")
code = code.replace("Add text, highlight, draw, and annotate your PDF files directly in your browser.", "{description}")

with open('src/components/EditHub.tsx', 'w') as f:
    f.write(code)

