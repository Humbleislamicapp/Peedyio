import re

with open('src/components/EditHub.tsx', 'r') as f:
    content = f.read()

recent_files_pattern = r'(\{/\* Recent Files \(Top\) \*/\}.*?(?=\{/\* Drag & Drop Zone \(Bottom\) \*/\}))'
upload_zone_pattern = r'(\{/\* Drag & Drop Zone \(Bottom\) \*/\}.*?(?=</div>\n    </div>\n  \);\n}))'

match_recent = re.search(recent_files_pattern, content, re.DOTALL)
match_upload = re.search(upload_zone_pattern, content, re.DOTALL)

if match_recent and match_upload:
    recent_text = match_recent.group(1)
    upload_text = match_upload.group(1)
    
    # Replace both blocks with flipped order
    # It's safer to just split and reconstruct
    # Actually, let's just do a string replacement
    
    # Replace "Recent Files (Top)" with "(Bottom)" and vice versa for comments
    recent_text_renamed = recent_text.replace('Recent Files (Top)', 'Recent Files (Bottom)')
    upload_text_renamed = upload_text.replace('Drag & Drop Zone (Bottom)', 'Drag & Drop Zone (Top)')
    
    new_content = content[:match_recent.start()] + upload_text_renamed + "\n\n        " + recent_text_renamed + content[match_upload.end():]
    
    with open('src/components/EditHub.tsx', 'w') as f:
        f.write(new_content)
    print("Successfully flipped order in EditHub.")
else:
    print("Could not find matching patterns.")
