---
title: Create Bank Account
description: Add a new bank account to your company.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/Create/bank-account</span>
</div>

Adds a new bank account for the company your API key belongs to.

## Request

```json
{
  "bankToken": "9f0e-...",
  "iban": "JO94ARAB0010000000000131000302"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `bankToken` | GUID | **Yes** | The bank identifier — get it from `GET /Lookups/Banks` |
| `iban` | string | No | IBAN / account number |

## Response

```json
{
  "data": {
    "token": "aa11-...",
    "iban": "JO94ARAB0010000000000131000302"
  },
  "status": { "success": true, "errorCode": 0 }
}
```

| Field | Type | Description |
|---|---|---|
| `token` | GUID | The new bank account's token — use this in `early-payment` requests |
| `iban` | string | The IBAN that was stored |

## Try It

<div class="try-it-console" id="bac-try">
  <h4>Try it — POST /api/erp/Create/bank-account</h4>
  <div class="field-group">
    <div>
      <label for="bac-bank-token">Bank Token (from /Lookups/Banks)</label>
      <input type="text" id="bac-bank-token" placeholder="9f0e-..." />
    </div>
    <div>
      <label for="bac-iban">IBAN</label>
      <input type="text" id="bac-iban" placeholder="JO94ARAB0010000000000131000302" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="bac-send">Send Request</button>
  </div>
  <div id="bac-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="bac-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('bac-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('bac-response');
    const responseText = document.getElementById('bac-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    const body = {
      bankToken: document.getElementById('bac-bank-token').value.trim(),
      iban: document.getElementById('bac-iban').value.trim() || null,
    };

    responseDiv.style.display = 'block'; responseText.className = 'response-panel'; responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/Create/bank-account', {
        method: 'POST', headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success !== false ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  });
}
</script>
