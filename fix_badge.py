import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    home = f.read()

# Update the generic type of allTools or just add an optional badge property to the first one so TypeScript knows about it
home = home.replace("""  // Extended tools suite
  const allTools = [
    {
      id: 'organize_hub',""", """  // Extended tools suite
  const allTools: Array<{id: string, title: string, desc: string, icon: any, color: string, badge?: string}> = [
    {
      id: 'organize_hub',""")

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(home)
