with open('src/App.tsx', 'r') as f:
    content = f.read()

new_modals = """      </main>

      {/* Global Modals */}
      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)} 
          onEnterpriseClick={() => setShowEnterpriseContact(true)} 
        />
      )}
      
      {showEnterpriseContact && (
        <EnterpriseContactModal 
          onClose={() => setShowEnterpriseContact(false)} 
        />
      )}"""

content = content.replace("      </main>\n\n      {/* Global Modals */}", new_modals)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx modals")
