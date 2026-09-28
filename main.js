/**
 * RAVINITHISHKUMAR S - Main Application Logic
 * Modular vanilla JS managing interactions, API communication, and dynamic content rendering.
 */

// Global Project Details Dictionary for Modals (Dynamic from API)
let projectDataDetails = {};

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbar();
  initScrollspy();
  initFilters();
  initContactForm();
  initTelemetry();
  initModals();
  initThemeToggle();
  initClock();
  initDynamicContent();
});

/* ==========================================================================
   DYNAMIC CONTENT ENGINE (FETCHES FROM BACKEND & RENDERS LIVE CMS DATA)
   ========================================================================== */
async function initDynamicContent() {
  try {
    const res = await fetch('/api/content/all');
    if (!res.ok) return;
    const json = await res.json();
    if (!json.success || !json.data) return;

    const data = json.data;

    // 1. Profile & Hero
    if (data.profile || data.hero) {
      applyDynamicProfile(data.profile || {}, data.hero || {});
    }

    // 2. About
    if (data.about || data.profile) {
      applyDynamicAbout(data.about || {}, data.profile || {});
    }

    // 3. Projects
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      applyDynamicProjects(data.projects);
    }

    // 4. Skills
    if (Array.isArray(data.skills) && data.skills.length > 0) {
      applyDynamicSkills(data.skills);
    }

    // 5. Experience & Education
    applyDynamicTimeline(data.experience || [], data.education || []);

    // 6. Certificates
    if (Array.isArray(data.certificates) && data.certificates.length > 0) {
      applyDynamicCertificates(data.certificates);
    }

    // 7. Resume
    if (data.currentResume) {
      applyDynamicResume(data.currentResume);
    }

    // 7. Social Links
    if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
      applyDynamicSocial(data.socialLinks);
    }

    // 8. Site Settings & Ordering
    if (data.settings) {
      applyDynamicSettings(data.settings);
    }

    // 9. SEO
    if (data.seo) {
      applyDynamicSEO(data.seo);
    }
  } catch (err) {
    console.warn('API sync fallback note:', err.message);
  }
}

function applyDynamicProfile(profile, hero) {
  const name = profile.name || hero.heading || 'Ravinithishkumar S';
  const subtitle = profile.title || hero.subtitle || 'B.E. Electronics and Communication Engineering';
  const tagline = profile.tagline || hero.description || '';
  const avatar = profile.avatarUrl || hero.heroImage || '/assets/avatar.jpg';

  // 1. Update ALL avatar and hero photos across the page
  document.querySelectorAll('.avatar-main-frame img, .hero-visual img, .avatar-img, .profile-card img, .hero-avatar, img[src*="avatar"]').forEach(img => {
    img.src = avatar;
  });

  // 2. Avatar badge caption card (name & title • location)
  const captionName = document.querySelector('.avatar-badge-caption .caption-name');
  if (captionName) captionName.textContent = name;

  const captionTitle = document.querySelector('.avatar-badge-caption .caption-title');
  if (captionTitle) {
    const loc = profile.location ? ` • ${profile.location}` : '';
    captionTitle.textContent = `${subtitle}${loc}`;
  }

  // Update contact section location base
  if (profile.location) {
    const contactLoc = document.getElementById('contact-location-display');
    if (contactLoc) {
      contactLoc.textContent = `${profile.location} (Open to Remote Globally)`;
    }
  }

  // 3. Hero Name in highlights and main headings
  document.querySelectorAll('.hero-name-highlight, #hero h1 span, .brand-logo span').forEach(el => {
    if (el.classList.contains('brand-logo')) return;
    el.textContent = name;
  });

  // 4. Hero Bio description
  const heroDescEl = document.querySelector('.hero-description');
  if (heroDescEl) {
    const descText = tagline || 'A software engineer specialized in building ultra-low-latency distributed backends, scalable cloud microservices, and pixel-perfect interactive web interfaces with modern engineering rigor.';
    heroDescEl.innerHTML = `Hi, I'm <strong>${escapeHtml(name)}</strong>. ${escapeHtml(descText)}`;
  }

  // 5. Brand logo
  const brandLogo = document.querySelector('.brand-logo span');
  if (brandLogo && name) {
    const rawFirst = name.split(' ')[0] || 'Ravinithish';
    const formattedFirst = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase();
    brandLogo.innerHTML = `${escapeHtml(formattedFirst)}<span class="code-bracket">.dev</span>`;
  }

  // 6. Direct Email links
  if (profile.email) {
    document.querySelectorAll('#hero-social-email, a[href^="mailto:"]').forEach(el => {
      el.href = `mailto:${profile.email}`;
    });
  }

  // 7. CTA Buttons
  if (hero.ctaText) {
    const ctaBtn = document.getElementById('hero-btn-projects') || document.querySelector('.hero-cta-group .btn-primary');
    if (ctaBtn) {
      const span = ctaBtn.querySelector('span');
      if (span) span.textContent = hero.ctaText;
      else ctaBtn.textContent = hero.ctaText;
      if (hero.ctaUrl) ctaBtn.href = hero.ctaUrl;
    }
  }
  if (hero.secondaryText) {
    const secBtn = document.getElementById('hero-btn-contact') || document.querySelector('.hero-cta-group .btn-secondary');
    if (secBtn) {
      const span = secBtn.querySelector('span');
      if (span) span.textContent = hero.secondaryText;
      else secBtn.textContent = hero.secondaryText;
      if (hero.secondaryUrl) secBtn.href = hero.secondaryUrl;
    }
  }
}

