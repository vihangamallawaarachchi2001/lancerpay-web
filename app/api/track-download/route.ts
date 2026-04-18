import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase-server";
import { RELEASE } from "@/app/lib/release";

type DownloadPayload = {
  platform?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DownloadPayload;
    const platform = body.platform ?? RELEASE.platform;
    const userAgent = request.headers.get("user-agent") || "unknown";

    const { error } = await supabaseServer.from("downloads").insert([
      {
        platform,
        user_agent: userAgent,
      },
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected download tracking error";

    console.error("Track download error:", error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
