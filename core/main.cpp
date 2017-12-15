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
				local file = io.open("C:\\Users\\VM\\test.txt", "w")
				
				function dumpTable(t)
                    file:write("\n\n---------------------------\n")
					for k, v in pairs(t) do
						file:write(tostring(k).." = "..tostring(v).."\n")
					end
				end

				local AgSdkPluginLoader = import("AgSdkPluginLoader")
				for k, plugin in AgSdkPluginLoader.allPlugins() do
					file:write(tostring(k).." = "..tostring(plugin).."\n")
					AgSdkPluginLoader.reloadPlugin(plugin)
				end

				file:close()
			)~");
		}
		catch (std::exception& ex)
		{
		}
	}

	return true;
}

extern "C" _declspec(dllexport) LRESULT WindowProcHook(int code, WPARAM wParam, LPARAM lParam)
{
	return CallNextHookEx(NULL, code, wParam, lParam);
}
