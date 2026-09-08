import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];
  if (hostname === "voice.ologreader.com" && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/voice";
    return NextResponse.rewrite(url);
  }

  if (
    (hostname === "ologreader.com" || hostname === "www.ologreader.com") &&
    request.nextUrl.pathname === "/voice"
  ) {
    const url = request.nextUrl.clone();
    url.hostname = "voice.ologreader.com";
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/voice"] };
