import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase-server";

type ActivityPayload = {
  event?: string;
  app?: string;
  appVersion?: string;
  platform?: string;
  occurredOn?: string;
  activity?: {
    hasBusinessProfile?: boolean;
    clientsCount?: number;
    projectsCount?: number;
    invoicesCount?: number;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ActivityPayload;
    const { event, app, appVersion, platform, occurredOn, activity } = body;

    const { error } = await supabaseServer.from("app_activity").insert([
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

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected activity tracking error";

    console.error("Track activity error:", error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
