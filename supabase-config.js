// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Global visual fixes: menjaga kontras teks, form, kartu, tabel, reader, dan admin.
window.addEventListener('DOMContentLoaded', function () {
  const style = document.createElement('style');
  style.id = 'kryzna-contrast-fix';
  style.textContent = `
    :root{color-scheme:light}
    [data-theme=dark]{color-scheme:dark}
    body{color:#0f172a!important}
    body,body *{text-shadow:none}
    p,li,small,span,label,td,th{max-width:100%}
    input,textarea,select{color:#0f172a!important;background:#fff!important}
    input::placeholder,textarea::placeholder{color:#64748b!important;opacity:1}
    button{color:inherit}

    /* homepage */
    .hero p,.section-head p,.card p,.side a,.search-count,footer{color:#475569!important}
    .pill{color:#1d4ed8!important;background:#fff!important}
    .hero-card,.feature,.card,.side,.search,.empty{color:#0f172a}
    .feature b,.card h3,.section-head h2,.side h3{color:#0f172a!important}
    .badge{color:#1d4ed8!important;background:#eff6ff!important}
    .read{color:#1d4ed8!important}

    /* dark mode */
    [data-theme=dark] body{background:#07101d!important;color:#f8fafc!important}
    [data-theme=dark] .hero p,[data-theme=dark] .section-head p,[data-theme=dark] .card p,[data-theme=dark] .side a,[data-theme=dark] .search-count,[data-theme=dark] footer{color:#cbd5e1!important}
    [data-theme=dark] .hero-card,[data-theme=dark] .feature,[data-theme=dark] .card,[data-theme=dark] .side,[data-theme=dark] .search,[data-theme=dark] .empty{background:#0f1a2c!important;color:#f8fafc!important;border-color:#334155!important}
    [data-theme=dark] .feature b,[data-theme=dark] .card h3,[data-theme=dark] .section-head h2,[data-theme=dark] .side h3{color:#f8fafc!important}
    [data-theme=dark] .badge{background:#172554!important;color:#93c5fd!important}
    [data-theme=dark] .read{color:#93c5fd!important}
    [data-theme=dark] input,[data-theme=dark] textarea,[data-theme=dark] select{color:#f8fafc!important;background:#111827!important;border-color:#475569!important}
    [data-theme=dark] input::placeholder,[data-theme=dark] textarea::placeholder{color:#94a3b8!important}

    /* admin */
    body:has(.layout .nav){color:#0f172a!important}
    body:has(.layout .nav) .card,body:has(.layout .nav) .stat,body:has(.layout .nav) .item,body:has(.layout .nav) .nav{color:#0f172a}
    body:has(.layout .nav) .meta,body:has(.layout .nav) .status,body:has(.layout .nav) .hint{color:#64748b!important}
    body:has(.layout .nav) input,body:has(.layout .nav) textarea,body:has(.layout .nav) select{color:#0f172a!important;background:#fff!important}
    body:has(.layout .nav) .t,body:has(.layout .nav) .sel{color:#273449!important;background:#fff!important}

    /* login */
    body:has(.box){color:#0f172a!important}
    body:has(.box) .box{color:#0f172a}
    body:has(.box) .box p{color:#64748b!important}
    body:has(.box) label{color:#334155!important}
    body:has(.box) input{color:#0f172a!important;background:#fff!important}

    /* reader */
    .article,.article *{overflow-wrap:anywhere}
    .content p,.content li{color:#334155!important}
    .content h1,.content h2,.content h3,.content strong{color:#0f172a!important}
    [data-theme=dark] .article,[data-theme=dark] .article *{color:inherit}
    [data-theme=dark] .content p,[data-theme=dark] .content li{color:#dbeafe!important}
    [data-theme=dark] .content h1,[data-theme=dark] .content h2,[data-theme=dark] .content h3,[data-theme=dark] .content strong{color:#f8fafc!important}

    /* prevent text clipping/overlap */
    h1,h2,h3,p,span,a,button,label{overflow-wrap:anywhere}
    .navlinks a,.btn,.chip,.badge,.read,.theme{overflow-wrap:normal;white-space:nowrap}

    /* role based dashboard */
    body.k-role-viewer .nav button[data-view="import"],
    body.k-role-viewer .nav button[data-view="editor"],
    body.k-role-viewer button[onclick*="newMaterial"],
    body.k-role-viewer button[type="submit"],
    body.k-role-viewer .edit,
    body.k-role-viewer .delete{display:none!important}
    body.k-role-penulis .delete{display:none!important}
    body.k-role-admin .nav button[data-view="users"]{display:none!important}
    #k-user-role{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:#1e293b;color:#dbeafe;font-size:10px;font-weight:900;border:1px solid #334155}
    #k-users-shell{height:calc(100vh - 130px);min-height:650px;padding:0;overflow:hidden}
    #k-users-frame{width:100%;height:100%;min-height:650px;border:0;display:block;background:transparent}

    @media(max-width:640px){
      .hero p,.card p,.content p,.content li{line-height:1.7!important}
      .card h3{font-size:18px!important}
      #k-users-shell,#k-users-frame{min-height:760px;height:calc(100vh - 100px)}
    }
  `;
  document.head.appendChild(style);
});

// RBAC UI bridge for Dashboard Admin.
window.addEventListener('DOMContentLoaded', async function () {
  try {
    const {data:{user}} = await supabaseClient.auth.getUser();
    if (!user) return;
    const {data:staff,error} = await supabaseClient
      .from('admin_users')
      .select('role,active,display_name')
      .eq('user_id',user.id)
      .maybeSingle();
    if (error || !staff) return;

    if (!staff.active) {
      await supabaseClient.auth.signOut();
      if (/\/admin\/dashboard\.html$/i.test(location.pathname)) location.replace('login.html');
      return;
    }

    const role = String(staff.role || 'viewer');
    document.body.classList.add('k-role-' + role);

    const top = document.querySelector('.top');
    if (top && !document.getElementById('k-user-role')) {
      const badge = document.createElement('span');
      badge.id = 'k-user-role';
      badge.textContent = staff.display_name ? (staff.display_name + ' · ' + roleLabel(role)) : roleLabel(role);
      top.insertBefore(badge, top.firstChild);
    }

    // Kelola User tetap berada sebagai menu dan view di Dashboard, hanya untuk Super Admin.
    const nav = document.querySelector('.layout .nav');
    const content = document.querySelector('.layout .content');
    if (role === 'super_admin' && nav && content && !document.querySelector('[data-view="users"]')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.view = 'users';
      btn.textContent = '👥 Kelola User';
      btn.addEventListener('click', function(){ if (typeof window.showView === 'function') window.showView('users'); });
      nav.appendChild(btn);

      const section = document.createElement('section');
      section.id = 'users';
      section.className = 'view';
      section.innerHTML = '<div id="k-users-shell" class="card"><iframe id="k-users-frame" title="Kelola User" src="users.html"></iframe></div>';
      content.appendChild(section);
    }
  } catch (e) {
    console.warn('RBAC UI tidak dapat dimuat:', e);
  }

  function roleLabel(role){
    return ({super_admin:'Super Admin',admin:'Admin',penulis:'Penulis / Pemateri',viewer:'Viewer'})[role] || role;
  }
});
