import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

# Remove the entire Search bar wrapper
search_pattern = r'<div className="relative w-full max-w-md">.*?</div>'
content = re.sub(search_pattern, '', content, flags=re.DOTALL)

# Remove the Blank PDF and Upload PDF buttons
blank_pattern = r'\{/\* Quick Action: Blank PDF \*/\}.*?</button>'
content = re.sub(blank_pattern, '', content, flags=re.DOTALL)

upload_pattern = r'\{/\* Primary CTA: Upload PDF \*/\}.*?</button>'
content = re.sub(upload_pattern, '', content, flags=re.DOTALL)

# Add Plans/Pricing and Contact/Enterprise right before the Processed Locally Pill
# Wait, maybe after the mobile toggle and before right actions?
# Let's put them in the left side where the search bar was!
new_nav_links = """        <div className="hidden sm:flex items-center gap-6 ml-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Plans & Pricing</button>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Enterprise</button>
        </div>"""

# Find the end of the mobile toggle div (the one with flex-1 max-w-xl)
left_section_pattern = r'(<div className="flex items-center gap-3 flex-1 max-w-xl">.*?<Menu className="w-5 h-5" />\s*</button>)'
content = re.sub(left_section_pattern, r'\1\n' + new_nav_links, content, flags=re.DOTALL)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
print("Updated Header.tsx")
