@REM Execute this script via cli or double click in file explorer or desktop.

set ProjectPath="C:\Users\user1\Desktop\GitHub\code-racer\" 
set DockerDesktop="C:\Program Files\Docker\Docker\Docker Desktop.exe"
@REM code / nvim / vim
set Editor=code
@REM firefox / chrome / msedge
set Browser=firefox

cd %ProjectPath%
call github .
call %DockerDesktop%
start cmd.exe /c npm run dev:db
start cmd.exe /k npm run dev:app
start cmd.exe /k npm run dev:wss
start %Browser% localhost:3000
call %Editor% .
