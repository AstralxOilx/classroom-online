"use client"
import setGolobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeColorsStateParams>(
    {} as ThemeColorsStateParams,

);

// สร้าง component `ThemeDataProvider` ที่จะเป็น provider ของธีมและจัดการสถานะธีม
export default function ThemeDataProvider({ children }: ThemeProviderProps) {
    const getSavedThemeColor = () => {
        try {
            // ฟังก์ชันนี้ใช้ดึงค่าธีมที่ถูกบันทึกไว้ใน localStorage ถ้าไม่มีค่าที่บันทึกไว้จะใช้ค่าเริ่มต้นเป็น "Zinc"
            return (localStorage.getItem("themeColor") as ThemeColors) || "Zinc";

        } catch (error) {
            // ถ้ามีข้อผิดพลาดเกิดขึ้น จะคืนค่าเริ่มต้นเป็น "Zinc"
            "Zinc" as ThemeColors;

        }

    };

    // สร้าง state สำหรับเก็บค่าสีของธีม โดยใช้ค่าที่ดึงมาจาก localStorage เป็นค่าเริ่มต้น
    const [themeColor, setThemeColor] = useState<ThemeColors>(
        getSavedThemeColor() as ThemeColors,

    );

    // สร้าง state `isMounted` เพื่อเช็คว่าคอมโพเนนท์นี้ถูก mount แล้วหรือยัง
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        // เมื่อ themeColor หรือ theme เปลี่ยนแปลง จะบันทึกค่า themeColor ลงใน localStorage
        localStorage.setItem("themeColor", themeColor);
        // เรียกใช้ฟังก์ชัน `setGolobalColorTheme` เพื่อกำหนดธีมและสีทั่วทั้งแอปพลิเคชัน
        setGolobalColorTheme(theme as "light" | "dark", themeColor);

        // ถ้าคอมโพเนนท์ยังไม่ถูก mount ให้ตั้งค่าว่า mount แล้ว
        if (!isMounted) {
            setIsMounted(true);
        }
    }, [themeColor, theme]); // useEffect นี้จะทำงานเมื่อค่า `themeColor` หรือ `theme` เปลี่ยนแปลง

    // ถ้าคอมโพเนนท์ยังไม่ถูก mount จะไม่แสดงอะไรเลย (null)
    if (!isMounted) {
        return null;
    }

    // คืนค่า `ThemeContext.Provider` เพื่อให้สามารถใช้ `themeColor` และ `setThemeColor` ได้ในส่วนอื่นๆ ของแอป
    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );


}
export function useThemeContext() {
    return useContext(ThemeContext);
}