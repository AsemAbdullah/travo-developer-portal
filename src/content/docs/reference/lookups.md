---
title: Lookups
description: List available banks and joined programs.
---

## GET /Lookups/Banks

<div class="endpoint-badge">
  <span class="method get">GET</span>
  <span>/Lookups/Banks</span>
</div>

Returns the list of banks subscribed to Travo. Use the returned `id` as `bankToken` when creating a bank account.

```bash
curl -X GET "https://<host>/Lookups/Banks" \
  -H "X-API-Key: your-api-key"
```

```json
{
  "data": [
    { "id": "9f0e-...", "value": "Arab Bank" },
    { "id": "a1b2-...", "value": "Housing Bank" }
  ],
  "status": { "success": true }
}
```

---

## GET /Lookups/Programs

<div class="endpoint-badge">
  <span class="method get">GET</span>
  <span>/Lookups/Programs</span>
</div>

Returns the programs your company has joined.

```bash
curl -X GET "https://<host>/Lookups/Programs" \
  -H "X-API-Key: your-api-key"
```

```json
{
  "data": [
    { "id": "d4e5-...", "value": "ACME SCF Program" },
    { "id": "f6g7-...", "value": "Collection - Al Noor Trading" }
  ],
  "status": { "success": true }
}
```

> **Tip:** Use the `id` from this list as `programToken` on `invoices/bulk` when your company has multiple programs and you need to target a specific one.

## Try It

<div class="try-it-console" id="lookup-try">
  <h4>Try it — Lookups</h4>
  <div class="btn-row">
    <button class="btn-primary" id="lookup-banks">GET /Lookups/Banks</button>
    <button class="btn-secondary" id="lookup-programs">GET /Lookups/Programs</button>
  </div>
  <div id="lookup-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="lookup-response-text"></div>
  </div>
</div>

<script>
{
  async function callLookup(path) {
    const responseDiv = document.getElementById('lookup-response');
    const responseText = document.getElementById('lookup-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    responseDiv.style.display = 'block'; responseText.className = 'response-panel'; responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + path, {
        method: 'GET', headers: { 'X-API-Key': apiKey, 'Accept': 'application/json' },
      });
      const json = await res.json();
      responseText.className = 'response-panel success';
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  }

  document.getElementById('lookup-banks').addEventListener('click', () => callLookup('/Lookups/Banks'));
  document.getElementById('lookup-programs').addEventListener('click', () => callLookup('/Lookups/Programs'));
}
</script>
