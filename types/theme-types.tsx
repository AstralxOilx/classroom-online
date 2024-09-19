type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green";//ประเภท (type) ที่ใช้ในการระบุค่าที่เป็นไปได้สำหรับธีมสีในแอปพลิเคชัน

//interface ที่ใช้ในการกำหนดรูปแบบของอ็อบเจ็กต์ที่ใช้ในการจัดการสถานะของธีมสี
interface ThemeColorsStateParams {
    themeColor: ThemeColors;
    setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}