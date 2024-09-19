"use client"
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/context/theme-data-provider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const availableThemeColors = [
    { name: "Zinc", light: "bg-zinc-700", dark: "bg-zinc-700" },
    { name: "Rose", light: "bg-rose-700", dark: "bg-rose-700" },
    { name: "Blue", light: "bg-blue-700", dark: "bg-blue-700" },
    { name: "Green", light: "bg-green-700", dark: "bg-green-700" },
];

export function ThemeColorToggle() {
    const { themeColor, setThemeColor } = useThemeContext();
    const { theme } = useTheme();

    const createSelectItems = () => {
        return availableThemeColors.map(({ name, light, dark }) => (
            <SelectItem key={name} value={name} >
                <div className="flex items-center space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100">
                    <div className={cn(
                        "rounded-sm",
                        "w-[20px]",
                        "h-[20px]",
                        theme == "light" ? light : dark,

                    )}
                    ></div>
                    <div className="transition ease-in-out delay-100  hover:scale-110  duration-200 text-sm">{name}</div>
                </div>
            </SelectItem >
        ));
    };
    return (
        <Select
            onValueChange={(value) => setThemeColor(value as ThemeColors)}
            defaultValue={themeColor}
        >
            <SelectTrigger className="w-[110px] ring-offset-transparent focus:ring-transparent ">
                <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent className="border-muted">
                {createSelectItems()}
            </SelectContent>
        </Select>
    );

}