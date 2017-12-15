project "core"
	language "C++"
	cppdialect "C++17"
	kind "SharedLib"

	vpaths {
		["Headers/*"] = "**.h",
		["Sources/*"] = "**.cpp",
		["*"] = "premake5.lua"
	}

	files {
		"premake5.lua",

		"**.h",
		"**.cpp",
	}
