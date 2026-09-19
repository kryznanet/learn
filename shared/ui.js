(() => {
  const pathname = location.pathname.replace(/\\/g, '/');
  const root = pathname.endsWith('/') || pathname.split('/').length <= 2 ? '' : '../';

  if (pathname.endsWith('/admin/login.html') || pathname.endsWith('/login.html')) {
    return;
  }

  const isAdmin = pathname.includes('/admin/') || pathname.includes('/content/');
  const isLearner = pathname.includes('/belajar/') || pathname.includes('/ujian/');

  const links = isAdmin
    ? [
        ['📊', 'Dashboard', root + 'admin/dashboard.html'],
        ['📚', 'Materi', root + 'content/materials.html'],
        ['✏️', 'Editor', root + 'content/editor.html'],
        ['🏷️', 'Kategori', root + 'content/categories.html'],
        ['📝', 'Ujian', root + 'admin/exams.html'],
        ['👥', 'Pengguna', root + 'admin/users.html'],
        ['⚙️', 'Pengaturan', root + 'admin/settings.html']
      ]
    : isLearner
      ? [
          ['⌂', 'Beranda', root + 'belajar/index.html'],
          ['📚', 'Materi', root + 'index.html'],
          ['📝', 'Ujian', root + 'ujian/index.html'],
          ['🕘', 'Riwayat', root + 'belajar/riwayat.html'],
          ['🔖', 'Bookmark', root + 'belajar/bookmarks.html'],
          ['🔔', 'Notifikasi', root + 'belajar/notifikasi.html'],
          ['👤', 'Profil', root + 'belajar/profile.html']
        ]
      : [
          ['⌂', 'Beranda', root + 'index.html'],
          ['📚', 'Materi', root + 'index.html'],
          ['📝', 'Ujian', root + 'ujian/index.html']
        ];

  const shell = document.createElement('div');
  shell.className = 'kx-shell';
  shell.innerHTML = '<nav class="kx-nav" aria-label="Navigasi utama">' +
    '<a class="kx-brand" href="' + root + 'index.html" aria-label="Kryzna Learn">' +
    '<span class="kx-logo" aria-hidden="true">K</span><span>Kryzna Learn</span></a>' +
    '<div class="kx-links">' +
    links.map(([icon, name, href]) => '<a class="kx-link" href="' + href + '">' +
      icon + ' ' + name + '</a>').join('') +
    '</div><div class="kx-user"><a class="kx-menu" href="' +
    (isAdmin ? root + 'admin/index.html' : root + 'belajar/profile.html') +
    '">Akun</a></div></nav>';

  document.body.prepend(shell);

  const normalize = (value) => {
    try {
      const url = new URL(value, location.href);
      return url.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/';
    } catch {
      return value;
    }
  };

  const current = normalize(location.pathname);
  shell.querySelectorAll('.kx-link').forEach((link) => {
    if (normalize(link.href) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = root + 'shared/ui.css';
  document.head.appendChild(style);
  document.body.classList.add('kx-modern');
})();