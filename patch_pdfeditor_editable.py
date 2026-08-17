import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

imports_target = "import { generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';"
imports_replacement = "import { generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';\nimport { convertToEditable } from '../../utils/makeEditable';"
code = code.replace(imports_target, imports_replacement)

state_target = "const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);"
state_replacement = "const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);\n  const [isMakingEditable, setIsMakingEditable] = useState(false);"
code = code.replace(state_target, state_replacement)

button_target = "{/* Right: Export & Download */}"
button_replacement = """{/* Right: Export & Download */}
        <div className="flex items-center gap-2">
          {doc.rawBytes && (
            <button
              onClick={async () => {
                setIsMakingEditable(true);
                try {
                  const editableDoc = await convertToEditable(doc);
                  setDoc(editableDoc);
                  pushDocChange(editableDoc);
                } catch (err) {
                  console.error("Failed to make editable:", err);
                } finally {
                  setIsMakingEditable(false);
                }
              }}
              disabled={isMakingEditable}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              {isMakingEditable ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              ) : (
                <Wrench className="w-3.5 h-3.5 text-indigo-500" />
              )}
              <span className="hidden md:inline">{isMakingEditable ? 'Converting...' : 'Make Editable'}</span>
            </button>
          )}"""
code = code.replace(button_target + '\n        <div className="flex items-center gap-2">', button_replacement)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

