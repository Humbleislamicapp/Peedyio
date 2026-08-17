import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

app = app.replace("""              onFileUpload={handleFileUpload}
            />
          )}""", "", 1)

app = app.replace("""              onOpenInEditor={handleOpenDocument}
              onFileUpload={handleFileUpload}
            />
          )}""", "", 1)

app = app.replace("""              onOpenInEditor={handleOpenDocument}
            />
          )}""", "", 1)


with open('src/App.tsx', 'w') as f:
    f.write(app)

