const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Vercel handles the listening part for serverless functions, so we need to export the app
code = code.replace(
  '  app.listen(PORT, "0.0.0.0", () => {\n    console.log(`Server running on http://localhost:${PORT}`);\n  });\n}\n\nstartServer();',
  '  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {\n    app.listen(PORT, "0.0.0.0", () => {\n      console.log(`Server running on http://localhost:${PORT}`);\n    });\n  }\n\n  return app;\n}\n\nconst appPromise = startServer();\nexport default async function (req: any, res: any) {\n  const app = await appPromise;\n  return app(req, res);\n}'
);

fs.writeFileSync('server.ts', code);
