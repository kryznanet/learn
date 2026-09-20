(() => {
  if (window.__kryznaUiBooted) {
    return;
  }

  window.__kryznaUiBooted = true;

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
  const isLearnerArea = pathname.includes('/belajar/');

  const publicNavigation = [
    {
      icon: '⌂',
      label: 'Beranda',
      href: root + 'index.html'
    },
    {
      icon: '📚',
      label: 'Materi',
      href: root + 'index.html#materi'
    },
    {
      icon: '📝',
      label: 'Ujian',
      href: root + 'ujian/index.html'
    }
  ];

  const learnerNavigation = [
    {
      icon: '⌂',
      label: 'Beranda',
      href: root + 'belajar/index.html'
    },
    {
      icon: '📚',
      label: 'Materi',
      href: root + 'index.html#materi'
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
        {
          label: 'Progress Belajar',
          href: root + 'belajar/index.html#progress'
        },
        {
          label: 'Riwayat Belajar',
          href: root + 'belajar/riwayat.html'
        },
        {
          label: 'Bookmark',
          href: root + 'belajar/bookmarks.html'
        }
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

  const contentNavigation = {
    icon: '📚',
    label: 'CONTENT',
    items: [
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
          {
            label: 'Daftar Materi',
            href: root + 'content/materials.html',
            permission: 'content.read'
          },
          {
            label: 'Kategori',
            href: root + 'content/categories.html',
            permission: 'content.manage_categories'
          },
          {
            label: 'Riwayat Versi',
            href: root + 'content/versions-index.html',
            permission: 'content.read'
          },
          {
            label: 'Aktivitas Materi',
            href: root + 'content/activity.html',
            permission: 'content.view_logs'
          }
        ]
      },
      {
        icon: '📝',
        label: 'Kelola Ujian',
        items: [
          {
            label: 'Daftar Ujian',
            href: root + 'admin/exams.html',
            permission: 'exam.manage'
          },
          {
            label: 'Editor Ujian',
            href: root + 'admin/exams.html#examForm',
            permission: 'exam.manage'
          },
          {
            label: 'Soal',
            href: root + 'admin/exams.html#questionCard',
            permission: 'exam.manage'
          }
        ]
      }
    ]
  };

  const administrationNavigation = {
    icon: '🛡️',
    label: 'ADMINISTRASI',
    items: [
      {
        label: 'Kelola Pengguna',
        href: root + 'admin/users.html',
        permission: 'users.read'
      },
      {
        label: 'Aktivitas Sistem',
        href: root + 'admin/activity.html',
        permission: 'system.view_logs'
      },
      {
        label: 'Import Materi',
        href: root + 'admin/import.html',
        permission: 'content.import'
      },
      {
        label: 'Pengaturan',
        href: root + 'admin/settings.html',
        permission: 'settings.manage'
      }
    ]
  };

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
      return !location.hash;
    }

    return location.hash === target.hash;
  }

  function hasCurrentItem(item) {
    if (item.href && isCurrent(item.href)) {
      return true;
    }

    return (item.items || []).some(hasCurrentItem);
  }

  function visibleItems(item) {
    return (item.items || []).filter(
      (child) => !child.permission || allowed(child.permission)
    );
  }

  function renderLink(item, nested) {
    const current = isCurrent(item.href);
    const className = nested ? 'kx-sublink' : 'kx-link';

    return (
      '<a class="' +
      className +
      (current ? ' active' : '') +
      '" href="' +
      item.href +
      '"' +
      (current ? ' aria-current="page"' : '') +
      '>' +
      (item.icon ? item.icon + ' ' : '') +
      item.label +
      '</a>'
    );
  }

  function renderGroup(item, nested) {
    const children = visibleItems(item);

    if (!children.length) {
      return '';
    }

    const current = hasCurrentItem(item);
    const menuId = 'kx-menu-' +
      item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return (
      '<details class="' +
      (nested ? 'kx-subgroup' : 'kx-group') +
      '"' +
      (current ? ' open' : '') +
      '>' +
      '<summary class="' +
      (nested ? 'kx-sublink' : 'kx-link') +
      (current ? ' active' : '') +
      '">' +
      (item.icon ? item.icon + ' ' : '') +
      item.label +
      '<span class="kx-chevron" aria-hidden="true">⌄</span>' +
      '</summary>' +
      '<div id="' +
      menuId +
      '" class="' +
      (nested ? 'kx-submenu kx-submenu-nested' : 'kx-submenu') +
      '">' +
      children
        .map((child) => {
          if (child.items) {
            return renderGroup(child, true);
          }

          return renderLink(child, true);
        })
        .join('') +
      '</div>' +
      '</details>'
    );
  }

  function renderNavigation(items, accountHref) {
    const shell = document.createElement('div');
    shell.className = 'kx-shell';

    shell.innerHTML =
      '<nav class="kx-nav" aria-label="Navigasi utama">' +
      '<a class="kx-brand" href="' +
      root +
      'index.html" aria-label="Kryzna Learn">' +
      '<span class="kx-logo" aria-hidden="true">K</span>' +
      '<span class="kx-brand-text">' +
      '<span class="kx-brand-title">Kryzna Learn</span>' +
      '<span class="kx-brand-subtitle">Belajar • Praktik • Berkembang</span>' +
      '</span>' +
      '</a>' +
      '<button class="kx-toggle" type="button" aria-expanded="false" ' +
      'aria-controls="kx-navigation" aria-label="Buka navigasi">' +
      '<span aria-hidden="true">☰</span>' +
      '</button>' +
      '<div class="kx-links" id="kx-navigation">' +
      items
        .map((item) =>
          item.items
            ? renderGroup(item, false)
            : renderLink(item, false)
        )
        .join('') +
      '</div>' +
      '<div class="kx-user">' +
      '<a class="kx-menu" href="' +
      accountHref +
      '">Akun</a>' +
      '</div>' +
      '</nav>';

    document.body.prepend(shell);

    if (!document.querySelector('footer')) {
      const footer = document.createElement('footer');
      footer.className = 'kx-footer';
      footer.innerHTML =
        '<div class="kx-footer-inner">' +
        '<div class="kx-footer-brand">' +
        '<span class="kx-footer-logo" aria-hidden="true">K</span>' +
        '<div class="kx-footer-copy">' +
        '<strong>Kryzna Learn</strong>' +
        '<span>Belajar jaringan komputer dengan lebih terarah.</span>' +
        '</div>' +
        '</div>' +
        '<nav class="kx-footer-links" aria-label="Navigasi footer">' +
        '<a href="' + root + 'index.html">Beranda</a>' +
        '<a href="' + root + 'index.html#materi">Materi</a>' +
        '<a href="' + root + 'ujian/index.html">Ujian</a>' +
        (isLearnerArea
          ? '<a href="' + root + 'belajar/index.html">Belajar Saya</a>'
          : '') +
        '</nav>' +
        '<span class="kx-footer-meta">© Kryzna Learn</span>' +
        '</div>';
      document.body.appendChild(footer);
    }

    const toggle = shell.querySelector('.kx-toggle');
    const links = shell.querySelector('.kx-links');

    toggle?.addEventListener('click', () => {
      const isOpen = shell.classList.toggle('kx-menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute(
        'aria-label',
        isOpen ? 'Tutup navigasi' : 'Buka navigasi'
      );
    });

    links?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        shell.classList.remove('kx-menu-open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Buka navigasi');
      });
    });

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = root + 'shared/ui.css';
    document.head.appendChild(style);
    document.body.classList.add('kx-modern');
  }

  let allowed = () => true;

  async function boot() {
    if (!isAdminArea && !isLearnerArea) {
      renderNavigation(
        publicNavigation,
        root + 'belajar/login.html'
      );
      return;
    }

    if (isLearnerArea) {
      renderNavigation(
        learnerNavigation,
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
        learnerNavigation,
        root + 'belajar/profile.html'
      );
      return;
    }

    renderNavigation(
      [
        contentNavigation,
        administrationNavigation
      ],
      role === 'super_admin'
        ? root + 'admin/index.html'
        : root + 'content/index.html'
    );
  }

  boot();
})();
