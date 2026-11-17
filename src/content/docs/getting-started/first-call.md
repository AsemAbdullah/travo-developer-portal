---
title: Your First Call
description: Verify your setup by calling GET /api/erp/me — it tells you which program your key is bound to and which flow to use.
---

## Walkthrough

1. **Configure the portal** — set your Base URL and API key on the [Configure](/getting-started/configure/) page.
2. **Call `GET /api/erp/me`** — use the console below. It describes your key: company, program, and which payment endpoint to call.
3. **Read the response** — `nextAction` tells you your flow: `early-payment` (SCF) or `request-to-pay` (Collection).
4. **Next:** head to [Invoices — Create (Bulk)](/reference/invoices-bulk/) to push your first invoices.

## Try it: `GET /api/erp/me`

<div class="endpoint-badge">
  <span class="method get">GET</span>
  <span>/api/erp/me</span>
</div>

No request body. The API key in the header is all you need.

<div class="try-it-console" id="me-console">
  <h4>Try it — GET /api/erp/me</h4>
  <div class="btn-row">
    <button class="btn-primary" id="me-send">Send Request</button>
  </div>
  <div id="me-curl" style="display:none; margin-top: 0.75rem;">
    <label>cURL</label>
    <div class="response-panel" id="me-curl-text"></div>
  </div>
  <div id="me-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="me-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('me-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('me-response');
    const responseText = document.getElementById('me-response-text');
    const curlDiv = document.getElementById('me-curl');
    const curlText = document.getElementById('me-curl-text');

    let baseUrl, apiKey;
    try {
      baseUrl = localStorage.getItem('travo_base_url');
      apiKey = localStorage.getItem('travo_api_key');
    } catch {}

    if (!baseUrl || !apiKey) {
      responseDiv.style.display = 'block';
      responseText.className = 'response-panel error';
      responseText.textContent = 'Missing configuration. Go to Configure the Portal and save your Base URL and API Key first.';
      return;
    }

    const url = baseUrl + '/api/erp/me';
    curlDiv.style.display = 'block';
    curlText.textContent = `curl -X GET "${url}" \\\n  -H "X-API-Key: ••••••••"`;

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'X-API-Key': apiKey, 'Accept': 'application/json' },
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      responseText.className = 'response-panel error';
      responseText.textContent = 'Request failed: ' + e.message + '\n\nIf you see a CORS error, your Travo server may need to allow this portal\'s origin.';
    }
  });
}
</script>

## Expected Response

```json
{
  "data": {
    "integrationName": "Odoo Production",
    "company": "Al Noor Trading",
    "program": "Collection - Al Noor Trading",
    "programType": "Collection",
    "isCollection": true,
    "nextAction": "request-to-pay",
    "paymentEndpoint": "/api/erp/invoices/request-to-pay"
  },
  "status": { "success": true, "errorCode": 0 }
}
```

| Field | Meaning |
|---|---|
| `programType` | `Collection`, `SCFProgram`, or `none` |
| `isCollection` | Convenience boolean |
| `nextAction` | `request-to-pay`, `early-payment`, or `none` |
| `paymentEndpoint` | The exact path to call after pushing invoices; `null` if no program |

> **Tip:** Call this once at startup and log the result. It makes misconfiguration obvious immediately instead of at the first failed payment call.

## What's Next?

Based on your `nextAction`:

- **`early-payment`** → You're on SCF. Read the [Early Payment flow](/reference/early-payment/).
- **`request-to-pay`** → You're on Collection. Read the [Request to Pay flow](/reference/request-to-pay/).
- **Both flows** start with [pushing invoices](/reference/invoices-bulk/).
