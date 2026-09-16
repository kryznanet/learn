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

// Global visual system: menjaga kontras, fokus, responsivitas, dan konsistensi antar halaman.
window.addEventListener('DOMContentLoaded', function () {
  const style = document.createElement('style');
  style.id = 'kryzna-contrast-fix';
  style.textContent = `
    :root{color-scheme:light;accent-color:#2563eb}
    [data-theme=dark]{color-scheme:dark;accent-color:#60a5fa}
    html{scroll-behavior:smooth}
    *{box-sizing:border-box}
    ::selection{background:rgba(37,99,235,.2);color:inherit}
    body{color:#0f172a!important}
    body,body *{text-shadow:none}
    p,li,small,span,label,td,th{max-width:100%}
    h1,h2,h3,h4,p,span,a,button,label,td,th{overflow-wrap:anywhere}
    button,input,textarea,select{font:inherit}
    input,textarea,select{color:#0f172a!important;background:#fff!important}
    input::placeholder,textarea::placeholder{color:#64748b!important;opacity:1}
    input:focus,textarea:focus,select:focus,button:focus-visible,a:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(37,99,235,.18)!important}
    button{color:inherit}
    button:disabled{cursor:not-allowed;opacity:.65}
    ::-webkit-scrollbar{width:10px;height:10px}
    ::-webkit-scrollbar-track{background:#eef2f7}
    ::-webkit-scrollbar-thumb{background:#c5d0df;border-radius:999px;border:2px solid #eef2f7}

    /* homepage */
    .hero p,.section-head p,.card p,.side a,.search-count,footer{color:#475569!important}
    .pill{color:#1d4ed8!important;background:#fff!important}
    .hero-card,.feature,.card,.side,.search,.empty{color:#0f172a}
    .feature b,.card h3,.section-head h2,.side h3{color:#0f172a!important}
    .badge{color:#1d4ed8!important;background:#eff6ff!important}
    .read{color:#1d4ed8!important}
    .card,.feature,.side,.search,.hero-card{box-shadow:0 12px 34px rgba(15,23,42,.06)}
    .card:hover{box-shadow:0 20px 44px rgba(15,23,42,.11)}
    .btn,.chip,.theme,.navlinks a,.read{transition:transform .16s ease,background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease}
    .btn:hover,.chip:hover,.theme:hover{transform:translateY(-1px)}

    /* dark mode */
    [data-theme=dark] body{background:#07101d!important;color:#f8fafc!important}
    [data-theme=dark] ::-webkit-scrollbar-track{background:#0b1422}
    [data-theme=dark] ::-webkit-scrollbar-thumb{background:#334155;border-color:#0b1422}
    [data-theme=dark] .hero p,[data-theme=dark] .section-head p,[data-theme=dark] .card p,[data-theme=dark] .side a,[data-theme=dark] .search-count,[data-theme=dark] footer{color:#cbd5e1!important}
    [data-theme=dark] .hero-card,[data-theme=dark] .feature,[data-theme=dark] .card,[data-theme=dark] .side,[data-theme=dark] .search,[data-theme=dark] .empty{background:#0f1a2c!important;color:#f8fafc!important;border-color:#334155!important}
    [data-theme=dark] .feature b,[data-theme=dark] .card h3,[data-theme=dark] .section-head h2,[data-theme=dark] .side h3{color:#f8fafc!important}
    [data-theme=dark] .badge{background:#172554!important;color:#93c5fd!important}
    [data-theme=dark] .read{color:#93c5fd!important}
    [data-theme=dark] input,[data-theme=dark] textarea,[data-theme=dark] select{color:#f8fafc!important;background:#111827!important;border-color:#475569!important}
    [data-theme=dark] input::placeholder,[data-theme=dark] textarea::placeholder{color:#94a3b8!important}

    /* admin */
    body:has(.layout .nav){color:#0f172a!important;background:radial-gradient(circle at 10% 0,#e8f0ff 0,transparent 28%),#eef2f7!important}
    body:has(.layout .nav) .card,body:has(.layout .nav) .stat,body:has(.layout .nav) .item,body:has(.layout .nav) .nav{color:#0f172a}
    body:has(.layout .nav) .card,body:has(.layout .nav) .stat,body:has(.layout .nav) .item{box-shadow:0 10px 30px rgba(15,23,42,.06);border-color:#d8e1ec}
    body:has(.layout .nav) .nav{box-shadow:0 10px 26px rgba(15,23,42,.05)}
    body:has(.layout .nav) .meta,body:has(.layout .nav) .status,body:has(.layout .nav) .hint{color:#64748b!important}
    body:has(.layout .nav) input,body:has(.layout .nav) textarea,body:has(.layout .nav) select{color:#0f172a!important;background:#fff!important}
    body:has(.layout .nav) .t,body:has(.layout .nav) .sel{color:#273449!important;background:#fff!important}
    body:has(.layout .nav) .t:hover,body:has(.layout .nav) .nav button:hover{transform:translateY(-1px)}

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
    .content img{box-shadow:0 12px 28px rgba(15,23,42,.08)}
    [data-theme=dark] .article,[data-theme=dark] .article *{color:inherit}
    [data-theme=dark] .content p,[data-theme=dark] .content li{color:#dbeafe!important}
    [data-theme=dark] .content h1,[data-theme=dark] .content h2,[data-theme=dark] .content h3,[data-theme=dark] .content strong{color:#f8fafc!important}

    /* text wrapping / mobile */
    .navlinks a,.btn,.chip,.badge,.read,.theme{overflow-wrap:normal;white-space:nowrap}
    @media(max-width:640px){
      .hero p,.card p,.content p,.content li{line-height:1.7!important}
      .card h3{font-size:18px!important}
      body:has(.layout .nav) .layout{padding:12px!important}
    }
  `;
  document.head.appendChild(style);
});
