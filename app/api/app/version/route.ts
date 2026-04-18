import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { RELEASE } from "@/app/lib/release";

type ActiveVersionRow = {
  version: string;
  download_url: string | null;
  notes: string | null;
};

export async function GET(request: Request) {
  try {
    const platform =
      request.headers.get("X-App-Platform")?.toLowerCase() ??
      new URL(request.url).searchParams.get("platform")?.toLowerCase() ??
      RELEASE.platform.toLowerCase();

    const { data, error } = await supabase
      .from("app_versions")
      .select("version, download_url, notes")
      .eq("platform", platform)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single<ActiveVersionRow>();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        availableVersion: RELEASE.version,
        downloadUrl: RELEASE.apkPath,
        notes: `Current ${RELEASE.channel} release`,
      });
    }

    return NextResponse.json({
      availableVersion: data.version,
      downloadUrl: data.download_url || RELEASE.apkPath,
      notes: data.notes || `Current ${RELEASE.channel} release`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected version lookup error";

    console.error("Fetch version error:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
        fallbackVersion: RELEASE.version,
        fallbackDownloadUrl: RELEASE.apkPath,
      },
      { status: 500 },
    );
  }
}
