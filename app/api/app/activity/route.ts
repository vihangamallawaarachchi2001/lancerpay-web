import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract data as per the app's example request body
    const { event, app, appVersion, platform, occurredOn, activity } = body;

    const { error } = await supabase.from("app_activity").insert([
      {
        event,
        app_name: app,
        app_version: appVersion,
        platform,
        occurred_on: occurredOn,
        has_business_profile: activity?.hasBusinessProfile,
        clients_count: activity?.clientsCount,
        projects_count: activity?.projectsCount,
        invoices_count: activity?.invoicesCount,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error: any) {
    console.error("Track activity error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
