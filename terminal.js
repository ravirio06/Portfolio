/**
 * Interactive Cyber Terminal
 * Handles shell commands: help, bio, skills, projects, contact, health, clear, sudo hire, etc.
 */
(function() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const hintChips = document.querySelectorAll('.terminal-hint-chip');

  if (!terminalInput || !terminalBody) return;

  const COMMANDS = {
    help: `Available commands:
  • bio         - Overview of Ravinithishkumar S
  • skills      - List core technical proficiencies
  • projects    - Summary of highlighted engineering projects
  • contact     - Direct email and communication links
  • health      - Probe live backend API & database status
  • sudo hire   - Fast-track recruiter / client outreach
  • repo        - View project repository links
  • clear       - Wipe terminal screen`,

    bio: `Ravinithishkumar S
Role: Full-Stack Engineer & Creative Architect
Location: Chennai, Tamil Nadu, India (IST / UTC+5:30)
Experience: 4+ Years building production web apps, distributed microservices, and interactive UI systems.
Philosophy: "Fast, resilient, and unapologetically aesthetic."`,

    skills: `Tech Stack Overview:
Frontend:   JavaScript (ESNext), TypeScript, React, Next.js, HTML5/CSS3, WebGL
Backend:    Node.js, Express, Python, FastAPI, Microservices, REST & GraphQL
Databases:  MongoDB, PostgreSQL, Redis, Prisma, Vector Search
DevOps:     Docker, Kubernetes, AWS (S3/EC2/Lambda), CI/CD, Linux, Nginx`,

    projects: `Highlighted Works:
[1] NexStore Cloud          - High-throughput e-commerce engine (<45ms latency)
[2] NeuralPulse AI Hub      - Predictive AI telemetry dashboard (60fps canvas)
[3] CryptaSync Multi-Chain  - EVM cross-chain telemetry & gas tracker
[4] DevCanvas Workspace     - Real-time whiteboard & multiplayer editor
[5] CyberSentinel Guard     - Automated container & cloud security scanner
[6] HyperStream CDN         - Edge image transcoding & optimization gateway`,

    contact: `Direct Communication:
• Email:    ravinithishkumar2006@gmail.com
• GitHub:   https://github.com/ravirio06
• LinkedIn: https://www.linkedin.com/in/ravi-nithishkumar-s-81a246332/
• Location: Chennai, Tamil Nadu, India`,

    'sudo hire': `[PERMISSIONS GRANTED: ROOT ACCESS ACQUIRED]
🚀 Initiating connection to Ravinithishkumar...
Status: Ready for high-impact roles, engineering contracts, and technical leadership!
Please email: ravinithishkumar.dev@gmail.com or submit the contact form below.`,

    certs: `Verified Certifications & Accreditations:
• Generative AI & Cisco Architecture (CISCO - 2025)
• BSNL Industrial Telecommunications (BSNL - 2025)
• Google Cloud Computing Certificate (Google Cloud - 2026, Code: 9745349)`,

    certificates: `Verified Certifications & Accreditations:
• Generative AI & Cisco Architecture (CISCO - 2025)
• BSNL Industrial Telecommunications (BSNL - 2025)
• Google Cloud Computing Certificate (Google Cloud - 2026, Code: 9745349)`,

    date: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (India Standard Time)'
  };

  function appendOutput(cmd, output) {
    const row = document.createElement('div');
    row.className = 'terminal-line';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'terminal-prompt';
    promptSpan.textContent = 'visitor@ravinithish-os:~$';

    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'terminal-command';
    cmdSpan.textContent = ` ${cmd}`;

    row.appendChild(promptSpan);
    row.appendChild(cmdSpan);

    if (output) {
      const respDiv = document.createElement('div');
      respDiv.className = 'terminal-response';
      respDiv.textContent = output;
      row.appendChild(respDiv);
    }

    terminalBody.appendChild(row);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  async function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    if (cmd === 'health' || cmd === 'curl health') {
      appendOutput(rawCmd, 'Probing http://localhost:5000/api/health...');
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        appendOutput('', JSON.stringify(data, null, 2));
      } catch (err) {
        appendOutput('', `[API Probe Result]: Offline or Standalone Mode. Status: Resilient In-Memory Fallback Active.`);
      }
      return;
    }

    if (cmd === 'repo') {
      appendOutput(rawCmd, 'Repository: https://github.com/ravirio06/portfolio\nBranch: main\nStatus: 100% test coverage');
      return;
    }

    if (COMMANDS[cmd]) {
      const resp = typeof COMMANDS[cmd] === 'function' ? COMMANDS[cmd]() : COMMANDS[cmd];
      appendOutput(rawCmd, resp);
    } else {
      appendOutput(rawCmd, `zsh: command not found: ${cmd}. Type "help" for a list of valid commands.`);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  hintChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
      executeCommand(cmd);
      terminalInput.focus();
    });
  });

  // Global Ctrl + K / Cmd + K to focus terminal
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const terminalSection = document.getElementById('terminal-section');
      if (terminalSection) {
        terminalSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => terminalInput.focus(), 400);
      }
    }
  });
})();
