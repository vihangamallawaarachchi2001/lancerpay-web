import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { RELEASE } from "@/app/lib/release";

type DownloadPayload = {
  platform?: string;
  version?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DownloadPayload;
    const platform = body.platform ?? RELEASE.platform;
    const version = body.version ?? RELEASE.version;
    const userAgent = request.headers.get("user-agent") || "unknown";

    const { error } = await supabase.from("downloads").insert([
      {
        platform,
        version,
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
