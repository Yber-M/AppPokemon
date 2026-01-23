import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}

async function proxy(req: NextRequest, params: { path: string[] }) {
  if (!BASE) return NextResponse.json({ message: "Missing API base URL" }, { status: 500 });

  const targetPath = params.path.join("/");
  const url = new URL(`${BASE}/${targetPath}`);
  // preserve query params
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers = new Headers(req.headers);
  headers.delete("host");
  // Next sets content-length/encoding automatically

  let body: BodyInit | undefined = undefined;
  if (!isBodyless(req.method)) {
    const buffer = await req.arrayBuffer();
    body = buffer.byteLength ? buffer : undefined;
  }

  try {
    const res = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set("access-control-allow-origin", "*");

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Proxy error", detail: error?.message ?? "unknown" },
      { status: 502 }
    );
  }
}

function isBodyless(method?: string) {
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}
