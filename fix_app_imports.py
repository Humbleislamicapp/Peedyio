import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

imports_old = """import { Layers, Scissors, Copy, Minimize2, PenTool, Lock, ArrowLeftRight, GitCompare, ScanText, Sparkles, Plus } from 'lucide-react';"""
imports_new = """import { Layers, Scissors, Copy, Minimize2, PenTool, Lock, ArrowLeftRight, GitCompare, ScanText, Sparkles, Plus, Edit3, MessageSquare, FormInput } from 'lucide-react';"""

code = code.replace(imports_old, imports_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

