import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

async function authorize(ctx: any) {
  const callerId = ctx.user?.id ?? ctx.userClaims?.sub ?? ctx.userClaims?.id;
  if (!callerId) throw Object.assign(new Error("Token user tidak valid."), { status: 401 });
  const { data, error } = await ctx.supabaseAdmin
    .from("admin_users").select("role,active").eq("user_id", callerId).maybeSingle();
  if (error) throw error;
  if (!data?.active || !["admin","super_admin"].includes(data.role))
    throw Object.assign(new Error("Akses ditolak. Hanya Admin atau Super Admin."), { status: 403 });
  return { callerId, role: data.role };
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return response("ok");
    if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);
    try {
      const actor = await authorize(ctx);
      const body = await req.json();
      const action = String(body.action || "").trim().toLowerCase();

      if (action === "list") {
        const { data: users, error } = await ctx.supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (error) throw error;
        const ids = (users.users || []).map((u: any) => u.id);
        const { data: staffRows, error: staffError } = await ctx.supabaseAdmin
          .from("admin_users").select("user_id").in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        if (staffError) throw staffError;
        const staffIds = new Set((staffRows || []).map((x: any) => x.user_id));
        const rows = (users.users || []).filter((u: any) => !staffIds.has(u.id)).map((u: any) => ({
          user_id: u.id, email: u.email || "", display_name: u.user_metadata?.display_name || "",
          active: !u.banned_until || new Date(u.banned_until) < new Date(),
          created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
        }));
        return response({ users: rows });
      }

      const userId = body.user_id ? String(body.user_id) : "";
      if (action === "create") {
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        const displayName = String(body.display_name || "").trim();
        if (!email || !password) throw new Error("Email dan password wajib diisi.");
        if (password.length < 8) throw new Error("Password minimal 8 karakter.");
        const { data: created, error } = await ctx.supabaseAdmin.auth.admin.createUser({
          email, password, email_confirm: true, user_metadata: { display_name: displayName },
        });
        if (error) throw error;
        return response({ ok: true, user_id: created.user?.id });
      }

      if (action === "update") {
        if (!userId) throw new Error("user_id wajib diisi.");
        const { data: existing } = await ctx.supabaseAdmin.auth.admin.getUserById(userId);
        if (!existing?.user) throw new Error("User tidak ditemukan.");
        if (body.email && String(body.email).trim().toLowerCase() !== existing.user.email) {
          const email = String(body.email).trim().toLowerCase();
          const { error } = await ctx.supabaseAdmin.auth.admin.updateUserById(userId, { email });
          if (error) throw error;
        }
        const metadata = { ...(existing.user.user_metadata || {}) };
        if (body.display_name !== undefined) metadata.display_name = String(body.display_name).trim();
        const patch: any = { user_metadata: metadata };
        if (body.password) {
          const password = String(body.password);
          if (password.length < 8) throw new Error("Password minimal 8 karakter.");
          patch.password = password;
        }
        if (body.active !== undefined) patch.ban_duration = body.active ? "none" : "876000h";
        const { error } = await ctx.supabaseAdmin.auth.admin.updateUserById(userId, patch);
        if (error) throw error;
        return response({ ok: true });
      }

      throw new Error("Action tidak valid.");
    } catch (err) {
      const status = Number((err as any)?.status || 400);
      return response({ error: err instanceof Error ? err.message : String(err) }, status);
    }
  }),
};
