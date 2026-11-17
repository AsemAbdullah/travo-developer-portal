---
title: Update Invoice
description: Patch an existing invoice — only the fields you send change.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/update</span>
</div>

Patches an invoice your API key's company owns. **Only the fields present in the body change** — anything you omit is left as-is.

## Request

```json
{
  "token": "6f1c…",
  "number": "INV/2026/00042",
  "currency": "JOD",
  "amount": 1250.500,
  "issueDate": "2026-08-01T00:00:00",
  "dueDate": "2026-10-01T00:00:00",
  "description": "Revised after credit note",
  "attachments": [
    { "fileName": "invoice.pdf", "contentType": "application/pdf", "base64Content": "JVBERi0…" }
  ],
  "replaceAttachments": false
}
```

## Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | GUID | **Yes** | The token from `invoices/bulk` response |
| `number` | string | No | New invoice number |
| `currency` | string | No | New currency code |
| `amount` | decimal | No | New amount (must be > 0) |
| `issueDate` | datetime | No | New issue date |
| `dueDate` | datetime | No | New due date (must be ≥ `issueDate`) |
| `description` | string | No | New description |
| `attachments` | array | No | Files to add (or replace, if `replaceAttachments: true`) |
| `replaceAttachments` | boolean | No | Default `false` = attachments are **added**. `true` = archive existing, keep only these. |

## Response

```json
{
  "data": {
    "token": "6f1c…",
    "number": "INV/2026/00042",
    "currency": "JOD",
    "amount": 1250.500,
    "issueDate": "2026-08-01T00:00:00",
    "dueDate": "2026-10-01T00:00:00",
    "description": "Revised after credit note",
    "status": "Draft",
    "stage": "NoFinancingRequest",
    "stageDescription": "Invoice registered. No payment request has been raised on it yet.",
    "attachmentCount": 2,
    "updatedFields": ["Amount", "DueDate"]
  },
  "status": { "success": true, "errorCode": 0 }
}
```

`updatedFields` reports the fields whose value actually differed — sending a field with its current value is accepted but won't appear there.

## Validation Errors (400)

| Condition | Message |
|---|---|
| `token` missing | `Invoice token is required.` |
| number blank | `Invoice number cannot be empty.` |
| number already used by another invoice | `Invoice {number} already exists.` |
| `amount` ≤ 0 | `Amount must be greater than zero.` |
| `dueDate` < `issueDate` | `dueDate cannot be earlier than issueDate.` |
| empty `base64Content` | `Attachment content is required.` |
| invalid base64 | `Attachment '{fileName}' is not valid base64.` |
| `replaceAttachments: true` with no attachments | `replaceAttachments needs at least one attachment...` |
| no field and no attachment | `Nothing to update.` |

## 404 — Not Found

> `Invoice '{token}' was not found.`
> `This invoice does not belong to the company linked to this API key.`

## When Updates Are Refused

See [Invoices Overview — When Update and Delete Are Refused](/reference/invoices/#when-update-and-delete-are-refused).

> **Tip:** The duplicate-number check normalizes exactly like `invoices/bulk`: leading zeros, case, and surrounding whitespace are ignored. Re-sending the invoice its own number is never a conflict.

## Try It

<div class="try-it-console" id="update-try">
  <h4>Try it — POST /api/erp/invoices/update</h4>
  <div class="field-group">
    <div>
      <label for="upd-token">Invoice Token (required)</label>
      <input type="text" id="upd-token" placeholder="6f1c2a3b-..." />
    </div>
    <div>
      <label for="upd-amount">New Amount</label>
      <input type="number" id="upd-amount" placeholder="1250.50" step="0.01" />
    </div>
    <div>
      <label for="upd-description">New Description</label>
      <input type="text" id="upd-description" placeholder="Revised after credit note" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="upd-send">Build & Send</button>
  </div>
  <div id="upd-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="upd-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('upd-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('upd-response');
    const responseText = document.getElementById('upd-response-text');

    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    const body = { token: document.getElementById('upd-token').value };
    const amount = parseFloat(document.getElementById('upd-amount').value);
    if (!isNaN(amount)) body.amount = amount;
    const desc = document.getElementById('upd-description').value;
    if (desc) body.description = desc;

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/update', {
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
