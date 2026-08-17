with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace("        </div>\n        </div>\n      </aside>", "        </div>\n      </aside>")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
