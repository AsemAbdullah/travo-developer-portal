---
title: Invoice Status
description: Track where an invoice sits — from creation through financing to disbursement.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/status</span>
</div>

Returns the current status and stage of an invoice. `POST` rather than `GET` because invoice numbers routinely contain slashes (e.g., `INV/2026/00042`).

## Request

```json
{ "number": "INV-9981", "nationalId": null }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `number` | string | **Yes** | The invoice number |
| `nationalId` | string | No | Optional scope narrower |

## Response

```json
{
  "data": {
    "number": "INV-9981",
    "currency": "JOD",
    "amount": 12500.500,
    "invoiceStatus": "Pending",
    "stage": "AwaitingBank",
    "stageDescription": "Buyer approved. The request has reached the bank and is awaiting the bank's decision.",
    "nextActionBy": "Bank",
    "orderRefId": "ORD-000445",
    "orderStatus": "Pending Bank Approval",
    "paymentStatus": "UnPaid",
    "totalAmount": 12180.220,
    "totalFees": 320.280
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Stage Reference

| `stage` | Meaning |
|---|---|
| `NoFinancingRequest` | Invoice registered. No payment request raised yet. |
| `AwaitingBuyer` | Payment request raised, waiting for the buyer to approve. |
| `AwaitingBank` | Buyer approved; waiting for the bank's decision. |
| `BankApproved` | Bank approved; disbursement is being executed. |
| `Disbursed` | Funds paid out. |
| `Rejected` | Request rejected. |

> **Caution:** **Build on `stage`**, never on `orderStatus` or `nextActionBy`. Those are free-text display hints that change with workflow configuration. `stage` is a fixed, machine-readable enum.

## Response Fields

| Field | Type | Description |
|---|---|---|
| `number` | string | Invoice number |
| `currency` | string | Currency code |
| `amount` | decimal | Invoice amount |
| `invoiceStatus` | string | Invoice-level status |
| `stage` | string | Machine-readable lifecycle stage |
| `stageDescription` | string | Human-readable description of the stage |
| `nextActionBy` | string? | Who needs to act next (display hint) |
| `orderRefId` | string? | Order reference ID |
| `orderStatus` | string | Free-text order status (display hint) |
| `paymentStatus` | string | `UnPaid`, `InProgress`, `Paid` |
| `totalAmount` | decimal? | Net amount after fees |
| `totalFees` | decimal? | Total fees deducted |

## Try It

<div class="try-it-console" id="status-try">
  <h4>Try it — POST /api/erp/invoices/status</h4>
  <div class="field-group">
    <div>
      <label for="status-number">Invoice Number</label>
      <input type="text" id="status-number" placeholder="INV-9981" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="status-send">Send Request</button>
  </div>
  <div id="status-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="status-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('status-send').addEventListener('click', async () => {
    const responseDiv = document.getElementById('status-response');
    const responseText = document.getElementById('status-response-text');
    let baseUrl, apiKey;
    try { baseUrl = localStorage.getItem('travo_base_url'); apiKey = localStorage.getItem('travo_api_key'); } catch {}
    if (!baseUrl || !apiKey) { responseDiv.style.display = 'block'; responseText.className = 'response-panel error'; responseText.textContent = 'Configure first.'; return; }

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(baseUrl + '/api/erp/invoices/status', {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: document.getElementById('status-number').value }),
      });
      const json = await res.json();
      responseText.className = 'response-panel ' + (json.status?.success ? 'success' : 'error');
      responseText.textContent = JSON.stringify(json, null, 2);
    } catch (e) { responseText.className = 'response-panel error'; responseText.textContent = 'Failed: ' + e.message; }
  });
}
</script>
