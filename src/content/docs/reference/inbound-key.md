---
title: Inbound Key Exchange
description: Register the key CreditPlus will use when calling back into your ERP to pull invoices.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/inbound-key</span>
</div>

The two systems (your ERP and CreditPlus) exchange credentials directly so neither has to hold accounts on both sides. Your ERP sends CreditPlus the key it must present when calling back into your system.

## When to Use This

If your ERP hosts its own invoice retrieval endpoint (e.g., Odoo's `GET /api/erp/odoo/invoices`), CreditPlus needs a key to authenticate when pulling invoices from you. This endpoint registers that key.

## Request

```json
{
  "erpApiKey": "your-inbound-api-key",
  "erpEndpointUrl": "https://your-erp.example.com/api/erp/odoo/invoices"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `erpApiKey` | string | **Yes** | The key CreditPlus will present in `X-API-Key` when calling your ERP |
| `erpEndpointUrl` | string | No | The full URL of your invoice retrieval endpoint |

## Response

```json
{
  "data": null,
  "status": {
    "success": true,
    "message": "Inbound key stored successfully.",
    "errorCode": 0
  }
}
```

## How It Works

1. Your ERP generates an API key for inbound access.
2. Your ERP calls `POST /api/erp/inbound-key` (authenticated with **your** CreditPlus API key) and sends the inbound key + endpoint URL.
3. CreditPlus stores both values on your integration record.
4. When CreditPlus needs to pull invoices, it calls your `erpEndpointUrl` with `X-API-Key: <erpApiKey>`.

> **Tip:** To rotate the key, call this endpoint again with the new key. The old key is replaced immediately.

## Automatic Registration (Odoo)

If you use the CreditPlus Odoo module, this handshake happens automatically when you save the Inbound API Key in Odoo's Accounting Settings. You don't need to call this endpoint manually.

## cURL Example

```bash
curl -X POST "https://<host>/api/erp/inbound-key" \
  -H "X-API-Key: your-creditplus-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "erpApiKey": "my-erp-secret-key-123",
    "erpEndpointUrl": "https://erp.mycompany.com/api/erp/odoo/invoices"
  }'
```

## Try It

<div class="try-it-console" id="ik-try">
  <h4>Try it — POST /api/erp/inbound-key</h4>
  <div class="field-group">
    <div>
      <label for="ik-key">ERP API Key</label>
      <input type="text" id="ik-key" placeholder="your-inbound-api-key" />
    </div>
    <div>
      <label for="ik-url">ERP Endpoint URL (optional)</label>
      <input type="url" id="ik-url" placeholder="https://erp.example.com/api/erp/odoo/invoices" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="ik-send">Send Request</button>
  </div>
  <div id="ik-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="ik-response-text"></div>
  </div>
</div>

<script>
document.getElementById('ik-send').addEventListener('click', async function() {
  var responseDiv = document.getElementById('ik-response');
  var responseText = document.getElementById('ik-response-text');
  var baseUrl, apiKey;
  try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch(e) {}
  if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

  var body = {
    erpApiKey: document.getElementById('ik-key').value,
    erpEndpointUrl: document.getElementById('ik-url').value || null
  };

  responseDiv.style.display = 'block';
  responseText.className = 'response-panel';
  responseText.textContent = 'Sending...';

  try {
    var res = await fetch(baseUrl + '/api/erp/inbound-key', {
      method: 'POST',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var json = await res.json();
    responseText.className = 'response-panel ' + (json.status && json.status.success ? 'success' : 'error');
    responseText.textContent = JSON.stringify(json, null, 2);
  } catch(e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
});
</script>
