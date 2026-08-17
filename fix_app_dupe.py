import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

dupes = """      case 'ask_peedy':
        setActiveView('ask_peedy');
        break;
      case 'protect':
        setActiveView('protect');
        break;
      case 'batch':
        setActiveView('batch');
        break;"""

fixed = """      case 'ask_peedy':
        setActiveView('ask_peedy');
        break;"""

code = code.replace(dupes, fixed)

with open('src/App.tsx', 'w') as f:
    f.write(code)

