---
title: Create Invoices (Bulk)
description: Push one or more invoices from your ERP into CreditPlus. Each invoice is validated independently.
---

<div class="endpoint-badge">
  <span class="method post">POST</span>
  <span>/api/erp/invoices/bulk</span>
</div>

Pushes invoices from your ERP. One call carries **N invoices**, each validated independently.

## Request

```json
{
  "invoices": [
    {
      "number": "INV-001",
      "nationalId": "2001234567",
      "companyName": "Beta Retail LLC",
      "companyEmail": "ap@beta.example",
      "companyPhoneNumber": "0790000000",
      "currency": "JOD",
      "amount": 1000.000,
      "issueDate": "2026-07-01T00:00:00",
      "dueDate": "2026-09-01T00:00:00",
      "description": "July supply",
      "programToken": null,
      "attachments": [
        {
          "fileName": "invoice-001.pdf",
          "contentType": "application/pdf",
          "base64Content": "JVBERi0xLjQK..."
        }
      ]
    }
  ]
}
```

## Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `number` | string | Yes | Your invoice number. **Idempotency key** — unique per company. |
| `nationalId` | string | No | Identifies the **supplier** (SCF) or the **buyer** (Collection). Used to auto-create the company if unknown. |
| `companyName` | string | No | Display name for the company identified by `nationalId`. |
| `companyEmail` | string | No | Contact email for auto-created companies. |
| `companyPhoneNumber` | string | No | Contact phone for auto-created companies. |
| `currency` | string | Yes | ISO currency code (e.g., `JOD`, `USD`, `EGP`). |
| `amount` | decimal | Yes | Invoice total. Must be > 0. |
| `issueDate` | datetime | Yes | When the invoice was issued. |
| `dueDate` | datetime | Yes | Payment due date. Must be ≥ `issueDate`. |
| `description` | string | No | Free-text description. |
| `programToken` | GUID | No | Target program. When omitted, falls back to the integration's legacy single program. |
| `attachments` | array | Yes | At least one. Each has `fileName`, `contentType`, `base64Content`. |

> **Warning:** **`nationalId` meaning depends on your program type!** For SCF keys it identifies the **supplier**. For Collection keys it identifies the **buyer** you are billing. This is the most common integration mistake.

## Response

```json
{
  "data": {
    "created": 1,
    "failed": 0,
    "programType": "Collection",
    "nextAction": "request-to-pay",
    "results": [
      {
        "number": "INV-001",
        "status": "Created",
        "token": "bbb-222-...",
        "nextAction": "request-to-pay",
        "reason": null
      }
    ]
  },
  "status": { "success": true, "errorCode": 0 }
}
```

## Response Fields

| Field | Type | Description |
|---|---|---|
| `created` | int | Number of successfully created invoices |
| `failed` | int | Number of failed invoices |
| `programType` | string | `Collection`, `SCFProgram`, or `none` |
| `nextAction` | string | Batch-level hint: `request-to-pay`, `early-payment`, or `none` |
| `results[].number` | string | The invoice number you sent |
| `results[].status` | string | `Created`, `Duplicate`, or `Failed` |
| `results[].token` | GUID? | CreditPlus's invoice identifier. `null` on failure. |
| `results[].nextAction` | string? | Per-invoice hint. Omitted on failure. |
| `results[].reason` | string? | Why it failed. `null` on success. |

> **Tip:** **Store `token` and `nextAction` together on your invoice row.** Your worker then reads the row and calls the endpoint named in `nextAction` — no hard-coded program types.

## Rules

1. **Not atomic** — a failing row is reported in place, never drops the rest.
2. **`number` is your idempotency key** — re-sending the same number returns `Duplicate`.
3. **Attachments required** — at least one per invoice. Invalid base64 fails the row.
4. **Auto-membership** — if the supplier/buyer is not yet a member of the program, membership is created automatically.

## cURL Example

```bash
curl -X POST "https://<host>/api/erp/invoices/bulk" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "invoices": [{
      "number": "INV-001",
      "nationalId": "2001234567",
      "companyName": "Beta Retail LLC",
      "currency": "JOD",
      "amount": 1000.00,
      "issueDate": "2026-07-01T00:00:00",
      "dueDate": "2026-09-01T00:00:00",
      "attachments": [{
        "fileName": "inv.pdf",
        "contentType": "application/pdf",
        "base64Content": "JVBERi0xLjQK..."
      }]
    }]
  }'
```

## Try It

