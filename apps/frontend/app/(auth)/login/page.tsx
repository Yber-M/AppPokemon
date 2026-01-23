"use client";

import { AuthHeader } from "@/src/components/layout/AuthHeader";
import { AuthLayout } from "@/src/components/layout/AuthLayout";
import { LoginForm } from "@/src/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader subtitle="Dashboard de usuarios y Pokemon" />
      <LoginForm />
    </AuthLayout>
  );
}
