(() => {
  const pathname = location.pathname.replace(/\\/g, '/');
  const segments = pathname.split('/').filter(Boolean);

  if (pathname.endsWith('/admin/login.html') || pathname.endsWith('/login.html')) {
    return;
  }

  const isGitHubPagesProject = segments[0] === 'learn';
  const directorySegments = pathname.endsWith('/')
    ? segments
    : segments.slice(0, -1);
  const rootDepth = Math.max(
    0,
    directorySegments.length - (isGitHubPagesProject ? 1 : 0)
  );
  const root = '../'.repeat(rootDepth);

  const isAdminArea =
    pathname.includes('/admin/') || pathname.includes('/content/');
  const isLearnerArea =
    pathname.includes('/belajar/') || pathname.includes('/ujian/');

  const publicLinks = [
    ['⌂', 'Beranda', root + 'index.html'],
    ['📚', 'Materi', root + 'index.html'],
    ['📝', 'Ujian', root + 'ujian/index.html']
  ];

  const learnerLinks = [
    ['⌂', 'Beranda', root + 'belajar/index.html'],
    ['📚', 'Materi', root + 'index.html'],
    ['📝', 'Ujian', root + 'ujian/index.html'],
    ['🕘', 'Riwayat', root + 'belajar/riwayat.html'],
    ['🔖', 'Bookmark', root + 'belajar/bookmarks.html'],
    ['🔔', 'Notifikasi', root + 'belajar/notifikasi.html'],
    ['👤', 'Profil', root + 'belajar/profile.html']
  ];

  const adminLinks = {
    workspace: ['🧩', 'Workspace', root + 'content/index.html', null],
    dashboard: ['📊', 'Dashboard', root + 'admin/dashboard.html', 'admin'],
    materials: ['📚', 'Materi', root + 'content/materials.html', 'content.read'],
    editor: ['✏️', 'Editor', root + 'content/editor.html', 'content.update'],
    categories: ['🏷️', 'Kategori', root + 'content/categories.html', 'content.manage_categories'],
    exams: ['📝', 'Ujian', root + 'admin/exams.html', 'admin'],
    users: ['👥', 'Pengguna', root + 'admin/users.html', 'super_admin'],
    activity: ['🕘', 'Aktivitas', root + 'content/activity.html', 'content.view_logs'],
    settings: ['⚙️', 'Pengaturan', root + 'admin/settings.html', 'super_admin']
  };

  function normalize(value) {
    try {
      const url = new URL(value, location.href);
      return url.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/';
    } catch {
      return value;
    }
  }

  function render(links, accountHref) {
    const shell = document.createElement('div');
    shell.className = 'kx-shell';
    shell.innerHTML =
      '<nav class="kx-nav" aria-label="Navigasi utama">' +
      '<a class="kx-brand" href="' + root + 'index.html" aria-label="Kryzna Learn">' +
      '<span class="kx-logo" aria-hidden="true">K</span>' +
      '<span>Kryzna Learn</span>' +
      '</a>' +
      '<div class="kx-links">' +
      links.map(([icon, name, href]) =>
        '<a class="kx-link" href="' + href + '">' + icon + ' ' + name + '</a>'
      ).join('') +
      '</div>' +
      '<div class="kx-user">' +
      '<a class="kx-menu" href="' + accountHref + '">Akun</a>' +
      '</div>' +
      '</nav>';

    document.body.prepend(shell);

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
  }

  async function boot() {
    if (!isAdminArea && !isLearnerArea) {
      render(publicLinks, root + 'belajar/login.html');
      return;
    }

    if (isLearnerArea) {
      render(learnerLinks, root + 'belajar/profile.html');
      return;
    }

    let session = null;

    try {
      session = window.KryznaAuth
        ? await window.KryznaAuth.getSession()
        : null;
    } catch (error) {
      console.warn('Navigasi admin: session gagal dimuat.', error);
    }

    const role = session?.role || null;
    const permissions = session?.permissions || [];

    const allowed = (permission) => {
      if (!permission) return false;
      if (permission === 'admin') {
        return ['admin', 'super_admin'].includes(role);
      }
      if (permission === 'super_admin') {
        return role === 'super_admin';
      }
      return permissions.includes(permission);
    };

    const links = [
      adminLinks.workspace,
      ...(allowed('admin') ? [adminLinks.dashboard] : []),
      ...(allowed('content.read') ? [adminLinks.materials] : []),
      ...(allowed('content.update') ? [adminLinks.editor] : []),
      ...(allowed('content.manage_categories') ? [adminLinks.categories] : []),
      ...(allowed('admin') ? [adminLinks.exams] : []),
      ...(allowed('content.view_logs') ? [adminLinks.activity] : []),
      ...(allowed('super_admin') ? [adminLinks.users, adminLinks.settings] : [])
    ];

    const accountHref = role === 'super_admin'
      ? root + 'admin/index.html'
      : root + 'content/index.html';

    render(links, accountHref);
  }

  boot();
})();
