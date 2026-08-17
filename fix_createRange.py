import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

target = """                  ref={(el) => {
                    if (el && isSelected && document.activeElement !== el && elem.text === 'Type text here...') {
                      el.focus();
                      // Set cursor to end
                      const range = document.createRange();"""

replacement = """                  ref={(el) => {
                    if (el && isSelected && window.document.activeElement !== el && elem.text === 'Type text here...') {
                      el.focus();
                      // Set cursor to end
                      const range = window.document.createRange();"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

