project "launcher"
	language "C++"
	cppdialect "C++17"
	kind "ConsoleApp"

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
