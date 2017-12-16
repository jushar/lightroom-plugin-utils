#include <string>
#include <fstream>
#include <stdexcept>

#include <Windows.h>

#include "AgLuaUniverse.h"

bool WINAPI DllMain(HMODULE hDLL, DWORD reason, LPVOID)
{
	if (reason == DLL_PROCESS_ATTACH)
	{
		try
		{
			AgLuaUniverse universe;
			universe.LoadCode(R"~(
				local AgSdkPluginLoader = import("AgSdkPluginLoader")

				for k, plugin in AgSdkPluginLoader.enabledPlugins() do
					AgSdkPluginLoader.reloadPlugin(plugin)
				end
			)~");
		}
		catch (std::exception&)
		{
			// TODO: Add proper error handling
		}
	}

	return true;
}

extern "C" _declspec(dllexport) LRESULT WindowProcHook(int code, WPARAM wParam, LPARAM lParam)
{
	return CallNextHookEx(NULL, code, wParam, lParam);
}
