/*
 * Demonstration data.
 *
 * This is a real snapshot produced by the published argus-header 0.8.0
 * package against https://example.com on 20 Oct 2026. example.com is the
 * IANA-reserved documentation domain, not a customer or a live production
 * target. The website labels it as a snapshot; nothing here is a live scan.
 */

export const SAMPLE_SCAN = {
  target: 'https://example.com',
  finalUrl: 'https://example.com/',
  capturedAt: '20 Oct 2026',
  toolVersion: '0.8.0',
  status: 200,
  method: 'GET',
  headersFound: 12,
  durationSeconds: 0.2692,
  score: {
    value: 71,
    grade: 'C',
    risk: 'HIGH',
    penalty: 29,
    counts: { critical: 0, high: 2, medium: 2, low: 7 },
    categories: [
      { name: 'Content', score: 16, max: 25 },
      { name: 'Transport', score: 13, max: 20 },
      { name: 'Browser', score: 15, max: 25 },
      { name: 'Isolation', score: 12, max: 15 },
      { name: 'Cookies', score: 15, max: 15 },
    ],
  },
  findings: [
    {
      id: 'ARGUS-CSP-001',
      category: 'CSP',
      severity: 'HIGH',
      title: 'Missing Content Security Policy',
      evidence: 'Content-Security-Policy header absent',
      impact:
        'Weakens protection against Cross-Site Scripting (XSS), data injection and clickjacking.',
      recommendation:
        'Define a Content-Security-Policy with a strict default-src and script-src.',
    },
    {
      id: 'ARGUS-HSTS-001',
      category: 'HSTS',
      severity: 'HIGH',
      title: 'Missing Strict-Transport-Security header',
      evidence: 'Strict-Transport-Security header absent',
      impact:
        'Browsers will not enforce HTTPS-only connections, leaving the site open to protocol-downgrade attacks.',
      recommendation: 'Add Strict-Transport-Security with an adequate max-age.',
    },
    {
      id: 'ARGUS-CACHE-001',
      category: 'Cache',
      severity: 'LOW',
      title: 'Missing Cache-Control header',
      evidence: 'Cache-Control header absent',
      impact:
        'Without explicit caching policy, shared and private caches may apply heuristics that leak/age the response.',
      recommendation: 'Define an appropriate Cache-Control policy for the content.',
    },
    {
      id: 'ARGUS-COOP-001',
      category: 'Cross-Origin',
      severity: 'LOW',
      title: 'Missing Cross-Origin-Opener-Policy',
      evidence: 'cross-origin-opener-policy header absent',
      impact:
        'Without a policy, pages may be opened in the same browsing context group as cross-origin documents.',
      recommendation: 'Set Cross-Origin-Opener-Policy: same-origin.',
    },
    {
      id: 'ARGUS-COEP-001',
      category: 'Cross-Origin',
      severity: 'LOW',
      title: 'Missing Cross-Origin-Embedder-Policy',
      evidence: 'cross-origin-embedder-policy header absent',
      impact:
        'Without a policy, cross-origin subresources (incl. certain features such as SharedArrayBuffer) are not gated.',
      recommendation:
        'Set Cross-Origin-Embedder-Policy: require-corp when needed.',
    },
    {
      id: 'ARGUS-CORP-001',
      category: 'Cross-Origin',
      severity: 'LOW',
      title: 'Missing Cross-Origin-Resource-Policy',
      evidence: 'cross-origin-resource-policy header absent',
      impact: 'Resources may be loadable by cross-origin sites.',
      recommendation:
        'Set a Cross-Origin-Resource-Policy (same-origin/same-site/cross-origin).',
    },
    {
      id: 'ARGUS-REFERRER-001',
      category: 'Referrer',
      severity: 'LOW',
      title: 'Missing Referrer-Policy',
      evidence: 'referrer-policy header absent',
      impact:
        'Browsers apply a restrictive default, but an explicit policy is recommended to prevent leakage of the full URL.',
      recommendation:
        'Set Referrer-Policy (e.g. strict-origin-when-cross-origin).',
    },
    {
      id: 'ARGUS-PERMISSIONS-001',
      category: 'Permissions',
      severity: 'LOW',
      title: 'Missing Permissions-Policy',
      evidence: 'permissions-policy header absent',
      impact:
        'Powerful browser features (camera, geolocation, etc.) may be available to embedded content by default.',
      recommendation:
        'Define a Permissions-Policy to restrict sensitive features.',
    },
    {
      id: 'ARGUS-XFO-001',
      category: 'Browser',
      severity: 'MEDIUM',
      title: 'Missing X-Frame-Options',
      evidence: 'x-frame-options header absent',
      impact:
        'The page may be embeddable in third-party frames, enabling clickjacking.',
      recommendation:
        'Set X-Frame-Options: DENY/SAMEORIGIN or frame-ancestors in CSP.',
    },
    {
      id: 'ARGUS-XCTO-001',
      category: 'Browser',
      severity: 'MEDIUM',
      title: 'Missing X-Content-Type-Options',
      evidence: 'x-content-type-options header absent',
      impact:
        'Browsers may MIME-sniff the response body, enabling content type confusion and XSS.',
      recommendation: 'Set X-Content-Type-Options: nosniff.',
    },
    {
      id: 'ARGUS-SERVER-001',
      category: 'Isolation',
      severity: 'LOW',
      title: 'Server header exposes technology',
      evidence: 'Server: cloudflare',
      impact:
        'The Server header reveals the server/version, which helps attackers verify exposed vulnerabilities.',
      recommendation: 'Suppress or obfuscate the Server header.',
    },
  ],
}

export const SEVERITY_DEFINITIONS = [
  {
    level: 'CRITICAL',
    tone: 'critical',
    definition:
      'Highest severity in the scoring and gate model. No built-in v0.8.0 analyzer currently emits CRITICAL; it remains available to config/policy inputs and the scoring engine.',
  },
  {
    level: 'HIGH',
    tone: 'high',
    definition:
      'A significant missing or weak control, such as an absent CSP or HSTS policy, or a strong cookie/CORS misconfiguration.',
  },
  {
    level: 'MEDIUM',
    tone: 'medium',
    definition:
      'A meaningful hardening gap or risky value, such as missing X-Content-Type-Options or a wildcard CORS origin without credentials.',
  },
  {
    level: 'LOW',
    tone: 'low',
    definition:
      'Informational or defense-in-depth finding, such as a disclosed Server header or missing Cross-Origin-Resource-Policy.',
  },
]
