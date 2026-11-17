---
title: Submit Request to Pay
description: Raise a bill on the buyer — Collection programs only.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/request-to-pay</span>
</div>

Raises the bill on the buyer. No workflow, no bank approval, no fee calculation.

## Request

```json
{
  "invoiceTokens": ["bbb-222-...", "ccc-333-..."],
  "paymentDate": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceTokens` | GUID[] | **Yes** | Tokens from `invoices/bulk`. Empty values ignored; duplicates collapsed. |
| `paymentDate` | datetime | No | Defaults to current date when `null` or omitted. |

There is **no buyer field and no bank account field** — both are resolved server-side from the invoice data.

## Response

```json
{
  "data": {
    "requested": 1,
    "failed": 1,
    "invoices": [
      { "token": "bbb-222-...", "number": "INV-001", "status": "Requested", "reason": null },
      { "token": "ccc-333-...", "number": "INV-002", "status": "Failed",
        "reason": "Invoice does not belong to the program linked to this API key." }
    ]
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Response Fields

| Field | Type | Description |
|---|---|---|
| `requested` | int | Successfully billed count |
| `failed` | int | Failed count |
| `invoices[].token` | GUID | Invoice token |
| `invoices[].number` | string | Invoice number |
| `invoices[].status` | string | `Requested` or `Failed` |
| `invoices[].reason` | string? | Why it failed; `null` on success |

## Per-Invoice Failure Reasons

| Reason | Cause |
|---|---|
| `Invoice not found.` | Unknown or deleted token |
| `Invoice does not belong to your company.` | Token belongs to another company |
| `Invoice does not belong to the program linked to this API key.` | Right company, wrong program |
| `Invoice has no buyer to bill.` | Pushed before Collection support, or without a program |
| *(business message)* | Program expired/frozen, invoice already paid, or request already in progress |

## Idempotency

This call **is** idempotent — a second call on an invoice already being processed (or already paid) is refused with a reason. It does not raise a second bill. The invoice's status is claimed atomically on the first successful call.

> **Tip:** Only retry rows that returned `Failed`, and only after reading the `reason`.

## Try It

<div class="try-it-console" id="rtp-try">
  <h4>Try it — POST /api/erp/invoices/request-to-pay</h4>
  <div class="field-group">
    <div>
      <label for="rtp-tokens">Invoice Tokens (comma-separated)</label>
      <input type="text" id="rtp-tokens" placeholder="bbb-222-..., ccc-333-..." />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="rtp-send">Send Request</button>
  </div>
  <div id="rtp-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="rtp-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('rtp-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('rtp-response');
    const responseText = document.getElementById('rtp-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    const tokens = document.getElementById('rtp-tokens').value.split(',').map(t => t.trim()).filter(Boolean);
    const body = { invoiceTokens: tokens };

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/request-to-pay', {
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
