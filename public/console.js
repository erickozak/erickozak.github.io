/*
 * console.js — the site's drop-down console. Press ` (backtick) to toggle.
 *
 * Self-hosted, zero dependencies, ~350 lines you can read in one sitting.
 * All output is rendered with textContent (never innerHTML), so nothing in
 * the manifest or user input can inject markup. Data comes from
 * /console-manifest.json, generated at build time.
 */
(function () {
  'use strict';
  if (window.__qcInit) return;
  window.__qcInit = true;

  var state = {
    open: false,
    built: false,
    cwd: '~',
    hist: [],
    hi: -1,
    m: null, // manifest
    lastFocus: null,
  };

  var els = {};

  /* ---------------------------------------------------------------- DOM */

  function build() {
    if (state.built) return;
    state.built = true;

    var root = document.createElement('div');
    root.className = 'qc';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'site console');

    var inner = document.createElement('div');
    inner.className = 'qc-inner';

    var out = document.createElement('div');
    out.className = 'qc-out';

    var form = document.createElement('form');
    form.className = 'qc-form';

    var ps1 = document.createElement('span');
    ps1.className = 'qc-ps1';

    var input = document.createElement('input');
    input.className = 'qc-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'console input');

    var hint = document.createElement('div');
    hint.className = 'qc-hintbar';
    hint.textContent =
      "tab: complete · ↑↓: history · esc: close · 'help' for commands";

    form.appendChild(ps1);
    form.appendChild(input);
    inner.appendChild(out);
    inner.appendChild(form);
    inner.appendChild(hint);
    root.appendChild(inner);
    document.body.appendChild(root);

    els = { root: root, out: out, input: input, ps1: ps1 };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = input.value;
      input.value = '';
      run(raw);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        complete();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        histNav(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        histNav(-1);
      }
    });
  }

  function ps1Text() {
    var p = state.m && state.m.prompt ? state.m.prompt : 'console';
    return p + ':' + state.cwd + '$';
  }

  function refreshPs1() {
    els.ps1.textContent = ps1Text();
  }

  /* ------------------------------------------------------------- output */

  function line(text, cls) {
    var div = document.createElement('div');
    div.className = 'qc-line' + (cls ? ' ' + cls : '');
    div.textContent = text;
    els.out.appendChild(div);
    els.out.scrollTop = els.out.scrollHeight;
    return div;
  }

  function lineLink(prefix, href, label, suffix, external) {
    var div = document.createElement('div');
    div.className = 'qc-line';
    if (prefix) div.appendChild(document.createTextNode(prefix));
    var a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (external) a.rel = 'noopener';
    div.appendChild(a);
    if (suffix) div.appendChild(document.createTextNode(suffix));
    els.out.appendChild(div);
    els.out.scrollTop = els.out.scrollHeight;
  }

  function echoCmd(raw) {
    line(ps1Text() + ' ' + raw, 'qc-line--cmd');
  }

  /* ----------------------------------------------------------- manifest */

  function ensureManifest() {
    if (state.m) return Promise.resolve(state.m);
    if (window.__CONSOLE_MANIFEST__) {
      state.m = window.__CONSOLE_MANIFEST__;
      return Promise.resolve(state.m);
    }
    return fetch('/console-manifest.json')
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(function (j) {
        state.m = j;
        return j;
      })
      .catch(function () {
        state.m = {
          prompt: 'console',
          posts: [],
          projects: [],
          signals: { items: [] },
          attack: [],
          build: {},
        };
        line('warn: manifest unavailable — limited mode', 'qc-line--err');
        return state.m;
      });
  }

  /* --------------------------------------------------------- virtual fs */

  function rootEntries() {
    return ['writing/', 'projects/', 'about.md', 'signals.log', 'attack.map'];
  }

  function postSlugs() {
    return (state.m.posts || []).map(function (p) {
      return p.slug;
    });
  }

  function findPost(name) {
    var n = name.replace(/\/$/, '');
    return (state.m.posts || []).find(function (p) {
      return p.slug === n;
    });
  }

  function navigate(href) {
    line('opening ' + href + ' …');
    window.location.href = href;
  }

  /* ------------------------------------------------------------ history */

  function histNav(dir) {
    if (!state.hist.length) return;
    state.hi = Math.min(
      Math.max(state.hi + dir, -1),
      state.hist.length - 1
    );
    els.input.value =
      state.hi === -1 ? '' : state.hist[state.hist.length - 1 - state.hi];
  }

  /* --------------------------------------------------------- completion */

  function complete() {
    var raw = els.input.value;
    var parts = raw.split(/\s+/);
    var frag = parts[parts.length - 1] || '';
    var pool;

    if (parts.length <= 1) {
      pool = Object.keys(COMMANDS);
    } else {
      pool = rootEntries()
        .concat(postSlugs())
        .concat(['~', '..', 'home', 'github', 'linkedin', 'rss', 'motd']);
      (state.m.projects || []).forEach(function (p) {
        pool.push(p.name);
      });
    }

    var hits = pool.filter(function (c) {
      return c.indexOf(frag) === 0;
    });
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      els.input.value = parts.join(' ');
    } else if (hits.length > 1) {
      // extend to the longest common prefix, then show options
      var common = hits.reduce(function (a, b) {
        var i = 0;
        while (i < a.length && a[i] === b[i]) i++;
        return a.slice(0, i);
      });
      if (common.length > frag.length) {
        parts[parts.length - 1] = common;
        els.input.value = parts.join(' ');
      }
      line(hits.join('  '));
    }
  }

  /* ----------------------------------------------------------- commands */

  var COMMANDS = {
    help: function () {
      line('commands:');
      line('  ls [dir]        list contents');
      line('  cd <dir>        change directory / open a page');
      line('  cat <file>      read a file');
      line('  open <target>   go somewhere: post slug, about, github, rss …');
      line('  signals         newest known-exploited vulns (CISA KEV)');
      line('  attack          ATT&CK techniques the writing covers');
      line('  whoami · pwd · date · echo · history · clear · exit');
    },

    ls: function (args) {
      var target = args[0] ? args[0].replace(/\/$/, '') : state.cwd;
      if (target === '~' || target === '' || target === '/') {
        line(rootEntries().join('  '));
      } else if (target === 'writing' || target === '~/writing') {
        (state.m.posts || []).forEach(function (p) {
          lineLink(p.date + '  ', '/writing/' + p.slug + '/', p.slug, '');
        });
        if (!(state.m.posts || []).length) line('(no posts yet)');
      } else if (target === 'projects' || target === '~/projects') {
        (state.m.projects || []).forEach(function (p) {
          line(p.name + '/  [' + p.status + ']');
        });
      } else {
        line('ls: cannot access ' + target + ': no such directory', 'qc-line--err');
      }
    },

    cd: function (args) {
      var t = (args[0] || '~').replace(/\/$/, '');
      if (t === '~' || t === '/' || t === '') {
        state.cwd = '~';
      } else if (t === '..') {
        state.cwd = '~';
      } else if (t === 'writing' || t === '~/writing') {
        state.cwd = '~/writing';
      } else if (t === 'projects' || t === '~/projects') {
        state.cwd = '~/projects';
      } else if (t === 'about' || t === 'about.md') {
        navigate('/about/');
        return;
      } else if (findPost(t.replace(/^~?\/?writing\//, ''))) {
        navigate('/writing/' + t.replace(/^~?\/?writing\//, '') + '/');
        return;
      } else {
        line('bash: cd: ' + t + ': no such file or directory', 'qc-line--err');
        return;
      }
      refreshPs1();
    },

    cat: function (args) {
      var t = (args[0] || '').replace(/\/$/, '');
      if (!t) return line('cat: which file?', 'qc-line--err');
      if (t === 'about' || t === 'about.md') {
        var s = state.m.site || {};
        line((s.author || 'Eric') + ' — security engineer, blue team.');
        line('detection engineering · threat intel · automation.');
        lineLink('full version: ', '/about/', '/about/', '');
      } else if (t === 'signals.log') {
        COMMANDS.signals();
      } else if (t === 'attack.map') {
        COMMANDS.attack();
      } else if (t === 'motd') {
        banner();
      } else {
        var post = findPost(t);
        if (post) {
          line(post.title + '  (' + post.date + ')');
          if (post.desc) line(post.desc);
          lineLink('read: ', '/writing/' + post.slug + '/', 'open ' + post.slug, '');
        } else {
          line('cat: ' + t + ': no such file', 'qc-line--err');
        }
      }
    },

    open: function (args) {
      var t = (args[0] || '').replace(/\/$/, '');
      var s = state.m.site || {};
      if (!t) return line('open: where to?', 'qc-line--err');
      if (t === 'home' || t === '~') return navigate('/');
      if (t === 'writing') return navigate('/writing/');
      if (t === 'projects') return navigate('/projects/');
      if (t === 'about' || t === 'about.md') return navigate('/about/');
      if (t === 'rss') return navigate('/rss.xml');
      if (t === 'github' && s.github) return void window.open(s.github, '_blank', 'noopener');
      if (t === 'linkedin' && s.linkedin) return void window.open(s.linkedin, '_blank', 'noopener');
      if (findPost(t)) return navigate('/writing/' + t + '/');
      line('open: unknown target: ' + t, 'qc-line--err');
    },

    signals: function () {
      var sig = state.m.signals || {};
      var items = sig.items || [];
      if (!items.length) {
        line('signals.log is empty — first KEV sync pending (runs nightly).');
        return;
      }
      items.forEach(function (i) {
        line(
          i.dateAdded +
            '  ' +
            i.cve +
            '  ' +
            i.vendor +
            ' ' +
            i.product +
            (i.ransomware ? '  [ransomware]' : '')
        );
      });
      line('source: CISA KEV catalog');
    },

    attack: function () {
      var cov = state.m.attack || [];
      if (!cov.length) {
        line('no techniques mapped yet — tag posts with techniques: [T1566]');
        return;
      }
      cov.forEach(function (t) {
        lineLink(
          t.id + '  ' + t.name + '  (' + t.count + ') — ',
          '/writing/' + t.slug + '/',
          'latest post',
          ''
        );
      });
    },

    pwd: function () {
      line(state.cwd);
    },

    whoami: function () {
      line('guest (uid 1000) — session logged to /dev/null. we mean it: no analytics.');
    },

    date: function () {
      line(new Date().toString());
    },

    echo: function (args) {
      line(args.join(' '));
    },

    history: function () {
      state.hist.forEach(function (h, i) {
        line('  ' + (i + 1) + '  ' + h);
      });
    },

    clear: function () {
      els.out.textContent = '';
    },

    banner: function () {
      banner();
    },

    motd: function () {
      banner();
    },

    exit: function () {
      close();
    },

    quit: function () {
      close();
    },

    sudo: function () {
      line(
        'guest is not in the sudoers file. this incident will be reported (to nobody — we do not log).',
        'qc-line--err'
      );
    },

    rm: function (args) {
      if (args.join(' ').indexOf('-rf') !== -1) {
        line('rm: read-only filesystem — the whole site is static. nice try though.');
      } else {
        line('rm: read-only filesystem');
      }
    },

    nmap: function () {
      line('scanning erickozak.io …');
      line('open: 443/https');
      line("that's the entire attack surface.");
    },

    ps: function () {
      line('  PID  UNIT             STATUS');
      line('    1  blog.service     running (static)');
      line('    2  signals.timer    waiting (next: nightly)');
      line('    3  visitor.pid      you');
    },
  };

  function banner() {
    var b = state.m.build || {};
    line((state.m.prompt || 'console') + ' — blue team, threat intel, automation');
    line('build ' + (b.sha || 'dev') + (b.time ? ' · ' + b.time : ''));
    line("type 'help' to look around.");
  }

  function run(raw) {
    var trimmed = raw.trim();
    echoCmd(raw);
    if (!trimmed) return;
    state.hist.push(trimmed);
    state.hi = -1;

    var parts = trimmed.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var fn = Object.prototype.hasOwnProperty.call(COMMANDS, cmd)
      ? COMMANDS[cmd]
      : null;
    if (fn) {
      fn(parts.slice(1));
    } else {
      line('command not found: ' + cmd + "  (try 'help')", 'qc-line--err');
    }
  }

  /* -------------------------------------------------------- open/close */

  function open() {
    build();
    state.lastFocus = document.activeElement;
    els.root.classList.add('qc--open');
    state.open = true;
    ensureManifest().then(function () {
      refreshPs1();
      if (!els.out.childNodes.length) banner();
      els.input.focus();
    });
    els.input.focus();
  }

  function close() {
    if (!state.built) return;
    els.root.classList.remove('qc--open');
    state.open = false;
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function toggle() {
    state.open ? close() : open();
  }

  /* ------------------------------------------------------------ wiring */

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var typing =
      t &&
      (t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.isContentEditable);

    if ((e.key === '`' || e.key === '~') && (!typing || t === els.input)) {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Escape' && state.open) {
      close();
    }
  });

  var toggles = document.querySelectorAll('[data-console-toggle]');
  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('click', toggle);
  }
})();
