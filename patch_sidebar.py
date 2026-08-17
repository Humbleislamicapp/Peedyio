import re

with open('src/components/Sidebar.tsx', 'r') as f:
    code = f.read()

# Add missing lucide-react imports
imports_old = """  ChevronRight,
  ChevronDown
} from 'lucide-react';"""

imports_new = """  ChevronRight,
  ChevronDown,
  Layers,
  Scissors,
  Copy,
  ArrowLeftRight,
  Minimize2,
  GitCompare,
  ScanText,
  Lock
} from 'lucide-react';"""

code = code.replace(imports_old, imports_new)

# Update toolsItems
tools_old = """  const toolsItems = [
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
  ];"""

tools_new = """  const toolsItems = [
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
    { id: 'merge' as ViewMode, label: 'Merge', icon: Layers },
    { id: 'split_hub' as ViewMode, label: 'Split', icon: Scissors },
    { id: 'extract_hub' as ViewMode, label: 'Extract', icon: Copy },
    { id: 'convert_hub' as ViewMode, label: 'Convert', icon: ArrowLeftRight },
    { id: 'batch' as ViewMode, label: 'Compress', icon: Minimize2 },
    { id: 'compare_hub' as ViewMode, label: 'Compare', icon: GitCompare },
    { id: 'ocr_hub' as ViewMode, label: 'OCR', icon: ScanText },
    { id: 'protect_hub' as ViewMode, label: 'Protect', icon: Lock },
  ];"""

code = code.replace(tools_old, tools_new)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(code)

