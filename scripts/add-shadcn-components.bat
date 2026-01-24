@echo off
REM Script to add all essential shadcn/ui components at once (Windows)
REM Run this with: scripts\add-shadcn-components.bat

echo Adding shadcn/ui components...

REM Essential components
call npx shadcn@latest add button --yes
call npx shadcn@latest add input --yes
call npx shadcn@latest add card --yes
call npx shadcn@latest add form --yes
call npx shadcn@latest add table --yes
call npx shadcn@latest add dialog --yes
call npx shadcn@latest add select --yes
call npx shadcn@latest add badge --yes
call npx shadcn@latest add tabs --yes
call npx shadcn@latest add calendar --yes
call npx shadcn@latest add label --yes
call npx shadcn@latest add textarea --yes
call npx shadcn@latest add switch --yes
call npx shadcn@latest add sheet --yes
call npx shadcn@latest add dropdown-menu --yes
call npx shadcn@latest add tooltip --yes
call npx shadcn@latest add alert --yes

echo All components added successfully!
pause
