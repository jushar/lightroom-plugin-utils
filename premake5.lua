workspace "lightroom-plugin-utils"
	configurations { "Debug", "Release" }
	platforms { "Win64" }
	location "build"
	startproject "launcher"

	defines { "_CRT_SECURE_NO_WARNINGS", "WIN32_LEAN_AND_MEAN", "NOMINMAX" }

	filter { "platforms:Win64" }
		system "Windows"
		architecture "x64"

	filter "configurations:Debug"
		targetdir "bin/debug"
		defines { "DEBUG" }

	filter "configurations:Release"
		targetdir "bin/release"
		optimize "Full"

	filter {}
		include "launcher"
		include "core"
