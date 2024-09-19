import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // รับค่าจาก request
    const { email, password } = await request.json();
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // ส่งข้อมูลผู้ใช้ที่เข้าสู่ระบบสำเร็จกลับไป
    return NextResponse.json({ message: 'Sign in successful', user });
  } catch (error) {
    console.error('An error occurred while signing in:', error);
    return NextResponse.json({ error: 'An error occurred while signing in' }, { status: 500 });
  }
}
