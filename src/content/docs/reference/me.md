---
title: GET /api/erp/me
description: Discover which program your API key is bound to and which payment endpoint to call.
---

<div class="endpoint-badge">
  <span class="method get">GET</span>
  <span>/api/erp/me</span>
</div>

Describes the API key you are using. No request body.

## Request

```bash
curl -X GET "https://<host>/api/erp/me" \
  -H "X-API-Key: your-api-key"
```

## Response

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

## Response Fields

| Field | Type | Description |
|---|---|---|
| `integrationName` | string | Human-readable label for your integration |
| `company` | string | The company this key belongs to |
| `program` | string | The program name |
| `programType` | string | `Collection`, `SCFProgram`, or `none` |
| `isCollection` | boolean | Convenience flag for a simple branch |
| `nextAction` | string | `request-to-pay`, `early-payment`, or `none` |
| `paymentEndpoint` | string? | The exact path to call after pushing invoices; `null` if no program |

> **Tip:** **Store `nextAction` and `paymentEndpoint` at startup.** Your worker then reads the row and calls the endpoint named in `nextAction` — no hard-coded program types.

## SCF Key Example

```json
{
  "data": {
    "integrationName": "SAP Integration",
    "company": "ACME Trading",
    "program": "ACME SCF Program",
    "programType": "SCFProgram",
    "isCollection": false,
    "nextAction": "early-payment",
    "paymentEndpoint": "/api/erp/invoices/early-payment"
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Try It

<div class="try-it-console" id="me-try">
  <h4>Try it — GET /api/erp/me</h4>
  <div class="btn-row">
    <button class="btn-primary" id="me-try-send">Send Request</button>
  </div>
  <div id="me-try-curl" style="display:none; margin-top: 0.75rem;">
    <label>cURL</label>
    <div class="response-panel" id="me-try-curl-text"></div>
  </div>
  <div id="me-try-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="me-try-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('me-try-send').addEventListener('click', async () => {
    const curlDiv = document.getElementById('me-try-curl');
    const curlText = document.getElementById('me-try-curl-text');
    const responseDiv = document.getElementById('me-try-response');
    const responseText = document.getElementById('me-try-response-text');

    let baseUrl, apiKey;
    try {
      baseUrl = localStorage.getItem('travo_base_url');
      apiKey = localStorage.getItem('travo_api_key');
    } catch {}

    if (!baseUrl || !apiKey) {
      responseDiv.style.display = 'block';
      responseText.className = 'response-panel error';
      responseText.textContent = 'Configure your Base URL and API Key first → Getting Started > Configure the Portal';
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
      responseText.textContent = 'Request failed: ' + e.message;
    }
  });
}
</script>
