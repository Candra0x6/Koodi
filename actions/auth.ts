"use server";

import * as z from "zod";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma/client";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      username: name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          languagePreference: "en",
          theme: "light",
        },
      },
      stats: {
        create: {
          xp: 0,
          streak: 0,
          hearts: 5,
          level: 1,
        },
      },
    },
  });

  return { success: "User created!" };
};
