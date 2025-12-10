# Security Guide - ZoeHolidays Travel Project

## 🚨 CRITICAL SECURITY INCIDENT RESPONSE

### What Happened?
On December 10, 2025, malicious code was detected in the production build attempting to:
- Scan filesystem for configuration files (`next.config.js`, `.env`, `vercel.json`, etc.)
- Extract SendGrid API keys (keys starting with "SG.")
- Exfiltrate sensitive data

**Status**: Attack FAILED due to syntax errors in malicious code

### Affected Files
- `.next/static/chunks/71d5b6fe-f44e32e73fb39284.js` (112KB)
- `.next/static/chunks/25b8c134-2559732815665463.js` (111KB)

---

## 🛡️ IMMEDIATE ACTION CHECKLIST

### ✅ Required Actions (DO THESE NOW!)

- [ ] **STOP production server immediately**
  ```bash
  pkill -f "next"
  pkill -f "npm"
  ```

- [ ] **Rotate ALL API keys** (assume all keys are compromised)
  - [ ] SendGrid API key
  - [ ] Strapi API token (`NEXT_PUBLIC_STRAPI_TOKEN`)
  - [ ] Instagram API token (`NEXT_PUBLIC_INSTAGRAM_TOKEN`)
  - [ ] Google Analytics ID (optional, but recommended)
  - [ ] Any database credentials
  - [ ] WhatsApp API credentials

- [ ] **Run the cleanup script**
  ```bash
  ./SECURITY_CLEANUP.sh
  ```

- [ ] **Update vulnerable packages**
  ```bash
  npm update axios --save
  npm audit fix
  ```

- [ ] **Check git history for suspicious commits**
  ```bash
  git log --all --oneline --decorate --graph | head -20
  ```

- [ ] **Scan your development machine**
  ```bash
  # Install ClamAV if not installed
  sudo apt-get install clamav clamav-daemon

  # Update virus definitions
  sudo freshclam

  # Scan project directory
  clamscan -r ~/Documents/Programing\ Projects/ZoeHolidays/
  ```

---

## 🔒 PREVENTION STRATEGIES

### 1. Package Management Security

#### Use Package Lock Files
```bash
# Always commit package-lock.json
git add package-lock.json
git commit -m "Lock dependency versions"
```

#### Enable npm Audit Checks
```bash
# Add to package.json scripts
"scripts": {
  "audit": "npm audit --audit-level=high",
  "preinstall": "npm audit --audit-level=critical"
}
```

#### Use Exact Version Pinning
In `package.json`, avoid `^` and `~`:
```json
{
  "dependencies": {
    "axios": "1.13.2",  // ✅ Good - exact version
    "react": "^19.0.0"   // ❌ Risky - allows updates
  }
}
```

### 2. Dependency Security Tools

#### Socket Security (Recommended)
```bash
# Install Socket Security
npm install -g socket
npx socket npm

# Add to CI/CD pipeline
socket npm install
```

#### Snyk Security Scanner
```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor continuously
snyk monitor
```

#### npm-audit-resolver
```bash
npm install -g npm-audit-resolver
npm-audit-resolver --audit-level=high
```

### 3. Build Security

#### Secure Build Environment
```bash
# Use clean, isolated environments for builds
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  node:22-alpine \
  sh -c "npm ci && npm run build"
```

#### Integrity Checks
Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "npm run verify:integrity",
    "verify:integrity": "npm ls && npm audit signatures"
  }
}
```

### 4. Environment Variable Security

#### Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.development
*.key
*.pem
credentials.json
```

#### Use Secret Management
- **Development**: Use `.env.local` (gitignored)
- **Production**: Use Vercel/Netlify environment variables or Vault
- **Never**: Hardcode keys in source code

#### Validate Environment Variables at Runtime
Create `lib/env-validator.ts`:
```typescript
const requiredEnvVars = [
  'NEXT_PUBLIC_STRAPI_URL',
  'NEXT_PUBLIC_STRAPI_TOKEN',
  'NEXT_PUBLIC_INSTAGRAM_TOKEN',
  'NEXT_PUBLIC_WHATSAPP_NUMBER'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

### 5. Runtime Security Headers

Your `next.config.ts` already has good headers, but ensure CSP is enforced:

```typescript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://dashboard.zoeholidays.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join("; ")
}
```

---

## 🔍 CONTINUOUS MONITORING

### 1. GitHub Security Features

#### Enable Dependabot
Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    reviewers:
      - "yousefx00"
    labels:
      - "dependencies"
      - "security"
```

