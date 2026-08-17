with open('server.ts', 'r') as f:
    content = f.read()

new_content = content.replace(
    'import { createRequire } from "node:module";\nimport { convert } from "docx-to-pdf-wasm";\n\nconst require = createRequire(import.meta.url);',
    'import { convert } from "docx-to-pdf-wasm";'
)

new_content = new_content.replace(
    'const wasmBytes = await readFile(require.resolve("docx-to-pdf-wasm/wasm"));',
    'const wasmBytes = await readFile(path.join(process.cwd(), "node_modules", "docx-to-pdf-wasm", "build", "docx-to-pdf.wasm"));'
)

with open('server.ts', 'w') as f:
    f.write(new_content)
print("Updated server.ts")
