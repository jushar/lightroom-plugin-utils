@echo off

rem Copy dependencies
copy ..\bin\release\launcher.exe .
copy ..\bin\release\core.dll .

rem Build package
vsce package