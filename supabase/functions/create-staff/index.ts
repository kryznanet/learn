import { withSupabase } from "npm:@supabase/server";
import { corsHeaders } from "npm:@supabase/supabase-js/cors";

const headers = { ...corsHeaders, "Content-Type": "application/json" };

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    }

    try {
      const { data: staff, error: roleError } = await ctx.supabaseAdmin
        .from("admin_users")
        .select("role,active")
        .eq("user_id", ctx.userClaims?.sub)
        .maybeSingle();

      if (roleError) throw roleError;
      if (!staff || !staff.active || staff.role !== "super_admin") {
        return Response.json(
          { error: "Akses ditolak. Hanya Super Admin yang dapat membuat user." },
          { status: 403, headers },
        );
      }

      const body = await req.json();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const displayName = String(body.display_name || "").trim();
      const role = String(body.role || "penulis").trim().toLowerCase();

      if (!email || !password) throw new Error("Email dan password wajib diisi.");
      if (password.length < 8) throw new Error("Password minimal 8 karakter.");
      if (!["super_admin", "admin", "penulis", "viewer"].includes(role)) {
        throw new Error("Role tidak valid.");
      }

      const { data: created, error: createError } = await ctx.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      });

      if (createError) throw createError;
      if (!created.user) throw new Error("User Auth gagal dibuat.");

      const { error: staffError } = await ctx.supabaseAdmin.from("admin_users").upsert({
        user_id: created.user.id,
        email,
        display_name: displayName,
        role,
        active: true,
      }, { onConflict: "user_id" });

      if (staffError) {
        await ctx.supabaseAdmin.auth.admin.deleteUser(created.user.id, true);
        throw staffError;
      }

      return Response.json({ ok: true, user_id: created.user.id }, { status: 200, headers });
    } catch (err) {
      console.error("create-staff error", err);
      return Response.json(
        { error: err instanceof Error ? err.message : String(err) },
        { status: 400, headers },
      );
    }
  }),
};
