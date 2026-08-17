import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

edithub_old = """            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              recentDocuments={documents}"""

edithub_new = """            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                PenTool
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                'bg-amber-100 text-amber-600'
              }
              recentDocuments={documents}"""

code = code.replace(edithub_old, edithub_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

