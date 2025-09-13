import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("加载middleware模块");

// 白名单：对 "/" 用精确匹配，其它按精确或前缀匹配
const PUBLIC_PATHS = ["/", "/signin", "/favicon.ico"];
const PUBLIC_PREFIXES = ["/_next", "/api"];

function isPublicPath(pathname: string) {
  // "/" 只在精确匹配时视为公共页面
  if (pathname === "/") return true;
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("[MW] request:", { pathname, method: req.method });

  if (isPublicPath(pathname)) {
    console.log("[MW] allowed public path:", pathname);
    const res = NextResponse.next();
    res.headers.set("x-mw-debug", `public:${pathname}`);
    return res;
  }

  // 仅保护 /dashboard 及其子路径
  if (pathname.startsWith("/dashboard")) {
    console.log("req:",req)
    const cookie = req.cookies.get("access_token");
    const token = cookie?.value ?? null;
    console.log("[MW] cookie access_token:", cookie);
    console.log("[MW] token present:", !!token);
    //ToDo:当前还没有在当前页面中加入token验证逻辑(可能会有伪造token风险)
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      const res = NextResponse.redirect(url);
      res.headers.set("x-mw-debug", `redirect:no-token:${pathname}`);
      console.log("[MW] redirecting to /signin because no token");
      return res;
    }

    const res = NextResponse.next();
    res.headers.set("x-mw-debug", `ok:dashboard:token-present`);
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("x-mw-debug", `other:${pathname}`);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
