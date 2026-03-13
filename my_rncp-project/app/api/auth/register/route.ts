import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { first_name, last_name, phone, email, username, password } = await request.json();

    // Vérifie si l'email ou le username existe déjà
const userExists = await prisma.users.findFirst({
  where: {
    OR: [
      { email },
      { username }
    ]
  }
});

if (userExists) {
  if (userExists.email === email) {
    return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
  }
  return NextResponse.json({ message: "Ce nom d'utilisateur est déjà pris" }, { status: 400 });
}

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'utilisateur
    const newUser = await prisma.users.create({
      data: {
        first_name,
        last_name,
        phone,
        email,
        username,
        password: hashedPassword
      }
    });

    // Retire le password de la réponse
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
