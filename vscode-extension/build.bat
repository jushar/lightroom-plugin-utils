@echo off

rem Copy dependencies
copy ..\bin\release\launcher.exe .
copy ..\bin\release\core.dll .

rem Copy README (to keep it synchronised)
copy ..\README.md .

rem Build package
vsce package