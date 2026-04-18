import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = request.headers.get("X-App-Platform") || "android";

    const { data, error } = await supabase
      .from("app_versions")
      .select("version, download_url, notes")
      .eq("platform", platform.toLowerCase())
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        availableVersion: "0.0.0",
        downloadUrl: "",
        notes: "No active versions found.",
      });
    }

    return NextResponse.json({
      availableVersion: data.version,
      downloadUrl: data.download_url,
      notes: data.notes,
    });
  } catch (error: any) {
    console.error("Fetch version error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
