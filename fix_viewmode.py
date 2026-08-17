import re

with open('src/types/pdf.ts', 'r') as f:
    code = f.read()

code = code.replace("  | 'edit_hub'", "  | 'edit_hub'\n  | 'review_hub'\n  | 'fill_hub'\n  | 'sign_hub'")

with open('src/types/pdf.ts', 'w') as f:
    f.write(code)

