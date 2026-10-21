import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="adm-login">
      <div className="adm-login-card adm-card">
        <Image src="/samuh-icon.png" alt="" width={182} height={240} className="adm-login-mark" />
        <h1 className="adm-login-title">SAMUH admin</h1>
        <p className="adm-login-lede">Enter your work email and we will send you a link. No password.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
