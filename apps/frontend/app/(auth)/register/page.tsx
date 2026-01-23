"use client";

import { AuthHeader } from "@/src/components/layout/AuthHeader";
import { AuthLayout } from "@/src/components/layout/AuthLayout";
import { RegisterForm } from "@/src/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthHeader subtitle="Dashboard de usuarios y Pokemon" />
      <RegisterForm />
    </AuthLayout>
  );
}

