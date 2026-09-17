/* Kryzna Learn — centralized authentication & authorization helper */
(function () {
  const db = window.supabaseClient;

  const ROLE_ALIASES = {
    viewer: 'viewer',
    penulis: 'penulis',
    editor: 'editor',
    admin: 'admin',
    super_admin: 'super_admin'
  };

  const CONTENT_ROLES = ['penulis', 'editor', 'admin', 'super_admin'];
  const ADMIN_ROLES = ['admin', 'super_admin'];

  async function getUser() {
    if (!db) return null;

    const {
      data: { user }
    } = await db.auth.getUser();

    return user || null;
  }

  async function getStaff(userId) {
    if (!db || !userId) return null;

    const { data, error } = await db
      .from('admin_users')
      .select('user_id,role,active,display_name,email')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  async function getPermissions() {
    if (!db) return [];

    const { data, error } = await db.rpc('get_my_permissions');
    if (error) throw error;

    return (data || [])
      .map((item) => item.code)
      .filter(Boolean);
  }

  async function getSession() {
    const user = await getUser();

    if (!user) {
      return {
        user: null,
        staff: null,
        role: null,
        permissions: []
      };
    }

    const staff = await getStaff(user.id);
    const role = staff?.active
      ? ROLE_ALIASES[staff.role] || null
      : null;

    let permissions = [];

    if (role) {
      try {
        permissions = await getPermissions();
      } catch (error) {
        console.warn('Permission load gagal:', error);
      }
    }

    return {
      user,
      staff,
      role,
      permissions
    };
  }

  function hasRole(role, allowed) {
    return Array.isArray(allowed) && allowed.includes(role);
  }

  function hasPermission(permission, permissions = []) {
    return Array.isArray(permissions) && permissions.includes(permission);
  }

  async function requireRole(allowedRoles, options = {}) {
    const {
      login = '../admin/login.html',
      denied = '../admin/login.html'
    } = options;

    try {
      const session = await getSession();

      if (!session.user) {
        location.href = login;
        return null;
      }

      if (!session.role || !hasRole(session.role, allowedRoles)) {
        const target = denied || login;
        if (target) location.href = target;
        return null;
      }

      return session;
    } catch (error) {
      console.error('Auth error:', error);

      if (login) location.href = login;
      return null;
    }
  }

  async function requirePermission(permission, options = {}) {
    const {
      login = '../admin/login.html',
      denied = '../admin/login.html'
    } = options;

    try {
      const session = await getSession();

      if (!session.user) {
        location.href = login;
        return null;
      }

      if (!session.role || !hasPermission(permission, session.permissions)) {
        const target = denied || login;
        if (target) location.href = target;
        return null;
      }

      return session;
    } catch (error) {
      console.error('Permission error:', error);

      if (login) location.href = login;
      return null;
    }
  }

  window.KryznaAuth = {
    db,
    roles: ROLE_ALIASES,
    contentRoles: CONTENT_ROLES,
    adminRoles: ADMIN_ROLES,
    getUser,
    getStaff,
    getPermissions,
    getSession,
    requireRole,
    requirePermission,
    hasRole: (role, roles) => hasRole(role, roles),
    hasPermission: (permission, permissions) => hasPermission(permission, permissions),
    isContent: (role) => CONTENT_ROLES.includes(role),
    isAdmin: (role) => ADMIN_ROLES.includes(role),
    isSuperAdmin: (role) => role === 'super_admin'
  };

  if (location.pathname.endsWith('/content/editor.html')) {
    const script = document.createElement('script');
    script.src = '../shared/draft-recovery.js';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
