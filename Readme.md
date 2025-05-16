# Playwright Setup  
**Created By:** Nandakumar Reddy, Associate Director, Technology  

---

## 🛠️ Prerequisites  

Before setting up Playwright, make sure the following are installed:

- **Node.js (LTS recommended)** – [Download here](https://nodejs.org/)  
- **npm or yarn** – Comes with Node.js  
- **Git** – For version control  

---

## 🚀 Setting Up Playwright  

> ✅ **Note:** For the most up-to-date steps, refer to the centralized guide:  
> [How To: Playwright (Confluence)](https://confluence.uhub.biz/display/VMLGLOBAL/How+To%3A+Playwright)  

---

### 1️⃣ Install Playwright  

```bash
npm install -D @playwright/test@latest
```

---

### 2️⃣ Install Browser Dependencies  

```bash
npx playwright install --with-deps
```

---

### 3️⃣ Install Additional Dependencies  

#### Core dependencies:
```bash
npm install playwright-html-reporter dotenv csv-parser
```

#### Image comparison and file handling:
```bash
npm install pixelmatch pngjs fs-extra
npm i --save-dev @types/pngjs
```

#### For generating ZIP reports:
```bash
npm install adm-zip
```

---

### 4️⃣ Project Structure  

```
/scjohnson-qa-automation
├── /env/                    # .env, dev.env, etc.
├── /node_modules/
├── /tests/                 # Playwright test files
├── /utils/                 # Custom helpers, breakpoints
├── /screenshots/           # Baseline, actual, diff
├── /report/                # Generated HTML and ZIP reports
├── package.json
├── playwright.config.ts
├── README.md
```

---

### 5️⃣ Running Tests  

Use the following command to run tests with a specific environment:

```bash
$env:env="dev"; npx playwright test
npx tsc
```

---

## 📸 Visual Regression & Report Generation

This project includes a **visual regression spec** (`visualRegression.spec.ts`) that:

- Captures screenshots across browsers and breakpoints
- Compares against baselines using `pixelmatch`
- Generates a self-contained **HTML report** with embedded images
- Creates a timestamped **ZIP file** for JIRA ticket attachment

### How to Run It

```bash
$env:env="dev"; npx playwright test tests/visualRegression.spec.ts
$env:env="dev"; npx playwright test tests/componentPaddingCapture.spec.ts

```

After the test run, check the `/report/` folder. You’ll find:

```
/report
├── visual-report-<timestamp>.html
└── visual-report-<timestamp>.zip   ← Attach this to JIRA
```

The `.zip` includes an HTML file with side-by-side comparisons of:

- ✅ Baseline
- ✅ Actual
- ✅ Diff

---

## 📊 Run Reports  

If you use the built-in HTML reporter:

```bash
npx playwright show-report
## below command will create playwright-report-aem.zip ready to be attached to Jira.
npm run zip-report

```

To include visual regression results, use the custom HTML report created above in the `/report/` folder.

---

## ⚙️ Additional Configuration  

Customize `playwright.config.ts` for:

- Test retries
- Viewport/device settings
- Parallelism
- Tracing

📚 Learn more in the [Playwright documentation](https://playwright.dev/).

---
