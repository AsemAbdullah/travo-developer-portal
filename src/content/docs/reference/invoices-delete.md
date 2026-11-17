---
title: Delete Invoice
description: Soft-delete an invoice. Nothing is erased — the row is stamped deleted and disappears from every query.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/delete</span>
</div>

Soft-deletes one invoice. The row is stamped deleted and disappears from every query — exactly like deleting from the portal.

## Request

```json
{ "token": "6f1c…" }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | GUID | **Yes** | The invoice token from `invoices/bulk` |

## Response

```json
{
  "data": {
    "token": "6f1c…",
    "number": "INV/2026/00042",
    "status": "Deleted",
    "mode": "invoice",
    "cancelledOrders": 0
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Response Fields

| Field | Description |
|---|---|
| `status` | Always `"Deleted"` on success |
| `mode` | `"invoice"` — normal case, no payment request on it |
| | `"invoice-and-orders"` — the invoice had a live order; the order was cancelled with it |
| `cancelledOrders` | Count of orders cancelled (0 for `mode: "invoice"`) |

> **Note:** **`invoice-and-orders`** means the invoice had been sent back to the supplier by the buyer or bank. It still owned a live order, so deleting it also cancels that order and stands its workflow tasks down. This is the same path the portal UI uses.

## When Delete Is Refused

See [Invoices Overview](/reference/invoices/#when-update-and-delete-are-refused).

**Exception:** A sent-back invoice with a live order **can** be deleted (unlike update). The delete cancels the order. If you need to change the invoice, delete it and re-push with `invoices/bulk`.

## Try It

<div class="try-it-console" id="del-try">
  <h4>Try it — POST /api/erp/invoices/delete</h4>
  <div class="field-group">
    <div>
      <label for="del-token">Invoice Token</label>
      <input type="text" id="del-token" placeholder="6f1c2a3b-..." />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="del-send">Send Request</button>
  </div>
  <div id="del-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="del-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('del-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('del-response');
    const responseText = document.getElementById('del-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/delete', {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: document.getElementById('del-token').value }),
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  });
}
</script>
