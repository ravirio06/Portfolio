/**
 * Admin Portal Management
 * Handles administrative authentication, live message triage, status updates, deletion, and export.
 */
(function() {
  const adminModal = document.getElementById('admin-modal');
  const loginSection = document.getElementById('admin-login-view');
  const dashSection = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const prefillBtn = document.getElementById('admin-prefill-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const exportBtn = document.getElementById('admin-export-btn');
  const messagesTbody = document.getElementById('admin-messages-tbody');

  let token = sessionStorage.getItem('portfolio-admin-token') || '';

  function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (token) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    if (loginSection) loginSection.style.display = 'block';
    if (dashSection) dashSection.style.display = 'none';
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashSection) dashSection.style.display = 'block';
    loadMessages();
  }

  async function loadMessages() {
    if (!messagesTbody) return;
    messagesTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Fetching live inquiries...</td></tr>';

    try {
      const res = await fetch('/api/contact/messages', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();

      if (res.ok && data.success) {
        renderTable(data.data || []);
        updateStats(data.data || []);
      } else {
        messagesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--accent-rose);">${data.message || 'Error loading messages'}</td></tr>`;
      }
    } catch (err) {
      messagesTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--accent-rose);">Failed to connect to API server.</td></tr>';
    }
  }

  function updateStats(messages) {
    const totalEl = document.getElementById('admin-stat-total');
    const newEl = document.getElementById('admin-stat-new');
    const repliedEl = document.getElementById('admin-stat-replied');

    if (totalEl) totalEl.textContent = messages.length;
    if (newEl) newEl.textContent = messages.filter(m => m.status === 'new').length;
    if (repliedEl) repliedEl.textContent = messages.filter(m => m.status === 'replied').length;
  }

  function renderTable(messages) {
    if (!messages.length) {
      messagesTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No messages submitted yet.</td></tr>';
      return;
    }

    messagesTbody.innerHTML = messages.map(msg => {
      const id = msg._id || msg.id;
      const statusClass = msg.status || 'new';
      const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent';

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: #fff;">${msg.name}</div>
            <a href="mailto:${msg.email}" style="color: var(--accent-cyan); font-size: 0.8rem; text-decoration: none;">${msg.email}</a>
          </td>
          <td style="max-width: 320px;">
            <div style="color: #cbd5e1; white-space: pre-wrap; font-size: 0.85rem; max-height: 80px; overflow-y: auto;">${msg.message}</div>
          </td>
          <td>
            <span class="status-badge ${statusClass}">${msg.status || 'new'}</span>
          </td>
          <td style="font-family: var(--font-code); font-size: 0.8rem; color: var(--text-muted);">${dateStr}</td>
          <td>
            <div class="table-action-group">
              <button class="table-btn" title="Mark as Read" onclick="window.adminActions.setStatus('${id}', 'read')">
                <i class='bx bx-check'></i>
              </button>
              <button class="table-btn" title="Mark as Replied" onclick="window.adminActions.setStatus('${id}', 'replied')">
                <i class='bx bx-reply'></i>
              </button>
              <button class="table-btn delete" title="Delete Inquiry" onclick="window.adminActions.deleteMsg('${id}')">
                <i class='bx bx-trash'></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Global action hooks
  window.adminActions = {
    setStatus: async function(id, status) {
      try {
        const res = await fetch(`/api/contact/messages/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
        const result = await res.json();
        if (res.ok && result.success) {
          loadMessages();
        } else {
          alert(result.message || 'Action failed.');
        }
      } catch (err) {
        alert('Network error.');
      }
    },

    deleteMsg: async function(id) {
      if (!confirm('Are you sure you want to delete this message record?')) return;
      try {
        const res = await fetch(`/api/contact/messages/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          loadMessages();
        } else {
          alert(result.message || 'Delete failed.');
        }
      } catch (err) {
        alert('Network error.');
      }
    }
  };

  // Wire Login Form
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value.trim();

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, password: pass })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          token = data.token;
          sessionStorage.setItem('portfolio-admin-token', token);
          showDashboard();
        } else {
          alert(data.message || 'Invalid credentials.');
        }
      } catch (err) {
        alert('Unable to authenticate with backend.');
      }
    });
  }

  // Quick Prefill Helper
  if (prefillBtn) {
    prefillBtn.addEventListener('click', () => {
      document.getElementById('admin-username').value = 'admin';
      document.getElementById('admin-password').value = 'admin123';
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      token = '';
      sessionStorage.removeItem('portfolio-admin-token');
      showLogin();
    });
  }

  // Export
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/contact/messages/export', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `contact_messages_${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          alert('Export failed. Please check your admin session.');
        }
      } catch (err) {
        alert('Export failed due to network error.');
      }
    });
  }

  // Triggers (Footer link & Keyboard shortcut)
  document.querySelectorAll('.admin-portal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminModal();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      openAdminModal();
    }
  });
})();
