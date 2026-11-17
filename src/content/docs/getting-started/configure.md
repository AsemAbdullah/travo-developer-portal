---
title: Configure the Portal
description: Set up your connection details so the portal's interactive "Try it" consoles can make live API calls.
---

The portal's "Try it" consoles let you build requests and fire them at your CreditPlus environment directly from the browser. Before you can use them, tell the portal where to send requests and how to authenticate.

## Connection Settings

Enter these in the configuration panel below:

| Setting | Where to get it | Stored in |
|---|---|---|
| **Base URL** | CreditPlus gives you a per-environment URL, e.g. `https://api.travo.example.com` | `localStorage` (persists across tabs) |
| **API Key** | Issued by CreditPlus per company, per program | `localStorage` |

> **Tip:** Your API key is stored **only in your browser** — it is never sent to CreditPlus's documentation servers. The "Try it" consoles call your CreditPlus API directly from the browser.

## Configure

<div class="try-it-console" id="config-console">
  <h4>Connection & Keys</h4>
  <div class="field-group">
    <div>
      <label for="cfg-base-url">Base URL</label>
      <input type="url" id="cfg-base-url" placeholder="https://api.travo.example.com" />
    </div>
    <div>
      <label for="cfg-api-key">API Key (X-API-Key)</label>
      <input type="password" id="cfg-api-key" placeholder="Your API key" />
    </div>
  </div>
  <div class="btn-row">
    <button class="btn-primary" id="cfg-save">Save Configuration</button>
    <button class="btn-secondary" id="cfg-clear">Clear All</button>
    <button class="btn-secondary" id="cfg-toggle-key">Show Key</button>
  </div>
  <div id="cfg-status" style="margin-top: 0.75rem; font-size: 0.85rem;"></div>
</div>

<script>
{
  const baseUrlInput = document.getElementById('cfg-base-url');
  const apiKeyInput = document.getElementById('cfg-api-key');
  const statusDiv = document.getElementById('cfg-status');

  try {
    baseUrlInput.value = localStorage.getItem('travo_base_url') || '';
    apiKeyInput.value = localStorage.getItem('travo_api_key') || '';
  } catch {}

  document.getElementById('cfg-save').addEventListener('click', () => {
    try {
      localStorage.setItem('travo_base_url', baseUrlInput.value.replace(/\/+$/, ''));
      localStorage.setItem('travo_api_key', apiKeyInput.value);
      statusDiv.innerHTML = '<span class="status-badge success">Saved</span> Configuration stored in your browser.';
    } catch (e) {
      statusDiv.innerHTML = '<span class="status-badge error">Error</span> Could not save: ' + e.message;
    }
  });

  document.getElementById('cfg-clear').addEventListener('click', () => {
    try {
      localStorage.removeItem('travo_base_url');
      localStorage.removeItem('travo_api_key');
      baseUrlInput.value = '';
      apiKeyInput.value = '';
      statusDiv.innerHTML = '<span class="status-badge pending">Cleared</span> All configuration removed.';
    } catch {}
  });

  document.getElementById('cfg-toggle-key').addEventListener('click', function () {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    this.textContent = isPassword ? 'Hide Key' : 'Show Key';
  });
}
</script>

## What Gets Stored Where

| Data | Storage | Scope | Lifetime |
|---|---|---|---|
| Base URL | `localStorage` | Shared across tabs | Until you clear it |
| API Key | `localStorage` | Shared across tabs | Until you clear it |

> **Note:** If you open this portal in a private/incognito window, `localStorage` may not persist — the configuration will be lost when you close the window.

## Verify Your Setup

After saving, go to [Your First Call](/getting-started/first-call/) and hit the `GET /api/erp/me` endpoint. If it returns your integration profile, you're connected.
