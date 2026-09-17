import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Konfigurasi server belum lengkap." }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const { data: staff, error: staffError } = await supabase
      .from("admin_users")
      .select("role, active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (staffError) {
      throw staffError;
    }

    if (!staff?.active || staff.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const displayName = String(body.display_name || "").trim();
    const role = String(body.role || "viewer").trim();

    const allowedRoles = [
      "super_admin",
      "admin",
      "penulis",
      "editor",
      "viewer",
    ];

    if (!email || !password || !allowedRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Data pengguna tidak valid." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw createError;
    }

    const userId = created.user?.id;

    if (!userId) {
      throw new Error("User ID tidak tersedia setelah pembuatan akun.");
    }

    const { error: staffInsertError } = await supabase.from("admin_users").upsert(
      {
        user_id: userId,
        email,
        display_name: displayName || email,
        role,
        active: true,
      },
      { onConflict: "user_id" },
    );

    if (staffInsertError) {
      await supabase.auth.admin.deleteUser(userId);
      throw staffInsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("create-staff error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
