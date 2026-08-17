import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add cases for review, fill, sign
cases_to_add = """      case 'review_hub':
        setActiveView('review_hub');
        break;
      case 'fill_hub':
        setActiveView('fill_hub');
        break;
      case 'sign_hub':
        setActiveView('sign_hub');
        break;"""
        
code = code.replace("case 'ask_peedy':", cases_to_add + "\n      case 'ask_peedy':")

# Render EditHub for all of them
hub_render = """          {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub'].includes(activeView as string) && (
            <EditHub
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
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onFileUpload={handleFileUpload}
            />
          )}"""

code = re.sub(r"\{\s*activeView === 'edit_hub' && \(\s*<EditHub[^>]+>\s*\)\s*\}", hub_render, code, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(code)