<div class="try-it-console" id="bulk-try">
  <h4>Try it — POST /api/erp/invoices/bulk</h4>
  <div class="field-group">
    <div>
      <label for="bulk-number">Invoice Number</label>
      <input type="text" id="bulk-number" placeholder="INV-001" />
    </div>
    <div>
      <label for="bulk-national-id">National ID</label>
      <input type="text" id="bulk-national-id" placeholder="2001234567" />
    </div>
    <div>
      <label for="bulk-company-name">Company Name</label>
      <input type="text" id="bulk-company-name" placeholder="Beta Retail LLC" />
    </div>
    <div style="display:flex;gap:0.5rem;">
      <div style="flex:1;">
        <label for="bulk-currency">Currency</label>
        <input type="text" id="bulk-currency" value="JOD" />
      </div>
      <div style="flex:1;">
        <label for="bulk-amount">Amount</label>
        <input type="number" id="bulk-amount" placeholder="1000.00" step="0.01" />
      </div>
    </div>
    <div style="display:flex;gap:0.5rem;">
      <div style="flex:1;">
        <label for="bulk-issue-date">Issue Date</label>
        <input type="date" id="bulk-issue-date" />
      </div>
      <div style="flex:1;">
        <label for="bulk-due-date">Due Date</label>
        <input type="date" id="bulk-due-date" />
      </div>
    </div>
    <div>
      <label for="bulk-description">Description</label>
      <input type="text" id="bulk-description" placeholder="July supply" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="bulk-send">Build & Send</button>
    <button class="btn-secondary" id="bulk-fill">Fill Sample Values</button>
  </div>
  <div id="bulk-wire" style="display:none; margin-top: 0.75rem;">
    <label>Wire Body</label>
    <div class="response-panel" id="bulk-wire-text"></div>
  </div>
  <div id="bulk-curl" style="display:none; margin-top: 0.75rem;">
    <label>cURL</label>
    <div class="response-panel" id="bulk-curl-text"></div>
  </div>
  <div id="bulk-response" style="display:none; margin-top: 0.75rem;">
    <label>Response</label>
    <div class="response-panel" id="bulk-response-text"></div>
  </div>
</div>

<script>
{
  document.getElementById('bulk-fill').addEventListener('click', () => {
    document.getElementById('bulk-number').value = 'INV-TEST-' + Date.now();
    document.getElementById('bulk-national-id').value = '2001234567';
    document.getElementById('bulk-company-name').value = 'Beta Retail LLC';
    document.getElementById('bulk-currency').value = 'JOD';
    document.getElementById('bulk-amount').value = '1000.00';
    const today = new Date();
    const due = new Date(today);
    due.setMonth(due.getMonth() + 2);
    document.getElementById('bulk-issue-date').value = today.toISOString().split('T')[0];
    document.getElementById('bulk-due-date').value = due.toISOString().split('T')[0];
    document.getElementById('bulk-description').value = 'Test invoice from developer portal';
  });

  document.getElementById('bulk-send').addEventListener('click', async () => {
    const wireDiv = document.getElementById('bulk-wire');
    const wireText = document.getElementById('bulk-wire-text');
    const curlDiv = document.getElementById('bulk-curl');
    const curlText = document.getElementById('bulk-curl-text');
    const responseDiv = document.getElementById('bulk-response');
    const responseText = document.getElementById('bulk-response-text');

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

    const issueDate = document.getElementById('bulk-issue-date').value;
    const dueDate = document.getElementById('bulk-due-date').value;

    const body = {
      invoices: [{
        number: document.getElementById('bulk-number').value,
        nationalId: document.getElementById('bulk-national-id').value || null,
        companyName: document.getElementById('bulk-company-name').value || null,
        currency: document.getElementById('bulk-currency').value,
        amount: parseFloat(document.getElementById('bulk-amount').value) || 0,
        issueDate: issueDate ? issueDate + 'T00:00:00' : null,
        dueDate: dueDate ? dueDate + 'T00:00:00' : null,
        description: document.getElementById('bulk-description').value || null,
        attachments: [{
          fileName: 'sample.pdf',
          contentType: 'application/pdf',
          base64Content: 'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKdHJhaWxlcgo8PAovUm9vdCAxIDAgUgo+Pg=='
        }]
      }]
    };

    const url = baseUrl + '/api/erp/invoices/bulk';

    wireDiv.style.display = 'block';
    wireText.textContent = JSON.stringify(body, null, 2);

    curlDiv.style.display = 'block';
    curlText.textContent = `curl -X POST "${url}" \\\n  -H "X-API-Key: ••••••••" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(body)}'`;

    responseDiv.style.display = 'block';
    responseText.className = 'response-panel';
    responseText.textContent = 'Sending...';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
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
