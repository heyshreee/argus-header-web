/*
 * The rule catalogue below is transcribed from the v0.8.0 source:
 * src/argus_header/analyzers/*.py and src/argus_header/engine/rules.py.
 *
 * Severity values are the ones each analyzer actually assigns. Where the
 * implementation has a conditional severity, the condition is stated.
 */

export const SCORING = {
  budgets: [
    { name: 'Content', max: 25 },
    { name: 'Transport', max: 20 },
    { name: 'Browser', max: 25 },
    { name: 'Isolation', max: 15 },
    { name: 'Cookies', max: 15 },
  ],
  deductions: [
    { severity: 'CRITICAL', points: 9 },
    { severity: 'HIGH', points: 7 },
    { severity: 'MEDIUM', points: 4 },
    { severity: 'LOW', points: 1 },
  ],
  grades: [
    { grade: 'A+', threshold: '98–100' },
    { grade: 'A', threshold: '90–97' },
    { grade: 'B', threshold: '80–89' },
    { grade: 'C', threshold: '70–79' },
    { grade: 'D', threshold: '60–69' },
    { grade: 'F', threshold: '0–59' },
  ],
}

export const CHECK_FAMILIES = [
  {
    id: 'csp',
    index: '01',
    name: 'Content-Security-Policy',
    header: 'Content-Security-Policy',
    summary:
      'Checks for an enforcing CSP, parses its directives, and flags missing fallbacks and dangerous source expressions in script, default, object and frame directives.',
    rules: [
      {
        id: 'ARGUS-CSP-001',
        severity: 'HIGH',
        trigger: 'The Content-Security-Policy header is absent.',
      },
      {
        id: 'ARGUS-CSP-002',
        severity: 'MEDIUM',
        trigger: 'The header exists but parses to no directives (empty or invalid policy).',
      },
      {
        id: 'ARGUS-CSP-101',
        severity: 'MEDIUM',
        trigger: 'The policy has no default-src directive.',
      },
      {
        id: 'ARGUS-CSP-003',
        severity: 'MEDIUM',
        trigger: 'script-src contains a bare * source.',
      },
      {
        id: 'ARGUS-CSP-004',
        severity: 'MEDIUM',
        trigger: "script-src contains 'unsafe-inline'.",
      },
      {
        id: 'ARGUS-CSP-005',
        severity: 'MEDIUM',
        trigger: "script-src contains 'unsafe-eval'.",
      },
      {
        id: 'ARGUS-CSP-006',
        severity: 'MEDIUM',
        trigger: 'script-src contains the cleartext http: scheme.',
      },
      {
        id: 'ARGUS-CSP-102',
        severity: 'MEDIUM',
        trigger: 'default-src contains a bare * source.',
      },
      {
        id: 'ARGUS-CSP-103',
        severity: 'MEDIUM',
        trigger: "default-src contains 'unsafe-inline'.",
      },
      {
        id: 'ARGUS-CSP-104',
        severity: 'MEDIUM',
        trigger:
          "default-src contains 'unsafe-eval'; the same ID is also used for dangerous object-src source combinations.",
      },
      {
        id: 'ARGUS-CSP-201',
        severity: 'MEDIUM',
        trigger:
          'frame-ancestors is missing; the same ID is also emitted for wildcard/unsafe keywords in frame-src.',
      },
      {
        id: 'ARGUS-CSP-204',
        severity: 'MEDIUM',
        trigger: 'frame-src contains the cleartext http: scheme.',
      },
      {
        id: 'ARGUS-CSP-999',
        severity: 'MEDIUM',
        trigger:
          'Fallback ID for a dangerous source expression that has no dedicated rule, such as the cleartext http: scheme in default-src or object-src.',
      },
    ],
    remediation:
      'Start with a restrictive default-src, add explicit script-src and object-src policies, avoid unsafe-inline/unsafe-eval and wildcard sources, and add frame-ancestors.',
    example:
      "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
    limitations:
      'Only the enforcing Content-Security-Policy header is read; Content-Security-Policy-Report-Only does not satisfy the check. This is a header-policy review, not a browser execution test. A CSP that is present can still be bypassable or too permissive for the application.',
  },
  {
    id: 'hsts',
    index: '02',
    name: 'Strict-Transport-Security',
    header: 'Strict-Transport-Security',
    summary:
      'Checks HSTS presence, parses max-age, and verifies includeSubDomains. It does not inspect certificates',
    rules: [
      {
        id: 'ARGUS-HSTS-001',
        severity: 'HIGH',
        trigger: 'The Strict-Transport-Security header is absent.',
      },
      {
        id: 'ARGUS-HSTS-002',
        severity: 'HIGH',
        trigger: 'The header has no parseable max-age directive.',
      },
      {
        id: 'ARGUS-HSTS-003',
        severity: 'MEDIUM',
        trigger: 'max-age is below 15,552,000 seconds (180 days).',
      },
      {
        id: 'ARGUS-HSTS-004',
        severity: 'MEDIUM',
        trigger: 'The header does not contain includeSubDomains.',
      },
    ],
    remediation:
      'Serve HTTPS only, then add HSTS with a max-age of at least 15552000 seconds. Add includeSubDomains once every subdomain is HTTPS-ready. Preload is a separate commitment and is not evaluated by v0.8.0.',
    example: 'Strict-Transport-Security: max-age=63072000; includeSubDomains',
    limitations:
      'HSTS is only meaningful on HTTPS responses. The preload directive is not checked in v0.8.0, and a header on one response does not prove every host or subdomain sends it. Certificate and TLS configuration are out of scope.',
  },
  {
    id: 'xfo',
    index: '03',
    name: 'X-Frame-Options',
    header: 'X-Frame-Options',
    summary:
      'Checks whether the response can be framed by third-party pages. CSP frame-ancestors is the modern replacement.',
    rules: [
      {
        id: 'ARGUS-XFO-001',
        severity: 'MEDIUM',
        trigger:
          'X-Frame-Options is absent and no Content-Security-Policy header is present at all.',
      },
    ],
    remediation:
      'Set X-Frame-Options: DENY or SAMEORIGIN, or use CSP frame-ancestors. Use only one approach deliberately; frame-ancestors supersedes X-Frame-Options in modern browsers.',
    example: 'X-Frame-Options: DENY',
    limitations:
      'In v0.8.0 the check is suppressed by the presence of any CSP header, not specifically by frame-ancestors. Inspect the CSP separately when the two mechanisms are combined.',
  },
  {
    id: 'xcto',
    index: '04',
    name: 'X-Content-Type-Options',
    header: 'X-Content-Type-Options',
    summary:
      'Checks that MIME sniffing is disabled and that the header uses the only recognized value.',
    rules: [
      {
        id: 'ARGUS-XCTO-001',
        severity: 'MEDIUM',
        trigger: 'The X-Content-Type-Options header is absent.',
      },
      {
        id: 'ARGUS-XCTO-002',
        severity: 'MEDIUM',
        trigger: 'The header is present but its value is not nosniff.',
      },
    ],
    remediation:
      'Set X-Content-Type-Options: nosniff on every response and ensure Content-Type values are accurate.',
    example: 'X-Content-Type-Options: nosniff',
    limitations:
      'The check verifies the header value only. It does not validate that every response declares a correct Content-Type.',
  },
  {
    id: 'cors',
    index: '05',
    name: 'CORS',
    header: 'Access-Control-Allow-Origin and related headers',
    summary:
      'Inspects a single response for wildcard and null origins, dangerous methods, and long preflight caches.',
    rules: [
      {
        id: 'ARGUS-CORS-001',
        severity: 'MEDIUM / HIGH',
        trigger:
          'Access-Control-Allow-Origin is *. Severity becomes HIGH when Access-Control-Allow-Credentials is true.',
      },
      {
        id: 'ARGUS-CORS-004',
        severity: 'MEDIUM',
        trigger: 'Access-Control-Allow-Origin is the literal null origin.',
      },
      {
        id: 'ARGUS-CORS-005',
        severity: 'MEDIUM',
        trigger:
          'Access-Control-Allow-Methods includes TRACE or CONNECT.',
      },
      {
        id: 'ARGUS-CORS-006',
        severity: 'LOW',
        trigger: 'Access-Control-Max-Age is numeric and greater than 600 seconds.',
      },
    ],
    remediation:
      'Use an explicit allowlist of trusted origins. Never combine a wildcard origin with credentials. Avoid TRACE/CONNECT in cross-origin method lists and keep preflight caching modest.',
    example:
      'Access-Control-Allow-Origin: https://app.example.com\nVary: Origin',
    limitations:
      'This is a passive, single-response review. v0.8.0 does not send a custom Origin header or perform a reflection probe, so it cannot prove that an explicit origin was reflected from the request. Absence of a CORS finding does not mean the deployment is safe.',
  },
  {
    id: 'cache',
    index: '06',
    name: 'Cache-Control',
    header: 'Cache-Control',
    summary:
      'Checks for a missing caching policy and flags responses that permit caching without explicit safety directives.',
    rules: [
      {
        id: 'ARGUS-CACHE-001',
        severity: 'LOW',
        trigger: 'The Cache-Control header is absent.',
      },
      {
        id: 'ARGUS-CACHE-002',
        severity: 'MEDIUM',
        trigger: 'The header is present but no-store is absent.',
      },
      {
        id: 'ARGUS-CACHE-003',
        severity: 'MEDIUM',
        trigger:
          'public is present without no-store, no-cache or private.',
      },
    ],
    remediation:
      'Choose a policy for the content: use no-store for sensitive responses and an explicit max-age policy for public, cacheable assets. Do not apply one directive set to every route.',
    example: 'Cache-Control: no-store',
    limitations:
      'Cache policy is context-dependent. v0.8.0 cannot know whether a response contains sensitive data, so a missing no-store is a prompt for review rather than proof of a vulnerability. Pragma and Expires are not used to satisfy the check.',
  },
  {
    id: 'cookies',
    index: '07',
    name: 'Cookies',
    header: 'Set-Cookie attributes',
    summary:
      'Parses every Set-Cookie value and reviews Secure, HttpOnly, SameSite and the __Host- prefix rules.',
    rules: [
      {
        id: 'ARGUS-COOKIE-001',
        severity: 'MEDIUM',
        trigger: 'A cookie is missing the Secure attribute.',
      },
      {
        id: 'ARGUS-COOKIE-002',
        severity: 'MEDIUM',
        trigger: 'A cookie is missing the HttpOnly attribute.',
      },
      {
        id: 'ARGUS-COOKIE-003',
        severity: 'MEDIUM',
        trigger:
          'A session-like cookie (session, sessionid, sid, phpsessid, auth, token, jwt, or a name containing "session") is missing SameSite.',
      },
      {
        id: 'ARGUS-COOKIE-004',
        severity: 'LOW',
        trigger: 'A non-session cookie is missing SameSite.',
      },
      {
        id: 'ARGUS-COOKIE-005',
        severity: 'LOW',
        trigger: 'SameSite is present but not Lax or Strict.',
      },
      {
        id: 'ARGUS-COOKIE-006',
        severity: 'HIGH',
        trigger: 'SameSite=None is used without Secure.',
      },
      {
        id: 'ARGUS-COOKIE-007',
        severity: 'HIGH',
        trigger: 'A __Host- prefixed cookie also sets Domain.',
      },
      {
        id: 'ARGUS-COOKIE-008',
        severity: 'HIGH',
        trigger: 'A __Host- prefixed cookie uses a Path other than /.',
      },
    ],
    remediation:
      'Set Secure and HttpOnly where appropriate, use SameSite=Lax or Strict for session cookies, and follow the __Host- prefix rules exactly. Review third-party cookie requirements deliberately.',
    example:
      'Set-Cookie: session=…; Secure; HttpOnly; SameSite=Lax; Path=/',
    limitations:
      'Cookie names are heuristics, not proof of sensitivity. A cookie that is intentionally readable by JavaScript should not be marked HttpOnly. The analyzer sees response headers, not how the application later uses the cookie.',
  },
  {
    id: 'cross-origin',
    index: '08',
    name: 'Cross-origin policies',
    header: 'COOP, COEP and CORP',
    summary:
      'Reviews Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy and Cross-Origin-Resource-Policy values.',
    rules: [
      {
        id: 'ARGUS-COOP-001',
        severity: 'LOW',
        trigger: 'Cross-Origin-Opener-Policy is absent.',
      },
      {
        id: 'ARGUS-COOP-002',
        severity: 'LOW',
        trigger:
          'COOP is present but is neither same-origin nor same-origin-allow-popups.',
      },
      {
        id: 'ARGUS-COEP-001',
        severity: 'LOW',
        trigger: 'Cross-Origin-Embedder-Policy is absent.',
      },
      {
        id: 'ARGUS-CORP-001',
        severity: 'LOW',
        trigger: 'Cross-Origin-Resource-Policy is absent.',
      },
      {
        id: 'ARGUS-COEP-002',
        severity: 'MEDIUM',
        trigger:
          'COEP contains require-corp while Cross-Origin-Resource-Policy is absent.',
      },
    ],
    remediation:
      'Choose an isolation posture deliberately. same-origin COOP is common; require-corp COEP needs every embedder to cooperate with CORP or CORS. Not every site needs full cross-origin isolation.',
    example:
      'Cross-Origin-Opener-Policy: same-origin\nCross-Origin-Resource-Policy: same-origin',
    limitations:
      'These headers affect browser embedding and isolation boundaries; a missing header is not automatically a vulnerability for every application. v0.8.0 reviews header values but does not exercise the browser behavior.',
  },
  {
    id: 'referrer',
    index: '09',
    name: 'Referrer-Policy',
    header: 'Referrer-Policy',
    summary:
      'Checks for an explicit referrer policy and flags values that can leak the full URL cross-origin.',
    rules: [
      {
        id: 'ARGUS-REFERRER-001',
        severity: 'LOW',
        trigger: 'Referrer-Policy is absent.',
      },
      {
        id: 'ARGUS-REFERRER-002',
        severity: 'LOW',
        trigger:
          'The value is not a recognized standard policy (including comma-separated fallback chains that do not match).',
      },
      {
        id: 'ARGUS-REFERRER-003',
        severity: 'MEDIUM',
        trigger: 'The policy is unsafe-url or no-referrer-when-downgrade.',
      },
    ],
    remediation:
      'Prefer strict-origin-when-cross-origin or same-origin unless a different policy is required. Test analytics and third-party flows after changing it.',
    example: 'Referrer-Policy: strict-origin-when-cross-origin',
    limitations:
      'The parser accepts common comma-separated fallback chains but is a value check, not a browser simulation. A restrictive policy can still break application flows that rely on referrer data.',
  },
  {
    id: 'permissions',
    index: '10',
    name: 'Permissions-Policy',
    header: 'Permissions-Policy',
    summary:
      'Checks whether powerful browser features are restricted and flags broadly permissive policies.',
    rules: [
      {
        id: 'ARGUS-PERMISSIONS-001',
        severity: 'LOW',
        trigger: 'Permissions-Policy is absent.',
      },
      {
        id: 'ARGUS-PERMISSIONS-002',
        severity: 'LOW',
        trigger: 'The header value is empty.',
      },
      {
        id: 'ARGUS-PERMISSIONS-003',
        severity: 'MEDIUM',
        trigger:
          'At least three comma-separated directives contain a wildcard (*).',
      },
    ],
    remediation:
      'Disable features you do not use and restrict the rest to same-origin where possible. Review the policy whenever an embedded widget needs a feature.',
    example: 'Permissions-Policy: camera=(), microphone=(), geolocation=()',
    limitations:
      'The wildcard heuristic is intentionally simple. A policy without wildcards can still be too broad for a specific application, and browser support for individual features varies.',
  },
  {
    id: 'base-headers',
    index: '11',
    name: 'Information leakage',
    header: 'Server and X-Powered-By',
    summary:
      'Reports response headers that disclose server or framework technology. These are observations, not proof of exploitable vulnerabilities.',
    rules: [
      {
        id: 'ARGUS-SERVER-001',
        severity: 'LOW',
        trigger: 'A Server header is present.',
      },
      {
        id: 'ARGUS-SERVER-002',
        severity: 'MEDIUM',
        trigger: 'An X-Powered-By header is present.',
      },
    ],
    remediation:
      'Suppress or genericize Server and X-Powered-By at the reverse proxy or framework layer. Do not rely on obscurity as a primary control; patch the underlying software.',
    example:
      '# Example (nginx)\nserver_tokens off;\n\n# Remove a framework-generated header at the proxy where supported.',
    limitations:
      'The presence of a banner does not mean the version is vulnerable, and removing it does not fix vulnerabilities. Many CDNs and managed platforms intentionally expose a Server value.',
  },
]
