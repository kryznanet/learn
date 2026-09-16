// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const isAdminPage = window.location.pathname.includes('/admin/');
const isAdminDashboard = isAdminPage && /\/admin\/dashboard\.html$/i.test(window.location.pathname);

if (isAdminDashboard) {
  document.documentElement.classList.add('admin-auth-pending');
  const bootStyle = document.createElement('style');
  bootStyle.id = 'kryzna-admin-auth-boot';
  bootStyle.textContent = '.admin-auth-pending body{visibility:hidden!important}.admin-auth-pending body:before{content:"Memeriksa sesi admin…";position:fixed;inset:0;display:grid;place-items:center;background:#f3f6fb;color:#64748b;font:600 14px Segoe UI,Arial,sans-serif;z-index:999999}';
  document.head.appendChild(bootStyle);
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'kryzna-learn-auth'
    }
  }
);

if (isAdminPage) {
  const auth = supabaseClient.auth;
  const originalGetSession = auth.getSession.bind(auth);
  let recoveryPromise = null;

  const clearAdminBoot = () => {
    if (isAdminDashboard) document.documentElement.classList.remove('admin-auth-pending');
  };

  auth.getSession = async function () {
    const first = await originalGetSession();
    if (first?.data?.session) {
      clearAdminBoot();
      return first;
    }

    if (!recoveryPromise) {
      recoveryPromise = new Promise(resolve => {
        let settled = false;
        let timer = null;
        let subscription = null;
        const finish = session => {
          if (settled) return;
          settled = true;
          if (timer) clearTimeout(timer);
          try { subscription?.unsubscribe?.(); } catch (_) {}
          clearAdminBoot();
          resolve({ data: { session: session || null }, error: null });
        };

        try {
          const result = auth.onAuthStateChange((event, session) => {
            if (session || event === 'INITIAL_SESSION') finish(session);
          });
          subscription = result?.data?.subscription || null;
        } catch (_) {}

        timer = setTimeout(async () => {
          try {
            const retry = await originalGetSession();
            finish(retry?.data?.session || null);
          } catch (_) {
            finish(null);
          }
        }, 1800);
      }).finally(() => {
        recoveryPromise = null;
      });
    }

    return recoveryPromise;
  };
}

