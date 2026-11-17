---
title: Bank Accounts
description: List the bank accounts linked to your company.
---

<div class="endpoint-badge">
  <span class="method get">GET</span>
  <span>/api/erp/bank-accounts</span>
</div>

Returns all bank accounts for the company your API key belongs to.

## Request

No body required.

```bash
curl -X GET "https://<host>/api/erp/bank-accounts" \
  -H "X-API-Key: your-api-key"
```

## Response

```json
{
  "data": {
    "totalCount": 2,
    "bankAccounts": [
      {
        "token": "aa11-...",
        "bankName": "Arab Bank",
        "accountNumber": "JO94ARAB0010000000000131000302"
      },
      {
        "token": "bb22-...",
        "bankName": "Housing Bank",
        "accountNumber": "JO94HBHO0010000000000131000302"
      }
    ]
  },
  "status": { "success": true, "errorCode": 0 }
}
```

| Field | Type | Description |
|---|---|---|
| `totalCount` | int | Number of bank accounts |
| `bankAccounts[].token` | GUID | Bank account identifier — use this in `early-payment` requests |
| `bankAccounts[].bankName` | string | Bank name |
| `bankAccounts[].accountNumber` | string | IBAN / account number |

> **Tip:** The supplier must have at least one **Active** bank account before an early-payment quote or request can be produced.

## Try It

<div class="try-it-console" id="ba-try">
  <h4>Try it — GET /api/erp/bank-accounts</h4>
  <div class="btn-row">
    <button class="btn-primary" id="ba-send">Send Request</button>
  </div>
  <div id="ba-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="ba-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('ba-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('ba-response');
    const responseText = document.getElementById('ba-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    responseDiv.style.display = 'block'; responseText.className = 'response-panel'; responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/bank-accounts', {
        method: 'GET', headers: { 'X-API-Key': apiKey, 'Accept': 'application/json' },
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success !== false ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  });
}
</script>
