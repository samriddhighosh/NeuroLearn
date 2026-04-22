import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // create profile if first Google login
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: data.user.user_metadata?.full_name ?? "",
        avatar_url:   data.user.user_metadata?.avatar_url ?? "",
      }, { onConflict: "id" });
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}