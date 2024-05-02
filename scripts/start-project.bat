@REM Execute this script via cli or double click in file explorer or desktop.

set ProjectPath="/Users/abigailconway/cs4340/code-racer-cs4340-team3/" 
set DockerDesktop="/Applications/Docker.app"
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
