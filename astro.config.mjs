import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'CreditPlus ERP API',
      description: 'Developer portal for integrating your ERP system with CreditPlus — supply-chain financing & collections.',
      logo: {
        light: './src/assets/logo-light.png',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.png',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'Core Concepts', slug: 'getting-started/core-concepts' },
            { label: 'Configure the Portal', slug: 'getting-started/configure' },
            { label: 'Your First Call', slug: 'getting-started/first-call' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Introduction', slug: 'reference' },
            {
              label: 'Authentication',
              items: [
                { label: 'API Key', slug: 'reference/authentication' },
                { label: 'GET /me', slug: 'reference/me' },
                { label: 'Inbound Key', slug: 'reference/inbound-key' },
              ],
            },
            {
              label: 'Invoices',
              items: [
                { label: 'Overview', slug: 'reference/invoices' },
                { label: 'Create (Bulk)', slug: 'reference/invoices-bulk' },
                { label: 'Update', slug: 'reference/invoices-update' },
                { label: 'Delete', slug: 'reference/invoices-delete' },
                { label: 'Status', slug: 'reference/invoices-status' },
              ],
            },
            {
              label: 'Early Payment (SCF)',
              items: [
                { label: 'Overview', slug: 'reference/early-payment' },
                { label: 'Get Quote', slug: 'reference/early-payment-details' },
                { label: 'Submit Request', slug: 'reference/early-payment-request' },
              ],
            },
            {
              label: 'Request to Pay (Collection)',
              items: [
                { label: 'Overview', slug: 'reference/request-to-pay' },
                { label: 'Submit Request', slug: 'reference/request-to-pay-submit' },
              ],
            },
            {
              label: 'Bank Accounts & Lookups',
              items: [
                { label: 'Bank Accounts', slug: 'reference/bank-accounts' },
                { label: 'Create Bank Account', slug: 'reference/bank-accounts-create' },
                { label: 'Lookups', slug: 'reference/lookups' },
              ],
            },
          ],
        },
        {
          label: 'API Playground',
          slug: 'playground',
        },
      ],
    }),
  ],
});
