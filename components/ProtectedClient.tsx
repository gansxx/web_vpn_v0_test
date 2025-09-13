import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/config";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${encodeURIComponent(name)}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!);
  return null;
}
// 定义 ProtectedClient 组件，用于保护路由，确保只有登录用户才能访问受保护的页面
export default function ProtectedClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getCookie("access_token");
    const url = token ? `${API_BASE}/me?token=${encodeURIComponent(token)}` : `${API_BASE}/me`;
    fetch(url, { credentials: "include" })
      .then((r) => {
        if (r.status === 200) return r.json();
        throw new Error("unauth");
      })
      .then(() => setChecking(false))
      .catch(() => router.push("/signin"));
  }, [router]);

  if (checking) return null;
  return <>{children}</>;
}
