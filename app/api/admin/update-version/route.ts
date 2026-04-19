import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { version, notes, platform, download_url, is_active } = body;

    if (!version || !platform) {
      return NextResponse.json(
        { success: false, error: "Version and platform are required" },
        { status: 400 },
      );
    }

    // Insert new version using service role key (bypasses RLS)
    const { data, error } = await supabaseServer
      .from("app_versions")
      .insert([
        {
          version,
          notes: notes || null,
          platform: platform.toLowerCase(),
          download_url,
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected admin error";

    console.error("Admin version update error:", error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
