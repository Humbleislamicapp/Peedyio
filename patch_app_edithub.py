import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

edithub_pattern = r'<EditHub\s+title=\{.*?/>'

new_edithub = """<EditHub
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
                'PDF Tool'
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
                'Select a file to continue.'
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
                FileText
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
                'bg-blue-100 text-blue-600'
              }
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onFileUpload={handleFileUpload}
              onNewBlankDocument={handleCreateBlankDocument}
            />"""

content = re.sub(edithub_pattern, new_edithub, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx with EditHub props")
