---
title: Submit Early Payment Request
description: Submit the financing request — the bank funds the invoice early.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/early-payment</span>
</div>

Submits a financing request for one or more invoices. The bank reviews and funds the invoices; the supplier receives the net amount.

## Request

```json
{
  "invoiceTokens": ["bbb-222-...", "ccc-333-..."],
  "bankAccountToken": "aa11-...",
  "paymentDate": null,
  "partialPaymentPercentage": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceTokens` | GUID[] | **Yes** | Tokens from `invoices/bulk` |
| `bankAccountToken` | GUID | **Yes** | The supplier's bank account to receive funds |
| `paymentDate` | datetime | No | Requested payment date. Defaults to current date. |
| `partialPaymentPercentage` | decimal | No | Percentage of the invoice to finance (partial payment). `null` = 100%. |

## Response

```json
{
  "data": {
    "orderToken": "77aa-...",
    "message": "Early payment request submitted successfully."
  },
  "status": { "success": true, "errorCode": 0 }
}
```

| Field | Type | Description |
|---|---|---|
| `orderToken` | GUID? | The financing order token |
| `message` | string | Human-readable result |

> **Tip:** **Keep `orderToken` per invoice.** One order is minted per invoice. Track it with `invoices/status` using the `stage` field.

## After Submission

The invoice enters the approval workflow:

1. **`AwaitingBuyer`** — the buyer must approve (through the CreditPlus portal or MP API).
2. **`AwaitingBank`** — the bank reviews the request.
3. **`BankApproved`** → **`Disbursed`** — funds are paid out.

Poll `POST /api/erp/invoices/status` and drive your ERP logic off `stage`.

> **Caution:** Collection keys cannot call this endpoint. It returns `400`: *"This API key is linked to a Collection program. Use POST /api/erp/invoices/request-to-pay instead."*

## Try It

<div class="try-it-console" id="ep-try">
  <h4>Try it — POST /api/erp/invoices/early-payment</h4>
  <div class="field-group">
    <div>
      <label for="ep-tokens">Invoice Tokens (comma-separated)</label>
      <input type="text" id="ep-tokens" placeholder="bbb-222-..., ccc-333-..." />
    </div>
    <div>
      <label for="ep-bank">Bank Account Token</label>
      <input type="text" id="ep-bank" placeholder="aa11-..." />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="ep-send">Send Request</button>
  </div>
  <div id="ep-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="ep-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('ep-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('ep-response');
    const responseText = document.getElementById('ep-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    const tokens = document.getElementById('ep-tokens').value.split(',').map(t => t.trim()).filter(Boolean);
    const body = { invoiceTokens: tokens, bankAccountToken: document.getElementById('ep-bank').value.trim() };

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/early-payment', {
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
