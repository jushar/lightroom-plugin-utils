#include <iostream>

#include <Windows.h>

const char* kCoreDllPath = "core.dll";

int main(int argc, char* argv[])
{
	// Load dll into our address space
	HMODULE hCoreDll = LoadLibraryA(kCoreDllPath);
	if (!hCoreDll)
	{
		std::cout << "Could not find or load core.dll" << std::endl;
		return 1;
	}

	// Find hook procedure
	HOOKPROC hookAddr = reinterpret_cast<HOOKPROC>(GetProcAddress(hCoreDll, "WindowProcHook"));
	if (!hookAddr)
	{
		std::cout << "WindowProcHook not found in core.dll" << std::endl;
		return 1;
	}

	// Find Lightroom window
	HWND hTargetWnd = FindWindowA("AgWinMainFrame", NULL);
	if (!hTargetWnd)
	{
		std::cout << "Lightroom window not found. Make sure Lightroom is running" << std::endl;
		return 1;
	}
	
	// Get window associated thread id and hook into the process
	DWORD targetThreadId = GetWindowThreadProcessId(hTargetWnd, nullptr);
	HHOOK hHook = SetWindowsHookExA(WH_CALLWNDPROC, hookAddr, hCoreDll, targetThreadId);

	// Bring window to the top to call message loop events (that invokes the hook)
	BringWindowToTop(hTargetWnd);

	// Unregister from hook chain
	UnhookWindowsHookEx(hHook);

	return 0;
}
