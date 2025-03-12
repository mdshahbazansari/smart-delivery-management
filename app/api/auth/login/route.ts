import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ token, user }, { status: 200 });
}
