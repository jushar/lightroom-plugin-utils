#include "AgLuaUniverse.h"

#include <stdexcept>

AgLuaUniverse::AgLuaUniverse()
{
	// Get handle to AgKernel module (handles Lightrooms scripting)
	_agKernel = GetModuleHandleA("AgKernel");
	if (!_agKernel)
		throw std::runtime_error{ "Coult not find AgKernel module" };

	// Get ptr to lua main universe getter
	auto AgLuaUniverse_getMain = reinterpret_cast<AgLuaUniverse_getMain_t>(GetProcAddress(_agKernel, "AgLuaUniverse_getMain"));
	if (!AgLuaUniverse_getMain)
		throw std::runtime_error{ "Could not locate AgLuaUniverse_getMain function export" };

	// Get ptr to lua main universe
	_luaUniverse = AgLuaUniverse_getMain();
	if (!_luaUniverse)
		throw std::runtime_error{ "Could not get main Lua universe" };

	// Load functions we're interested in
	LoadFunctions();
}

void AgLuaUniverse::LoadFunctions()
{
	Functions.luaL_loadstring = reinterpret_cast<luaL_loadstring_t>(GetProcAddress(_agKernel, "luaL_loadstring"));
	if (!Functions.luaL_loadstring)
		throw std::runtime_error{ "Could not locate luaL_loadstring function export" };

	Functions.lua_pcall = reinterpret_cast<lua_pcall_t>(GetProcAddress(_agKernel, "lua_pcall"));
	if (!Functions.lua_pcall)
		throw std::runtime_error{ "Could not locate lua_pcall function export" };

	Functions.lua_tolstring = reinterpret_cast<lua_tolstring_t>(GetProcAddress(_agKernel, "lua_tolstring"));
	if (!Functions.lua_tolstring)
		throw std::runtime_error{ "Could not locate lua_tolstring function export" };
}

void AgLuaUniverse::LoadCode(const std::string& code)
{
	bool failed = Functions.luaL_loadstring(_luaUniverse->luaVM, code.c_str()) || Functions.lua_pcall(_luaUniverse->luaVM, 0, -1, 0);
	if (failed)
		throw std::runtime_error{ Functions.lua_tolstring(_luaUniverse->luaVM, -1, NULL) };
}
