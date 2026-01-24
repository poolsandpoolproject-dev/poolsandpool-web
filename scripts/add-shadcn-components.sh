#!/bin/bash

# Script to add all essential shadcn/ui components at once
# Run this with: bash scripts/add-shadcn-components.sh

echo "Adding shadcn/ui components..."

# Essential components
npx shadcn@latest add button --yes
npx shadcn@latest add input --yes
npx shadcn@latest add card --yes
npx shadcn@latest add form --yes
npx shadcn@latest add table --yes
npx shadcn@latest add dialog --yes
npx shadcn@latest add select --yes
npx shadcn@latest add badge --yes
npx shadcn@latest add tabs --yes
npx shadcn@latest add calendar --yes
npx shadcn@latest add label --yes
npx shadcn@latest add textarea --yes
npx shadcn@latest add switch --yes
npx shadcn@latest add sheet --yes
npx shadcn@latest add dropdown-menu --yes
npx shadcn@latest add tooltip --yes
npx shadcn@latest add alert --yes

echo "✅ All components added successfully!"
