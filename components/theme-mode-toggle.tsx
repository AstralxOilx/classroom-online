"use client"
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
export function ThemeModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="transition ease-in-out delay-100  hover:scale-110  duration-200 bg-primary text-primary-foreground shadow hover:text-primary"
            >
            <Sun
                className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 translate-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
                className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 translate-all dark:-rotate-0 dark:scale-100"
            />
            <span className="sr-only">Toggle theme</span>

        </Button>
    );
}