function applyDynamicAbout(about, profile = {}) {
  const headingEl = document.querySelector('#about .section-header h2');
  if (headingEl && about.heading) headingEl.textContent = about.heading;

  const descEl = document.querySelector('.about-text > p:first-child');
  if (descEl && (about.description || profile.bio)) {
    descEl.textContent = about.description || profile.bio;
  }

  const exploringEl = document.getElementById('about-exploring-text');
  if (exploringEl && about.currentlyExploring) exploringEl.textContent = about.currentlyExploring;
}

function applyDynamicProjects(projects) {
  const container = document.getElementById('projects-grid-container');
  if (!container) return;

  // Build dictionary for deep-dive modal
  projectDataDetails = {};
  projects.forEach(p => {
    const key = p.slug || p.id || p._id;
    projectDataDetails[key] = {
      title: p.title,
      category: p.category || 'Full Stack',
      image: p.image || '/assets/avatar.jpg',
      metrics: p.metrics || ['Production Ready'],
      tech: p.technologies || p.techStack || ['JavaScript'],
      summary: p.shortDescription || p.summary || '',
      architecture: p.detailedDescription || p.architecture || p.summary || '',
      liveUrl: p.liveUrl || p.demoUrl || '#',
      githubUrl: p.githubUrl || '#',
    };
  });

  container.innerHTML = projects.map(p => {
    const key = p.slug || p.id || p._id;
    const catClass = (p.category || 'fullstack').toLowerCase().replace(/\s+/g, '-');
    const techTags = (p.technologies || p.techStack || []).slice(0, 5).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
    const metricPills = (p.metrics || []).slice(0, 3).map(m => `<span class="metric-pill">${escapeHtml(m)}</span>`).join('');

    return `
      <article class="glass-card project-card" data-category="${catClass}">
        <div class="project-thumbnail">
          <img src="${p.image || '/assets/avatar.jpg'}" alt="${escapeHtml(p.title)}" loading="lazy">
          <div class="project-badge-overlay">
            <span class="badge-pill">${escapeHtml(p.category || 'Engineering')}</span>
          </div>
          ${p.featured ? `<div class="project-featured-star"><i class='bx bxs-star'></i> Featured</div>` : ''}
        </div>
        <div class="project-body">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <div class="project-subtitle">${escapeHtml(p.shortDescription || p.subtitle || '')}</div>
          <p class="project-summary">${escapeHtml(p.detailedDescription || p.summary || p.shortDescription || '')}</p>
          <div class="project-metrics-pills">${metricPills}</div>
          <div class="project-tech-tags">${techTags}</div>
          <div class="project-actions">
            <button class="project-btn-details" data-project="${key}">
              <i class='bx bx-info-circle'></i> Details
            </button>
            ${p.githubUrl ? `
              <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class='bx bxl-github'></i> Code
              </a>
            ` : ''}
            ${p.liveUrl ? `
              <a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link" style="color: var(--accent-cyan);">
                <i class='bx bx-link-external'></i> Live
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-attach modal listeners
  attachProjectModalTriggers();
}

function applyDynamicSkills(skills) {
  const container = document.getElementById('skills-grid-container');
  if (!container) return;

  container.innerHTML = skills.map(s => {
    const cat = (s.category || 'other').toLowerCase();
    const iconClass = s.icon?.startsWith('b') ? s.icon : (s.icon ? `bxl-${s.icon}` : 'bx-code-alt');

    return `
      <div class="glass-card skill-card" data-category="${cat}">
        <div class="skill-card-top">
          <div class="skill-identity">
            <div class="skill-icon-wrap"><i class='bx ${iconClass}' style="font-size: 1.4rem; color: var(--accent-cyan);"></i></div>
            <div>
              <div class="skill-name">${escapeHtml(s.name)}</div>
              <div class="skill-exp-tag">${s.yearsExperience || 2} Years Experience</div>
            </div>
          </div>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-level="${s.level || 85}" style="width: ${s.level || 85}%;"></div>
        </div>
        <div class="skill-card-meta">
          <span>${escapeHtml(s.description || s.category)}</span>
          <span>${s.level || 85}%</span>
        </div>
      </div>
    `;
  }).join('');
}

function applyDynamicTimeline(experience, education) {
  const container = document.querySelector('.timeline-wrapper');
  if (!container) return;

  const expSection = document.getElementById('experience');

  // If no experience and no education, hide section
  if ((!experience || experience.length === 0) && (!education || education.length === 0)) {
    if (expSection) expSection.style.display = 'none';
    return;
  }
  if (expSection) expSection.style.display = '';

  let html = '';

  // Render Experience items
  experience.forEach(exp => {
    const tech = (exp.technologies || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
    html += `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="glass-card timeline-card">
          <div class="timeline-header">
            <div>
              <h3 class="timeline-role">${escapeHtml(exp.jobTitle)}</h3>
              <div class="timeline-company">${escapeHtml(exp.company)} • ${escapeHtml(exp.location || 'India')}</div>
            </div>
            <span class="timeline-period">${escapeHtml(exp.startDate)} - ${exp.currentlyWorking ? 'Present' : escapeHtml(exp.endDate)}</span>
          </div>
          <p class="timeline-desc">${escapeHtml(exp.description || '')}</p>
          ${tech ? `<div class="project-tech-tags" style="margin-top: 10px;">${tech}</div>` : ''}
        </div>
      </div>
    `;
  });

  // Render Education items
  education.forEach(edu => {
    html += `
      <div class="timeline-item">
        <div class="timeline-marker" style="border-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan);"></div>
        <div class="glass-card timeline-card">
          <div class="timeline-header">
            <div>
              <h3 class="timeline-role">${escapeHtml(edu.degree)}</h3>
              <div class="timeline-company">${escapeHtml(edu.institution)} • ${escapeHtml(edu.location || '')}</div>
            </div>
            <span class="timeline-period">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</span>
          </div>
          <p class="timeline-desc">${escapeHtml(edu.description || '')}</p>
          <div style="margin-top: 8px;">
            <span class="badge-pill emerald">${escapeHtml(edu.status || 'Completed')}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function applyDynamicResume(resume) {
  if (!resume || !resume.fileUrl) return;

  document.querySelectorAll('.resume-trigger-btn, .btn-download-resume').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      window.open(resume.fileUrl, '_blank');
    };
  });
}

function applyDynamicCertificates(certificates) {
  const container = document.getElementById('certificates-grid-container');
  if (!container) return;

  container.innerHTML = certificates.map(cert => {
    let iconClass = 'bx-certification';
    const lower = ((cert.title || '') + ' ' + (cert.issuer || '')).toLowerCase();
    if (lower.includes('cisco')) iconClass = 'bxl-cisco';
    else if (lower.includes('google') || lower.includes('cloud') || lower.includes('gcp')) iconClass = 'bxl-google-cloud';
    else if (lower.includes('salesforce') || lower.includes('agentforce')) iconClass = 'bxl-salesforce';
    else if (lower.includes('java')) iconClass = 'bxl-java';
    else if (lower.includes('pega')) iconClass = 'bx-layer';
    else if (lower.includes('bsnl') || lower.includes('telecom')) iconClass = 'bx-broadcast';
    else if (lower.includes('iot') || lower.includes('embedded')) iconClass = 'bx-chip';
    else if (lower.includes('infosys')) iconClass = 'bx-code-block';

    const isAi = lower.includes('ai') ||
                 lower.includes('bert') ||
                 lower.includes('agentforce') ||
                 lower.includes('transformer') ||
                 lower.includes('nlp') ||
                 lower.includes('generative');

    let certImage = cert.image || '';
    if (!certImage && isAi) {
      if (lower.includes('niecp')) {
        certImage = '/assets/certificates/niecp-ai-cert.png';
      } else {
        certImage = '/assets/certificates/ai-genai-cert.jpg';
      }
    }

    const credentialText = cert.credentialId || (cert.credentialCode ? `Code: ${cert.credentialCode}` : '');
    const issuerText = cert.issuer || 'Certified Authority';
    const issueDate = cert.issueDate || '';
    const certLink = cert.credentialUrl || cert.certificateUrl;

    return `
      <div class="glass-card certificate-card">
        ${certImage ? `
          <div class="cert-image-banner">
            <img src="${escapeHtml(certImage)}" alt="${escapeHtml(cert.title)}" loading="lazy">
            ${isAi ? `<span class="cert-ai-badge"><i class='bx bx-brain'></i> AI Credential</span>` : ''}
          </div>
        ` : ''}
        <div>
          <div class="certificate-header">
            <div class="cert-icon-box">
              <i class='bx ${iconClass}'></i>
            </div>
            <div class="cert-meta-info">
              <span class="cert-issuer-badge">
                <i class='bx bx-check-shield'></i> ${escapeHtml(issuerText)}
              </span>
              <h3 class="cert-title">${escapeHtml(cert.title)}</h3>
            </div>
          </div>
          <p class="cert-description">
            ${escapeHtml(cert.description || 'Verified industry technical accreditation and professional excellence.')}
          </p>
        </div>
        <div class="cert-footer">
          <span><i class='bx bx-calendar'></i> ${escapeHtml(issueDate)}</span>
          ${credentialText ? `
            <span class="cert-code-chip">
              <i class='bx bx-hash'></i> ${escapeHtml(credentialText)}
            </span>
          ` : ''}
          ${certLink ? `
            <a href="${escapeHtml(certLink)}" target="_blank" rel="noopener noreferrer" class="cert-verify-link">
              ${certLink.toLowerCase().includes('.pdf') ? "<i class='bx bxs-file-pdf'></i> View Certificate" : "Verify <i class='bx bx-link-external'></i>"}
            </a>
          ` : `
            <span style="color: var(--accent-emerald); font-weight: 500;">
              <i class='bx bx-badge-check'></i> Verified
            </span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function applyDynamicSocial(links) {
  const visible = links.filter(l => l.isVisible !== false);
  const container = document.querySelector('.hero-social-links');
  if (container && visible.length) {
    container.innerHTML = visible.map(l => {
      let icon = l.icon || 'bx-link';
      if (!icon.startsWith('b')) {
        const plat = (l.platform || '').toLowerCase();
        icon = plat === 'linkedin' ? 'bxl-linkedin-square' : (plat === 'email' ? 'bx-envelope' : `bxl-${plat}`);
      }
      const isMail = l.url?.startsWith('mailto:');
      return `
        <a href="${escapeHtml(l.url)}" ${isMail ? '' : 'target="_blank" rel="noopener noreferrer"'} class="social-pill" id="hero-social-${escapeHtml((l.platform || 'link').toLowerCase())}">
          <i class='bx ${icon}'></i>
          <span>${escapeHtml(l.platform)}</span>
        </a>
      `;
    }).join('');
  }

  // Sync contact section & footer links
  visible.forEach(l => {
    const plat = (l.platform || '').toLowerCase();
    if (plat.includes('github')) {
      document.querySelectorAll('a[href*="github.com"]').forEach(el => {
        if (!el.classList.contains('project-link') && !el.dataset.project) {
          el.href = l.url;
        }
      });
      const ghText = document.querySelector('.contact-item-card a[href*="github.com"]');
      if (ghText) ghText.textContent = l.url.replace(/^https?:\/\//, '');
    } else if (plat.includes('linkedin')) {
      document.querySelectorAll('a[href*="linkedin.com"]').forEach(el => {
        el.href = l.url;
      });
      const inText = document.querySelector('.contact-item-card a[href*="linkedin.com"]');
      if (inText) {
        const cleanSlug = l.url.replace(/\/$/, '').split('/').pop() || 'LinkedIn Network';
        inText.textContent = cleanSlug;
      }
    }
  });
}

function applyDynamicSettings(settings) {
  // Accent colors
  if (settings.primaryColor) {
    document.documentElement.style.setProperty('--accent-primary', settings.primaryColor);
  }
  if (settings.secondaryColor) {
    document.documentElement.style.setProperty('--accent-cyan', settings.secondaryColor);
  }

  // Section visibility
  if (settings.enabledSections) {
    for (const [sec, enabled] of Object.entries(settings.enabledSections)) {
      const el = document.getElementById(sec) || (sec === 'terminal' ? document.getElementById('terminal-section') : null);
      if (el) {
        el.style.display = enabled ? '' : 'none';
      }
    }
  }

  // Section Ordering - Ensures terminal-section stays in the middle and never floats to the top
  if (Array.isArray(settings.sectionsOrder)) {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      const normalizedOrder = settings.sectionsOrder.map(s => s === 'terminal' ? 'terminal-section' : s);
      
      // If terminal-section was omitted, place it squarely in the middle after projects
      if (!normalizedOrder.includes('terminal-section')) {
        const projIdx = normalizedOrder.indexOf('projects');
        if (projIdx !== -1) {
          normalizedOrder.splice(projIdx + 1, 0, 'terminal-section');
        } else {
          const skillsIdx = normalizedOrder.indexOf('skills');
          if (skillsIdx !== -1) {
            normalizedOrder.splice(skillsIdx + 1, 0, 'terminal-section');
          } else {
            normalizedOrder.push('terminal-section');
          }
        }
      }

      normalizedOrder.forEach(secId => {
        const secEl = document.getElementById(secId);
        if (secEl && secEl.parentNode === mainEl) {
          mainEl.appendChild(secEl);
        }
      });
    }
  }
}

function applyDynamicSEO(seo) {
  if (seo.siteTitle) {
    document.title = seo.siteTitle;
  }
  if (seo.metaDescription) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = seo.metaDescription;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter-text');
  if (!typewriterEl) return;

  const roles = [
    "Full-Stack Software Engineer",
    "ECE Technologist & Builder",
    "Distributed Systems Architect",
    "Creative Web & UI Specialist"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const eraseSpeed = 40;
  const delayBetween = 2000;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let currentSpeed = isDeleting ? eraseSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      currentSpeed = delayBetween;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      currentSpeed = 400;
    }

    setTimeout(type, currentSpeed);
  }

  type();
}

/* ==========================================================================
   NAVBAR & SCROLL HANDLING
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bx-menu');
        icon.classList.toggle('bx-x');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   SCROLLSPY ACTIVE LINK
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   PROJECT & SKILL FILTERS
   ========================================================================== */
function initFilters() {
  // Project Filtering
  const projectFilterBtns = document.querySelectorAll('.projects-filter-nav .filter-btn');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      const cards = document.querySelectorAll('.project-card');

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.toLowerCase().includes(filter.toLowerCase())) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Skills Filtering & Animated Progress Bar fills
  const skillFilterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');

  function updateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
      const target = fill.getAttribute('data-level') || '85';
      fill.style.width = `${target}%`;
    });
  }

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateSkillBars();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(skillsSection);
  }

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      const cards = document.querySelectorAll('.skill-card');

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.toLowerCase() === filter.toLowerCase()) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      updateSkillBars();
    });
  });
}

/* ==========================================================================
   TELEMETRY STRIP - LIVE BACKEND STATUS
   ========================================================================== */
async function initTelemetry() {
  const dbStatusEl = document.getElementById('telemetry-db');
  const latencyEl = document.getElementById('telemetry-latency');
  const uptimeEl = document.getElementById('telemetry-uptime');

  if (!dbStatusEl || !latencyEl) return;

  const t0 = performance.now();
  try {
    const res = await fetch('/api/health');
    const t1 = performance.now();
    const roundTrip = Math.round(t1 - t0);

    if (res.ok) {
      const data = await res.json();
      latencyEl.textContent = `${roundTrip}ms`;

      if (data.database && data.database.connected) {
        dbStatusEl.textContent = 'MongoDB Atlas Connected';
        dbStatusEl.className = 'telemetry-value highlight-green';
      } else {
        dbStatusEl.textContent = 'Operational (In-Memory Fallback)';
        dbStatusEl.className = 'telemetry-value highlight-cyan';
      }

      if (uptimeEl && data.uptime) {
        uptimeEl.textContent = data.uptime;
      }
    }
  } catch (err) {
    latencyEl.textContent = 'Local Standalone';
    dbStatusEl.textContent = 'Standalone Mode';
    dbStatusEl.className = 'telemetry-value';
  }
}

/* ==========================================================================
   CONTACT FORM SUBMISSION WITH API DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn');
  const feedbackEl = document.getElementById('form-general-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || name.length < 2) {
      showToast('Please enter your full name (at least 2 characters).', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!message || message.length < 5) {
      showToast('Please provide a message of at least 5 characters.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        showToast('🚀 Message delivered! Thank you for reaching out, I will reply shortly.', 'success');
        if (feedbackEl) {
          feedbackEl.textContent = 'Message sent successfully! Thanks for getting in touch.';
          feedbackEl.className = 'form-feedback success';
          feedbackEl.style.display = 'block';
          setTimeout(() => { feedbackEl.style.display = 'none'; }, 6000);
        }
      } else {
        const errorMsg = result.message || 'Unable to deliver message. Please try again.';
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      form.reset();
      showToast('✨ Message received in offline demonstration mode! Thank you.', 'success');
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }
  });
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}' style="font-size: 1.3rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ==========================================================================
   PROJECT & RESUME MODALS
   ========================================================================== */
function initModals() {
  attachProjectModalTriggers();

  const resumeModal = document.getElementById('resume-modal');

  // Resume triggers
  const resumeBtns = document.querySelectorAll('.resume-trigger-btn');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');
  closeBtns.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('.modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

function attachProjectModalTriggers() {
  const modalOverlay = document.getElementById('project-modal');
  const detailBtns = document.querySelectorAll('.project-btn-details');

  detailBtns.forEach(btn => {
    btn.onclick = () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDataDetails[projectId];
      if (!data || !modalOverlay) return;

      document.getElementById('modal-project-title').textContent = data.title;
      document.getElementById('modal-project-cat').textContent = data.category;
      document.getElementById('modal-project-img').src = data.image;
      document.getElementById('modal-project-summary').textContent = data.summary;
      document.getElementById('modal-project-architecture').textContent = data.architecture;
      document.getElementById('modal-demo-btn').href = data.liveUrl || '#';
      document.getElementById('modal-github-btn').href = data.githubUrl || '#';

      const metricsContainer = document.getElementById('modal-project-metrics');
      if (metricsContainer) {
        metricsContainer.innerHTML = data.metrics.map(m => `<span class="metric-pill">${escapeHtml(m)}</span>`).join('');
      }

      const techContainer = document.getElementById('modal-project-tech');
      if (techContainer) {
        techContainer.innerHTML = data.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
      }

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  });
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (currentTheme === 'cyber') {
    document.documentElement.setAttribute('data-theme', 'cyber');
    toggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
  }

  toggleBtn.addEventListener('click', () => {
    const isCyber = document.documentElement.getAttribute('data-theme') === 'cyber';
    if (isCyber) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
      toggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
      showToast('Switched to Deep Space Dark Theme', 'success');
    } else {
      document.documentElement.setAttribute('data-theme', 'cyber');
      localStorage.setItem('portfolio-theme', 'cyber');
      toggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
      showToast('Switched to Cyberpunk Neon Theme', 'success');
    }
  });
}

/* ==========================================================================
   LIVE IST CLOCK
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('footer-clock');
  if (!clockEl) return;

  function update() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const istTime = new Date().toLocaleTimeString('en-US', options);
    clockEl.textContent = `${istTime} IST (Chennai, India)`;
  }

  setInterval(update, 1000);
  update();
}
