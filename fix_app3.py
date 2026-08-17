import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

# I will just write a python script that matches each component block by looking for `<MergeTool` to `)}` and so on, but the easiest way is to just replace the whole `<div className="flex-1 overflow-y-auto flex flex-col">...` with a clean string.

