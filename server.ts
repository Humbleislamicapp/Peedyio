import express from "express";
import path from "path";
import multer from "multer";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { readFile } from "node:fs/promises";
import { convert } from "docx-to-pdf-wasm";
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());

  // Prepare WebAssembly module once at startup
  let wasmModule: WebAssembly.Module;
  try {
    const wasmBytes = await readFile(path.join(process.cwd(), "node_modules", "docx-to-pdf-wasm", "build", "docx-to-pdf.wasm"));
    wasmModule = await WebAssembly.compile(wasmBytes);
    console.log("Loaded DOCX to PDF WebAssembly module");
  } catch (err) {
    console.error("Failed to load WASM module", err);
  }

  // API Route for DOCX -> PDF conversion
  app.post("/api/convert/docx", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      if (!wasmModule) {
        return res.status(500).json({ error: "WASM module not initialized" });
      }

      // Convert DOCX buffer to PDF buffer locally using WebAssembly
      const docxBytes = new Uint8Array(req.file.buffer);
      const pdfBytes = await convert(wasmModule, docxBytes);

      res.setHeader('Content-Type', 'application/pdf');
      res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
      console.error("DOCX Conversion Error:", error);
      res.status(500).json({ error: error.message || "Unknown error during conversion" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();
export default async function (req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
