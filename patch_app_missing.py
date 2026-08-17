import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Update handleSelectTool to handle compare and compress
tool_old = """      case 'sign':
        setActiveView(hasDoc ? 'sign' : 'sign_hub');
        break;"""

tool_new = """      case 'sign':
        setActiveView(hasDoc ? 'sign' : 'sign_hub');
        break;
      case 'compress':
        setActiveView('batch');
        break;
      case 'compare':
        setActiveView(hasDoc ? 'compare' : 'compare_hub');
        break;"""

code = code.replace(tool_old, tool_new)

# Update handleOpenDocument to handle compare_hub
open_old = """    } else if (activeView === 'convert_hub') {
      setActiveView('convert');
      return;
    }"""

open_new = """    } else if (activeView === 'convert_hub') {
      setActiveView('convert');
      return;
    } else if (activeView === 'compare_hub') {
      setActiveView('compare');
      return;
    }"""

code = code.replace(open_old, open_new)

# Update EditHub include list and props
hub_old = """          {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub', 'split_hub', 'extract_hub', 'protect_hub', 'ocr_hub', 'convert_hub'].includes(activeView as string) && (
            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                activeView === 'split_hub' ? 'Split PDF Document' :
                activeView === 'extract_hub' ? 'Extract Pages' :
                activeView === 'protect_hub' ? 'Protect PDF' :
                activeView === 'ocr_hub' ? 'OCR PDF' :
                activeView === 'convert_hub' ? 'Convert PDF' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                activeView === 'split_hub' ? 'Separate one page or a whole set for easy conversion into independent PDF files.' :
                activeView === 'extract_hub' ? 'Pull specific pages from a file to create a new PDF document instantly.' :
                activeView === 'protect_hub' ? 'Add passwords and restrict permissions to secure your document.' :
                activeView === 'ocr_hub' ? 'Make scanned text selectable and searchable.' :
                activeView === 'convert_hub' ? 'Convert your PDF to Word, Excel, and other formats instantly.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                activeView === 'split_hub' ? Scissors :
                activeView === 'extract_hub' ? Copy :
                activeView === 'protect_hub' ? Lock :
                activeView === 'ocr_hub' ? ScanText :
                activeView === 'convert_hub' ? ArrowLeftRight :
                PenTool
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'split_hub' ? 'bg-rose-100 text-rose-600' :
                activeView === 'extract_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'protect_hub' ? 'bg-slate-100 text-slate-600' :
                activeView === 'ocr_hub' ? 'bg-fuchsia-100 text-fuchsia-600' :
                activeView === 'convert_hub' ? 'bg-indigo-100 text-indigo-600' :
                'bg-amber-100 text-amber-600'
              }"""

hub_new = """          {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub', 'split_hub', 'extract_hub', 'protect_hub', 'ocr_hub', 'convert_hub', 'compare_hub'].includes(activeView as string) && (
            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                activeView === 'split_hub' ? 'Split PDF Document' :
                activeView === 'extract_hub' ? 'Extract Pages' :
                activeView === 'protect_hub' ? 'Protect PDF' :
                activeView === 'ocr_hub' ? 'OCR PDF' :
                activeView === 'convert_hub' ? 'Convert PDF' :
                activeView === 'compare_hub' ? 'Compare PDF' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                activeView === 'split_hub' ? 'Separate one page or a whole set for easy conversion into independent PDF files.' :
                activeView === 'extract_hub' ? 'Pull specific pages from a file to create a new PDF document instantly.' :
                activeView === 'protect_hub' ? 'Add passwords and restrict permissions to secure your document.' :
                activeView === 'ocr_hub' ? 'Make scanned text selectable and searchable.' :
                activeView === 'convert_hub' ? 'Convert your PDF to Word, Excel, and other formats instantly.' :
                activeView === 'compare_hub' ? 'Spot visual and text differences between two PDF files instantly.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                activeView === 'split_hub' ? Scissors :
                activeView === 'extract_hub' ? Copy :
                activeView === 'protect_hub' ? Lock :
                activeView === 'ocr_hub' ? ScanText :
                activeView === 'convert_hub' ? ArrowLeftRight :
                activeView === 'compare_hub' ? GitCompare :
                PenTool
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'split_hub' ? 'bg-rose-100 text-rose-600' :
                activeView === 'extract_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'protect_hub' ? 'bg-slate-100 text-slate-600' :
                activeView === 'ocr_hub' ? 'bg-fuchsia-100 text-fuchsia-600' :
                activeView === 'convert_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'compare_hub' ? 'bg-cyan-100 text-cyan-600' :
                'bg-amber-100 text-amber-600'
              }"""

code = code.replace(hub_old, hub_new)

# Add missing tools rendering to App.tsx
render_old = """          {activeView === 'protect' && (
            <ProtectTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}"""

render_new = """          {activeView === 'protect' && (
            <ProtectTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}
          {activeView === 'convert' && (
            <ConvertTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'compare' && (
            <CompareTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'ocr' && (
            <OcrTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
            />
          )}"""

code = code.replace(render_old, render_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

