import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // รับค่าจาก request
    const { user_name, email, password, role } = await request.json();

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!user_name || !email || !password || !role) {
      console.log("Missing fields: ", { user_name, email, password, role });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ตรวจสอบว่า email นี้มีอยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // ทำการ hash password ก่อนที่จะบันทึกในฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        user_name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // ส่งข้อมูลผู้ใช้ใหม่กลับไป
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('An error occurred while creating the user:', error);
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
  }
}