#### Enable Secret Scanning
- Go to GitHub repository → Settings → Security
- Enable "Secret scanning"
- Enable "Push protection"

### 2. Pre-commit Hooks

#### Install Husky
```bash
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm audit --audit-level=high"
npx husky add .husky/pre-commit "npm run lint"
```

### 3. CI/CD Security Checks

Create `.github/workflows/security.yml`:
```yaml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Check for malicious code
        run: |
          if grep -r "SENDGRID_API_KEY\|tryRead.*config.js" .next/static/chunks/ 2>/dev/null; then
            echo "🚨 MALICIOUS CODE DETECTED!"
            exit 1
          fi

      - name: Snyk Security Check
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 4. Build Artifact Verification

Add post-build verification:
```bash
# Add to package.json
"scripts": {
  "postbuild": "node scripts/verify-build.js"
}
```

Create `scripts/verify-build.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MALICIOUS_PATTERNS = [
  'SENDGRID_API_KEY',
  'secrets.js',
  'tryRead',
  '/app/config.js',
  'SG\\.'
];

console.log('🔍 Verifying build artifacts for malicious code...');

try {
  const result = execSync(
    `grep -r "${MALICIOUS_PATTERNS.join('\\|')}" .next/static/chunks/ || true`,
    { encoding: 'utf-8' }
  );

  if (result.trim()) {
    console.error('🚨 MALICIOUS CODE DETECTED IN BUILD!');
    console.error(result);
    process.exit(1);
  }

  console.log('✅ Build verification passed!');
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}
```

---

## 📊 SECURITY AUDIT SCHEDULE

### Daily
- [x] Review GitHub Dependabot alerts
- [x] Check npm audit output

### Weekly
- [ ] Review access logs for unusual activity
- [ ] Update dependencies (`npm update`)
- [ ] Review Snyk security reports

### Monthly
- [ ] Full security audit (`npm audit`)
- [ ] Review and rotate API keys
- [ ] Update all dependencies to latest stable versions
- [ ] Review CSP violations (if logging enabled)

### Quarterly
- [ ] Security penetration testing
- [ ] Review all third-party integrations
- [ ] Audit user permissions and access controls

---

## 🆘 INCIDENT RESPONSE PLAN

### If You Detect Malicious Code

1. **STOP IMMEDIATELY**
   ```bash
   pkill -f "next"
   ```

2. **Isolate the System**
   - Disconnect from network if possible
   - Don't commit any changes

3. **Document Everything**
   - Screenshot the errors
   - Save logs
   - Note the timestamp

4. **Run Cleanup**
   ```bash
   ./SECURITY_CLEANUP.sh
   ```

5. **Rotate Credentials**
   - Change ALL API keys
   - Update database passwords
   - Revoke OAuth tokens

6. **Investigate Root Cause**
   - Check git history: `git log --all --oneline`
   - Review package changes: `git diff HEAD~10 package.json`
   - Scan system: `clamscan -r .`

7. **Report**
   - File GitHub security advisory
   - Report to npm if package is compromised
   - Notify team members

---

## 🔐 BEST PRACTICES SUMMARY

### ✅ DO
- Use package-lock.json and commit it
- Run `npm audit` before every deploy
- Use exact version pinning for critical packages
- Enable Dependabot and secret scanning
- Use environment variables for all secrets
- Implement CSP headers
- Use Snyk or Socket for continuous monitoring
- Review dependency updates before accepting
- Use `npm ci` in CI/CD (not `npm install`)
- Scan build artifacts for malicious code

### ❌ DON'T
- Commit `.env` files
- Use `npm install` in production (use `npm ci`)
- Accept dependency updates without reviewing
- Run `npm install` as root
- Install packages from untrusted sources
- Use `--force` flag unless absolutely necessary
- Disable security warnings
- Skip security audits
- Hardcode API keys in source code

---

## 📞 SUPPORT & RESOURCES

### Tools
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [Socket Security](https://socket.dev/) - Supply chain protection
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) - Built-in security
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/) - Dependency scanner

### Documentation
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

### Emergency Contacts
- GitHub Security: [https://github.com/security](https://github.com/security)
- npm Security: security@npmjs.com

---

**Last Updated**: December 10, 2025
**Status**: Active Incident Response
**Next Review**: After cleanup completion
