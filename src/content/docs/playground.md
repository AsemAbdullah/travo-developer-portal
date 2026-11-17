---
title: API Playground
description: A free-form scratchpad to build and test API requests against your Travo environment.
---

Build any request, see the wire body and cURL command, and fire it at your Travo environment.

> **Tip:** Make sure you've [configured](/getting-started/configure/) your Base URL and API Key first.

<div class="try-it-console" id="playground">
  <h4>API Playground</h4>

  <div class="field-group">
    <div style="display:flex;gap:0.5rem;align-items:end;">
      <div style="width:120px;">
        <label for="pg-method">Method</label>
        <select id="pg-method">
          <option value="GET">GET</option>
          <option value="POST" selected>POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div style="flex:1;">
        <label for="pg-path">Path</label>
        <input type="text" id="pg-path" placeholder="/api/erp/me" value="/api/erp/me" />
      </div>
    </div>

    <div>
      <label for="pg-body">Request Body (JSON)</label>
      <textarea id="pg-body" placeholder="Enter JSON body here"></textarea>
    </div>
  </div>

  <div class="btn-row">
    <button class="btn-primary" id="pg-send">Send Request</button>
    <button class="btn-secondary" id="pg-copy-curl">Copy cURL</button>
    <button class="btn-secondary" id="pg-clear">Clear</button>
  </div>

  <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem;">
    <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.6rem;" id="pg-preset-me">GET /me</button>
    <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.6rem;" id="pg-preset-bank">Bank Accounts</button>
    <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.6rem;" id="pg-preset-lookup">Lookup Banks</button>
    <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.6rem;" id="pg-preset-status">Invoice Status</button>
  </div>

  <div id="pg-curl-section" style="display:none; margin-top: 0.75rem;">
    <label>cURL</label>
    <div class="response-panel" id="pg-curl-text"></div>
  </div>

  <div id="pg-response-section" style="display:none; margin-top: 0.75rem;">
    <label>Response <span id="pg-status-badge" class="status-badge"></span> <span id="pg-timing" style="font-size:0.75rem;color:var(--sl-color-gray-3);"></span></label>
    <div class="response-panel" id="pg-response-text"></div>
  </div>
</div>

<script>
{
  function getConfig() {
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    return { baseUrl, apiKey };
  }

  function buildCurl(method, url, apiKey, body) {
    let cmd = `curl -X ${method} "${url}" \\\n  -H "X-API-Key: ••••••••"`;
    if (body && method !== 'GET') {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
    }
    return cmd;
  }

  document.getElementById('pg-send').addEventListener('click', async () => {
    const { baseUrl, apiKey } = getConfig();
    const responseSection = document.getElementById('pg-response-section');
    const responseText = document.getElementById('pg-response-text');
    const curlSection = document.getElementById('pg-curl-section');
    const curlText = document.getElementById('pg-curl-text');
    const statusBadge = document.getElementById('pg-status-badge');
    const timing = document.getElementById('pg-timing');

    if (!baseUrl || !apiKey) {
      responseSection.style.display = 'block';
      responseText.className = 'response-panel error';
      responseText.textContent = 'Configure your Base URL and API Key first → Getting Started > Configure the Portal';
      return;
    }

    const method = document.getElementById('pg-method').value;
    const path = document.getElementById('pg-path').value;
    const body = document.getElementById('pg-body').value.trim();
    const url = baseUrl + path;

    curlSection.style.display = 'block';
    curlText.textContent = buildCurl(method, url, apiKey, body);

    responseSection.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';
    statusBadge.textContent = '';
    timing.textContent = '';

    const start = performance.now();

    try {
      const opts = {
        method,
        headers: { 'X-API-Key': apiKey, 'Accept': 'application/json' },
      };
      if (body && method !== 'GET') {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = body;
      }

      const res = await fetch(url, opts);
      const elapsed = Math.round(performance.now() - start);
      const text = await res.text();

      let display;
      try { display = JSON.stringify(JSON.parse(text), null, 2); } catch { display = text; }

      const isOk = res.ok;
      responseText.className = 'response-panel ' + (isOk ? 'success' : 'error');
      responseText.textContent = display;
      statusBadge.textContent = `${res.status} ${res.statusText}`;
      statusBadge.className = 'status-badge ' + (isOk ? 'success' : 'error');
      timing.textContent = `${elapsed}ms`;
    } catch (e) {
      const elapsed = Math.round(performance.now() - start);
      responseText.className = 'response-panel error';
      responseText.textContent = 'Request failed: ' + e.message;
      statusBadge.textContent = 'Error';
      statusBadge.className = 'status-badge error';
      timing.textContent = `${elapsed}ms`;
    }
  });

  document.getElementById('pg-copy-curl').addEventListener('click', () => {
    const { baseUrl, apiKey } = getConfig();
    if (!baseUrl) return;
    const method = document.getElementById('pg-method').value;
    const path = document.getElementById('pg-path').value;
    const body = document.getElementById('pg-body').value.trim();
    const curl = buildCurl(method, baseUrl + path, '${API_KEY}', body);
    navigator.clipboard.writeText(curl).catch(() => {});
  });

  document.getElementById('pg-clear').addEventListener('click', () => {
    document.getElementById('pg-body').value = '';
    document.getElementById('pg-response-section').style.display = 'none';
    document.getElementById('pg-curl-section').style.display = 'none';
  });

  function setPreset(method, path, body) {
    document.getElementById('pg-method').value = method;
    document.getElementById('pg-path').value = path;
    document.getElementById('pg-body').value = body;
  }
  document.getElementById('pg-preset-me').addEventListener('click', () => setPreset('GET', '/api/erp/me', ''));
  document.getElementById('pg-preset-bank').addEventListener('click', () => setPreset('GET', '/api/erp/bank-accounts', ''));
  document.getElementById('pg-preset-lookup').addEventListener('click', () => setPreset('GET', '/Lookups/Banks', ''));
  document.getElementById('pg-preset-status').addEventListener('click', () => setPreset('POST', '/api/erp/invoices/status', JSON.stringify({number: 'INV-001'}, null, 2)));
}
</script>
