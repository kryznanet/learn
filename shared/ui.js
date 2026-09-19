(() => {
  const pathname = location.pathname.replace(/\\/g, '/');
  const segments = pathname.split('/').filter(Boolean);

  if (
    pathname.endsWith('/admin/login.html') ||
    pathname.endsWith('/login.html')
  ) {
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

  const learnerGroups = [
    {
      icon: '⌂',
      label: 'Beranda',
      href: root + 'belajar/index.html'
    },
    {
      icon: '📚',
      label: 'Materi',
      href: root + 'index.html'
    },
    {
      icon: '📝',
      label: 'Ujian',
      href: root + 'ujian/index.html'
    },
    {
      icon: '📖',
      label: 'Belajar Saya',
      items: [
        ['Progress Belajar', root + 'belajar/index.html#progress'],
        ['Riwayat Belajar', root + 'belajar/riwayat.html'],
        ['Bookmark', root + 'belajar/bookmarks.html']
      ]
    },
    {
      icon: '🔔',
      label: 'Notifikasi',
      href: root + 'belajar/notifikasi.html'
    },
    {
      icon: '👤',
      label: 'Profil',
      href: root + 'belajar/profile.html'
    }
  ];

  const contentGroups = [
    {
      icon: '📊',
      label: 'Dashboard',
      href: root + 'content/index.html',
      permission: 'content.read'
    },
    {
      icon: '📚',
      label: 'Kelola Materi',
      items: [
        ['Daftar Materi', root + 'content/materials.html', 'content.read'],
        ['Kategori', root + 'content/categories.html', 'content.manage_categories'],
        ['Riwayat Versi', root + 'content/materials.html', 'content.read'],
        ['Aktivitas Materi', root + 'content/activity.html', 'content.view_logs']
      ]
    },
    {
      icon: '📝',
      label: 'Kelola Ujian',
      items: [
        ['Daftar Ujian', root + 'admin/exams.html', 'exam.manage'],
        ['Editor Ujian', root + 'admin/exams.html#examForm', 'exam.manage'],
        ['Soal', root + 'admin/exams.html#questionCard', 'exam.manage']
      ]
    }
  ];

  const adminGroups = [
    {
      icon: '👥',
      label: 'Kelola Pengguna',
      href: root + 'admin/users.html',
      permission: 'users.read'
    },
    {
      icon: '🕘',
      label: 'Aktivitas Sistem',
      href: root + 'admin/activity.html',
      permission: 'system.view_logs'
    },
    {
      icon: '📥',
      label: 'Import Materi',
      href: root + 'admin/import.html',
      permission: 'content.import'
    },
    {
      icon: '⚙️',
      label: 'Pengaturan',
      href: root + 'admin/settings.html',
      permission: 'settings.manage'
    }
  ];

  function normalize(value) {
    try {
      const url = new URL(value, location.href);
      return (
        url.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/'
      );
    } catch {
      return value;
    }
  }

  function isCurrent(href) {
    const target = new URL(href, location.href);
    const currentPath = normalize(location.pathname);
    const targetPath = normalize(target.pathname);

    if (currentPath !== targetPath) {
      return false;
    }

    if (!target.hash) {
      return true;
    }

    return location.hash === target.hash;
  }

  function renderSimpleLink(link) {
    const [icon, label, href] = link;
    const current = isCurrent(href);

    return (
      '<a class="kx-link' +
      (current ? ' active' : '') +
      '" href="' +
      href +
      '"' +
      (current ? ' aria-current="page"' : '') +
      '>' +
      icon +
      ' ' +
      label +
      '</a>'
    );
  }

  function renderGroup(group) {
    const items = group.items || [];
    const visibleItems = items.filter(
      (item) => !item[2] || allowed(item[2])
    );

    if (group.permission && !allowed(group.permission)) {
      return '';
    }

    if (!group.href && !visibleItems.length) {
      return '';
    }

    if (group.href) {
      return renderSimpleLink([
        group.icon,
        group.label,
        group.href
      ]);
    }

    const groupCurrent = visibleItems.some((item) => isCurrent(item[1]));
    const menuId = 'kx-menu-' + group.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    return (
      '<details class="kx-group"' +
      (groupCurrent ? ' open' : '') +
      '>' +
      '<summary class="kx-link' +
      (groupCurrent ? ' active' : '') +
      '" aria-controls="' +
      menuId +
      '">' +
      group.icon +
      ' ' +
      group.label +
      '<span class="kx-chevron" aria-hidden="true">⌄</span>' +
      '</summary>' +
      '<div id="' +
      menuId +
      '" class="kx-submenu">' +
      visibleItems
        .map((item) => {
          const current = isCurrent(item[1]);

          return (
            '<a class="kx-sublink' +
            (current ? ' active' : '') +
            '" href="' +
            item[1] +
            '"' +
            (current ? ' aria-current="page"' : '') +
            '>' +
            item[0] +
            '</a>'
          );
        })
        .join('') +
      '</div>' +
      '</details>'
    );
  }

  let allowed = () => true;

  function renderNavigation(groups, accountHref) {
    const shell = document.createElement('div');
    shell.className = 'kx-shell';

    shell.innerHTML =
      '<nav class="kx-nav" aria-label="Navigasi utama">' +
      '<a class="kx-brand" href="' +
      root +
      'index.html" aria-label="Kryzna Learn">' +
      '<span class="kx-logo" aria-hidden="true">K</span>' +
      '<span>Kryzna Learn</span>' +
      '</a>' +
      '<div class="kx-links">' +
      groups.map((group) => renderGroup(group)).join('') +
      '</div>' +
      '<div class="kx-user">' +
      '<a class="kx-menu" href="' +
      accountHref +
      '">Akun</a>' +
      '</div>' +
      '</nav>';

    document.body.prepend(shell);

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = root + 'shared/ui.css';
    document.head.appendChild(style);
    document.body.classList.add('kx-modern');
  }

  async function boot() {
    if (!isAdminArea && !isLearnerArea) {
      renderNavigation(
        publicLinks.map(([icon, label, href]) => ({
          icon,
          label,
          href
        })),
        root + 'belajar/login.html'
      );
      return;
    }

    if (isLearnerArea) {
      renderNavigation(
        learnerGroups,
        root + 'belajar/profile.html'
      );
      return;
    }

    let session = null;

    try {
      session = window.KryznaAuth
        ? await window.KryznaAuth.getSession()
        : null;
    } catch (error) {
      console.warn(
        'Navigasi authenticated: session gagal dimuat.',
        error
      );
    }

    const role = session?.role || null;
    const permissions = session?.permissions || [];

    allowed = (permission) => {
      if (!permission) {
        return true;
      }

      if (permission === 'content.read') {
        return (
          permissions.includes(permission) ||
          ['penulis', 'editor', 'admin', 'super_admin'].includes(role)
        );
      }

      return permissions.includes(permission);
    };

    const isContentRole = [
      'penulis',
      'editor',
      'admin',
      'super_admin'
    ].includes(role);

    if (!isContentRole) {
      renderNavigation(
        learnerGroups,
        root + 'belajar/profile.html'
      );
      return;
    }

    renderNavigation(
      [
        ...contentGroups,
        ...adminGroups
      ],
      role === 'super_admin'
        ? root + 'admin/index.html'
        : root + 'content/index.html'
    );
  }

  boot();
})();
