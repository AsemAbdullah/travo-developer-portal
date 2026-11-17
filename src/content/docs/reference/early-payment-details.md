---
title: Get Early Payment Quote
description: Get a fee and discount breakdown before submitting a financing request.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/early-payment/details</span>
</div>

Returns a fee/discount breakdown for one or more invoices. Call this before `early-payment` so the supplier sees what they'll receive.

## Request

```json
{
  "invoiceTokens": ["bbb-222-...", "ccc-333-..."],
  "bankAccountToken": "aa11-..."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceTokens` | GUID[] | **Yes** | Tokens from `invoices/bulk` response |
| `bankAccountToken` | GUID | No | The supplier's bank account. When omitted, the system picks the first active one. |

## Response

```json
{
  "data": {
    "invoiceCount": 2,
    "currency": "JOD",
    "totalAmount": 25000.000,
    "totalFees": 640.560,
    "totalNetAmount": 24359.440,
    "invoices": [
      {
        "token": "bbb-222-...",
        "number": "INV-001",
        "currency": "JOD",
        "amount": 12500.000,
        "issueDate": "2026-07-01",
        "dueDate": "2026-09-01",
        "duration": 62,
        "discountRate": 0.08,
        "discountingFees": 169.863,
        "commission": 50.000,
        "additionalCommission": 0,
        "otherFees": 0,
        "serviceFees": 50.000,
        "systemFees": 50.417,
        "totalFees": 320.280,
        "netAmount": 12179.720,
        "supplierPercentage": 100,
        "paymentDate": "2026-07-15",
        "html": "<html>…Assignment of Proceeds terms…</html>"
      }
    ]
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Per-Invoice Fee Fields

| Field | Type | Description |
|---|---|---|
| `duration` | int | Days from payment date to due date |
| `discountRate` | decimal | Annual discount rate |
| `discountingFees` | decimal | The core discounting fee |
| `commission` | decimal | Bank commission |
| `additionalCommission` | decimal | Additional commission (if any) |
| `otherFees` | decimal | Other fees |
| `serviceFees` | decimal | Service/platform fees |
| `systemFees` | decimal | System fees |
| `totalFees` | decimal | Sum of all fees |
| `netAmount` | decimal | What the supplier receives |
| `supplierPercentage` | decimal | Percentage of the invoice being financed |
| `paymentDate` | string | When the payment will be made |
| `html` | string? | Assignment-of-Proceeds terms (show to the supplier) |

> **Note:** **Precondition:** The company must have at least one **Active** bank account, otherwise you get `400 — "The company has no active bank account, so early payment cannot be quoted."`

## Try It

<div class="try-it-console" id="epd-try">
  <h4>Try it — POST /api/erp/invoices/early-payment/details</h4>
  <div class="field-group">
    <div>
      <label for="epd-tokens">Invoice Tokens (comma-separated)</label>
      <input type="text" id="epd-tokens" placeholder="bbb-222-..., ccc-333-..." />
    </div>
    <div>
      <label for="epd-bank">Bank Account Token (optional)</label>
      <input type="text" id="epd-bank" placeholder="aa11-..." />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="epd-send">Send Request</button>
  </div>
  <div id="epd-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="epd-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('epd-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('epd-response');
    const responseText = document.getElementById('epd-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    const tokens = document.getElementById('epd-tokens').value.split(',').map(t => t.trim()).filter(Boolean);
    const bank = document.getElementById('epd-bank').value.trim();
    const body = { invoiceTokens: tokens };
    if (bank) body.bankAccountToken = bank;

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/early-payment/details', {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  });
}
</script>
