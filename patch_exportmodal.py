import re

with open('src/components/modals/ExportModal.tsx', 'r') as f:
    code = f.read()

target = "const [fileName, setFileName] = useState(doc.name);"
replacement = """const [fileName, setFileName] = useState(() => {
    let name = doc.name;
    if (!name.includes('_copy')) {
      name = name.replace('.pdf', '') + '_copy.pdf';
    }
    return name;
  });
  
  React.useEffect(() => {
    if (isOpen) {
      let name = doc.name;
      if (!name.includes('_copy')) {
        name = name.replace('.pdf', '') + '_copy.pdf';
      }
      setFileName(name);
    }
  }, [isOpen, doc.name]);"""

code = code.replace(target, replacement)

with open('src/components/modals/ExportModal.tsx', 'w') as f:
    f.write(code)