// UI enhancement global. Tidak mengubah logika data atau autentikasi.
window.addEventListener('DOMContentLoaded', function () {
  const style = document.createElement('style');
  style.id = 'kryzna-modern-ui';
  style.textContent = `
    :root {
      --k-primary:#2563eb; --k-primary-2:#4f46e5; --k-accent:#06b6d4;
      --k-bg:#f5f7fb; --k-surface:rgba(255,255,255,.92); --k-border:#e2e8f0;
      --k-text:#0f172a; --k-muted:#64748b; --k-shadow:0 16px 40px rgba(15,23,42,.08);
      --k-shadow-soft:0 8px 24px rgba(15,23,42,.07); --k-radius:16px;
    }
    html{scroll-behavior:smooth}body{background:radial-gradient(circle at 0 0,rgba(37,99,235,.08),transparent 28%),radial-gradient(circle at 100% 10%,rgba(6,182,212,.07),transparent 24%),var(--k-bg)!important;color:var(--k-text)!important}button,input,textarea,select{font:inherit}button,a{-webkit-tap-highlight-color:transparent}
    body>header{background:rgba(15,23,42,.9)!important;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.1);padding:13px clamp(16px,4vw,48px)!important;box-shadow:0 8px 28px rgba(2,6,23,.12)}
    body>header h1{font-size:20px!important;letter-spacing:-.02em;margin:0}body>header nav{gap:6px!important}body>header nav a{padding:8px 11px;border-radius:10px;opacity:.86;transition:.2s ease}body>header nav a:hover{opacity:1;background:rgba(255,255,255,.09);transform:translateY(-1px)}.theme{width:38px!important;height:38px;border-radius:10px!important;background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,.12)!important}
    .hero{position:relative;overflow:hidden;padding:clamp(62px,9vw,100px) 20px!important;background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 48%,#06b6d4 100%)!important;box-shadow:inset 0 -1px 0 rgba(255,255,255,.12)}.hero:after{content:'';position:absolute;width:420px;height:420px;right:-140px;top:-180px;border-radius:50%;background:rgba(255,255,255,.1);filter:blur(4px)}.hero h2{position:relative;z-index:1;max-width:820px;margin:0 auto 12px!important;font-size:clamp(30px,5vw,54px)!important;line-height:1.05!important;letter-spacing:-.04em}.hero p{position:relative;z-index:1;max-width:720px;margin:0 auto!important;font-size:16px;opacity:.88}
    .search{position:relative;z-index:3;max-width:760px!important;margin:-31px auto 42px!important;padding:0 18px!important}.search input{border:1px solid rgba(148,163,184,.25)!important;border-radius:16px!important;padding:17px 20px!important;box-shadow:0 18px 45px rgba(15,23,42,.14)!important;outline:none}.search input:focus{border-color:rgba(37,99,235,.45)!important;box-shadow:0 0 0 4px rgba(37,99,235,.12),0 18px 45px rgba(15,23,42,.12)!important}
    .layout{max-width:1180px!important;gap:26px!important;padding-bottom:56px!important}.side,.card,.stat,.item{border:1px solid var(--k-border)!important;box-shadow:var(--k-shadow-soft)!important;border-radius:var(--k-radius)!important}.side{padding:18px!important;background:var(--k-surface)!important;backdrop-filter:blur(10px)}.side h3{margin-top:8px;border-bottom:0!important;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#475569}.side li{margin:4px 0!important}.side a{display:block;padding:8px 9px;border-radius:9px;transition:.18s ease}.side a:hover{background:#eff6ff;color:var(--k-primary)}.grid{gap:18px!important}.card{border-top:1px solid var(--k-border)!important;padding:21px!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.card:hover{transform:translateY(-3px);box-shadow:var(--k-shadow)!important;border-color:#bfdbfe!important}.badge{display:inline-flex;padding:5px 9px;border-radius:999px;background:#eff6ff;color:#2563eb!important;letter-spacing:.04em}.card h3{font-size:20px!important;letter-spacing:-.02em}.card p{line-height:1.7}.read{display:inline-flex;margin-top:12px}
    .wrap{max-width:1060px!important;margin:34px auto!important;padding:0 18px!important}.article{background:rgba(255,255,255,.96)!important;border:1px solid var(--k-border)!important;border-radius:22px!important;padding:clamp(24px,4vw,48px)!important;box-shadow:var(--k-shadow)!important}.article>.back{display:inline-flex;align-items:center;gap:6px;margin-bottom:18px;padding:8px 11px;border-radius:10px;background:#eff6ff;color:#1d4ed8!important;text-decoration:none}.article h1{margin:10px 0;font-size:clamp(30px,5vw,48px)!important;line-height:1.08!important;letter-spacing:-.04em}.article hr{border:0;border-top:1px solid #e2e8f0;margin:30px 0}.content{max-width:840px;margin:auto}.content p,.content li{font-size:16px;line-height:1.85;color:#334155}.content h2{font-size:28px;margin-top:34px}.content h3{font-size:22px;margin-top:28px}.content pre{padding:18px!important;border-radius:14px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}.content blockquote{margin:22px 0;padding:14px 18px;border-left:4px solid #60a5fa;background:#eff6ff;border-radius:0 10px 10px 0;color:#334155}.content table{display:block;overflow:auto;border-collapse:separate;border-spacing:0;border-radius:12px}.content th{background:#f8fafc}.content th,.content td{padding:11px 13px!important}.content img{border-radius:12px}.filebox{margin:22px 0!important;padding:18px!important;border:1px solid #dbe3ec!important;border-radius:16px!important;background:linear-gradient(180deg,#f8fbff,#f7f9fc)!important}.filebox strong{font-size:16px}.filebox a{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#2563eb,#4f46e5)!important;border-radius:10px!important;padding:10px 14px!important;box-shadow:0 8px 18px rgba(37,99,235,.16)}.content iframe{min-height:78vh!important;border:1px solid #dbe3ec!important;border-radius:14px!important;box-shadow:0 10px 28px rgba(15,23,42,.06)}
    body:has(.layout .nav){background:#f3f6fb!important}.layout:has(.nav){max-width:1320px!important;grid-template-columns:238px minmax(0,1fr)!important;gap:22px!important;margin-top:24px!important}.nav{padding:10px!important;border-radius:18px!important;box-shadow:var(--k-shadow-soft)!important;background:rgba(255,255,255,.9)!important}.nav:before{content:'CONTENT MANAGEMENT';display:block;padding:7px 12px 10px;color:#94a3b8;font-size:10px;font-weight:800;letter-spacing:.12em}.nav button{min-height:44px;margin:3px 0;border-radius:11px!important;transition:.18s ease}.nav button:hover{transform:translateX(2px)}.nav button.active{background:linear-gradient(135deg,#eff6ff,#eef2ff)!important;color:#1d4ed8!important;box-shadow:inset 0 0 0 1px #dbeafe}.stats{gap:16px!important}.stat{position:relative;overflow:hidden;padding:20px!important;background:linear-gradient(145deg,#fff,#f8fafc)!important}.stat:after{content:'';position:absolute;width:90px;height:90px;right:-24px;top:-24px;border-radius:50%;background:rgba(37,99,235,.07)}.stat b{font-size:30px!important;letter-spacing:-.03em}.stat span{font-size:12px;font-weight:700}.content>.view>.card{box-shadow:var(--k-shadow-soft)!important}.content h2{letter-spacing:-.025em}.card p.meta{font-size:13px}label{color:#334155}input,textarea,select{border:1px solid #d7dee8!important;border-radius:10px!important;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}input:focus,textarea:focus,select:focus{outline:none!important;border-color:#93c5fd!important;box-shadow:0 0 0 4px rgba(37,99,235,.09)!important}textarea{resize:vertical}.btn{min-height:40px;border-radius:10px!important;transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}.btn:hover{transform:translateY(-1px);filter:brightness(1.02);box-shadow:0 8px 18px rgba(15,23,42,.08)}.primary{background:linear-gradient(135deg,#2563eb,#4f46e5)!important}.import{background:linear-gradient(135deg,#7c3aed,#6366f1)!important}.preview{background:linear-gradient(135deg,#0f766e,#0d9488)!important}.delete{background:linear-gradient(135deg,#dc2626,#ef4444)!important}.secondary{border:1px solid #dbe3ec!important}.filebox{background:linear-gradient(180deg,#f8fbff,#f6f8fc)!important;border-color:#bfdbfe!important;border-radius:16px!important}.drop{border-radius:12px;transition:.2s ease}.drop:hover{background:#eff6ff}.fileinfo{border-radius:11px!important}.editor{border-color:#d8e0ea!important;border-radius:14px!important;box-shadow:inset 0 1px 2px rgba(15,23,42,.03)}.toolbar{background:#f8fafc!important}.grp{border-radius:9px!important}.t:hover{background:#eff6ff!important;border-color:#bfdbfe!important}.body{min-height:470px!important}.previewbox{border-radius:12px!important;background:#fbfdff!important}.item{transition:.18s ease}.item:hover{transform:translateY(-1px);box-shadow:var(--k-shadow)!important}.note{border:1px solid #dbeafe;border-radius:12px!important}.success,.danger{border-radius:12px!important}
    body:has(.box){background:radial-gradient(circle at 20% 15%,rgba(37,99,235,.16),transparent 28%),radial-gradient(circle at 80% 80%,rgba(6,182,212,.12),transparent 30%),#eff4fb!important}.box{width:min(450px,92%)!important;padding:34px!important;border:1px solid rgba(255,255,255,.8);border-radius:22px!important;box-shadow:0 26px 70px rgba(15,23,42,.16)!important;backdrop-filter:blur(12px)}.box h1{color:#0f172a!important;font-size:30px!important;letter-spacing:-.03em}.box p{color:#64748b}.box button{background:linear-gradient(135deg,#2563eb,#4f46e5)!important;border-radius:11px!important;min-height:46px;box-shadow:0 12px 22px rgba(37,99,235,.18);transition:.18s ease}.box button:hover{transform:translateY(-1px);filter:brightness(1.03)}.back{color:#2563eb!important;font-weight:700}
    @media(max-width:850px){body>header{padding:11px 14px!important}.layout:has(.nav){grid-template-columns:1fr!important}.nav{overflow-x:auto;display:flex;align-items:center;gap:5px;position:static!important}.nav:before{display:none}.nav button{white-space:nowrap;min-width:max-content}.stats{grid-template-columns:1fr!important}}
    @media(max-width:560px){body>header h1{font-size:18px!important}body>header nav a:not([href*='admin']){display:none}.hero h2{font-size:32px!important}.search{margin-top:-24px!important}.box{padding:26px!important}.article{padding:24px!important}.article h1{font-size:32px!important}.content p,.content li{font-size:15px}}
  `;
  document.head.appendChild(style);
});
