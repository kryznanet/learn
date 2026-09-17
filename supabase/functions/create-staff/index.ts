import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const ALLOWED_ROLES = [
  "super_admin",
  "admin",
  "penulis",
  "editor",
  "viewer",
];

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: cors });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: cors,
      });
    }

    try {
      const callerId =
        ctx.user?.id ?? ctx.userClaims?.sub ?? ctx.userClaims?.id;

      if (!callerId) {
        return new Response(
          JSON.stringify({ error: "Token user tidak valid." }),
          { status: 401, headers: cors },
        );
      }

      const { data: staff, error: roleError } = await ctx.supabaseAdmin
        .from("admin_users")
        .select("role,active")
        .eq("user_id", callerId)
        .maybeSingle();

      if (roleError) {
        throw roleError;
      }

      if (!staff || !staff.active || staff.role !== "super_admin") {
        return new Response(
          JSON.stringify({
            error: "Akses ditolak. Hanya Super Admin yang dapat membuat user.",
          }),
          { status: 403, headers: cors },
        );
      }

      const body = await req.json();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const displayName = String(body.display_name || "").trim();
      const role = String(body.role || "penulis").trim().toLowerCase();

      if (!email || !password) {
        throw new Error("Email dan password wajib diisi.");
      }

      if (password.length < 8) {
        throw new Error("Password minimal 8 karakter.");
      }

      if (!ALLOWED_ROLES.includes(role)) {
        throw new Error("Role tidak valid.");
      }

      const { data: created, error: createError } =
        await ctx.supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: displayName,
          },
        });

      if (createError) {
        throw createError;
      }

      if (!created.user) {
        throw new Error("User Auth gagal dibuat.");
      }

      const { error: staffError } = await ctx.supabaseAdmin
        .from("admin_users")
        .upsert(
          {
            user_id: created.user.id,
            email,
            display_name: displayName,
            role,
            active: true,
          },
          { onConflict: "user_id" },
        );

      if (staffError) {
        await ctx.supabaseAdmin.auth.admin.deleteUser(
          created.user.id,
          true,
        );
        throw staffError;
      }

      return new Response(
        JSON.stringify({
          ok: true,
          user_id: created.user.id,
        }),
        {
          status: 200,
          headers: cors,
        },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : String(err),
        }),
        {
          status: 400,
          headers: cors,
        },
      );
    }
  }),
};
