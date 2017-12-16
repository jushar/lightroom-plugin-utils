#pragma once
#include <string>
#include <cstdint>

#include <Windows.h>

struct lua_State;

struct AgLuaUniverseInterface
{
	lua_State* luaVM;
};

using AgLuaUniverse_getMain_t = AgLuaUniverseInterface * (*)();
using luaL_loadstring_t = int(*)(lua_State*, const char*);
using lua_pcall_t = int(*)(lua_State*, int, int, int);
using lua_tolstring_t = const char*(*)(lua_State*, int, std::size_t);

class AgLuaUniverse
{
public:
	AgLuaUniverse();

	void LoadFunctions();

	void LoadCode(const std::string& code);

private:
	HMODULE _agKernel;
	AgLuaUniverseInterface* _luaUniverse;

	struct {
		luaL_loadstring_t luaL_loadstring;
		lua_pcall_t lua_pcall;
		lua_tolstring_t lua_tolstring;
	} Functions;
};
