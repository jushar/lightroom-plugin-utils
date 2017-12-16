# Lightroom Plugin Development Utilities
This project aims to improve the Lightroom plugin development process.
It mainly consists of a backend application that excessively uses the Windows API to interact with Lightroom and a Visual Studio Code extension for the best user convenience.

## Features
### Plugin Reload
One of the most annoying things you experience while developing plugins for Lightroom is that there is no shortcut for reloading the plugin (in order to apply changes made to the script files).   

To get this fixed, this project provides an application that hooks into Lightroom's internal scripting engine (which is different from the one exposed to plugins) and utilises it to reload all (enabled) plugins. This approach is much more fail-safe compared to hotkey automation and more flexible as it allows for using the whole power of Lightroom's internal scripting engine.   

Even though the required documentation of the scripting engine was gathered using reverse engineering techniques, it's pretty stable as the DLL export interface is comprehensive enough to get everything to work.

### Test Explorer (Planned)
To be able to efficiently utilise Test-driven Development (TDD), some kind of tool support is necessary. For this reason, it'd be cool to implement a Visual Studio Code extension that shows a test explorer (that is similar to Visual Studio's). Also, tests should get executed either on reload or by invoking a VSCode command.   
The best approach to implement this might be to provide an HTTP API with a REST endpoint that interacts with the test explorer (and updates the test statuses).

## Building
### Backend Application
As a requirement, you need Visual Studio 2017 with C++ development components installed.

1. Create the Visual Studio solution files by invoking premake via `create-projects.bat`. You'll find the generated files in the _build_ folder.
2. Navigate to the _build_ folder an open `lightroom-plugin-utils.sln` in Visual Studio.
3. Now, build the solution in _Release_ (Win64) configuration.
4. You'll find the resulting binaries in the _bin_ folder.

### Visual Studio Code Extension
Make sure you have built the backend application before building the extension (as it's a direct requirement).

The next step is to navigate to the _vscode-extension_ folder and to install all required dependencies which are in fact:
```
npm install -g vsce
npm install
```

Then, you're finished by executing `build.bat`. The outcome is a vsix extension file that can be installed directly or later on uploaded to the marketplace.
