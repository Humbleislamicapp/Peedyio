import re

with open('src/types/pdf.ts', 'r') as f:
    code = f.read()

base_old = """export interface BaseElement {
  id: string;"""

base_new = """export interface BaseElement {
  id: string;
  isOriginal?: boolean;"""

code = code.replace(base_old, base_new)

with open('src/types/pdf.ts', 'w') as f:
    f.write(code)

