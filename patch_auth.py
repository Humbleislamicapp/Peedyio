import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

# Update UsageLimit interface
old_interface = """interface UsageLimit {
  exportsCount: number;
  lastExportDate: string;
}"""
new_interface = """interface UsageLimit {
  exportsCount: number;
  lastExportDate: string;
  tier: 'free' | 'pro' | 'team';
  aiActionsCount: number;
  documentsCount: number;
}"""
content = content.replace(old_interface, new_interface)

# Update syncUserDocument
old_create = """        await setDoc(userRef, {
          email: auth.currentUser?.email || '',
          exportsCount: 0,
          lastExportDate: today,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setUsageLimit({ exportsCount: 0, lastExportDate: today });"""
new_create = """        await setDoc(userRef, {
          email: auth.currentUser?.email || '',
          exportsCount: 0,
          lastExportDate: today,
          tier: 'free',
          aiActionsCount: 0,
          documentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setUsageLimit({ exportsCount: 0, lastExportDate: today, tier: 'free', aiActionsCount: 0, documentsCount: 0 });"""
content = content.replace(old_create, new_create)

old_else = """        const data = userSnap.data();
        const lastExportDate = data.lastExportDate || today;
        let exportsCount = data.exportsCount || 0;

        // Reset if it's a new day
        if (lastExportDate !== today) {
          exportsCount = 0;
          await updateDoc(userRef, {
            exportsCount: 0,
            lastExportDate: today,
            updatedAt: serverTimestamp()
          });
        }
        
        setUsageLimit({ exportsCount, lastExportDate: today });"""
new_else = """        const data = userSnap.data();
        const lastExportDate = data.lastExportDate || today;
        let exportsCount = data.exportsCount || 0;
        let tier = data.tier || 'free';
        let aiActionsCount = data.aiActionsCount || 0;
        let documentsCount = data.documentsCount || 0;

        // Reset if it's a new day (for exports)
        if (lastExportDate !== today) {
          exportsCount = 0;
          await updateDoc(userRef, {
            exportsCount: 0,
            lastExportDate: today,
            updatedAt: serverTimestamp()
          });
        }
        
        setUsageLimit({ exportsCount, lastExportDate: today, tier, aiActionsCount, documentsCount });"""
content = content.replace(old_else, new_else)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
