# Playwright Setup  
**Created By:** Nandakumar Reddy, Associate Director Technology  

## Prerequisites  

Before setting up Playwright, ensure you have the following installed on your system:  

- **Node.js (LTS version recommended)** – Download and install from [nodejs.org](https://nodejs.org/)  
- **npm or yarn** – Comes with the Node.js installation  
- **Git** – Recommended for version control  

## Setting Up Playwright  

> ✅ **Note:** For the most up-to-date and centralized Playwright installation steps, refer to our seed project guide here:  
> [How To: Playwright (Confluence)](https://confluence.uhub.biz/display/VMLGLOBAL/How+To%3A+Playwright)  
> This ensures any future updates are automatically reflected without needing maintenance here.

### 1. Install Playwright  
Playwright requires browser binaries. Install them using:  

    npm install -D @playwright/test@latest


### 2. Install Browser Dependencies  
Download the required browser binaries and system dependencies:


    npx playwright install --with-deps


### 3. Install Additional Dependencies  
Install the required dependencies using:  

    npm install playwright-html-reporter dotenv csv-parser
    //install below package for compare screenshots
    npm install pixelmatch pngjs fs-extra


### 4. Project Structure  
After running the setup, your project should contain the following structure:  

```
/scjohnson-qa-automation
│── /env/   
│── /node_modules/           # Installed dependencies
│── /tests/                  # Playwright test files
│── package.json             # Project metadata
│── package-lock.json        # Dependency lock file
│── playwright.config.ts     # Playwright configuration
│── README.md
```  

### 5. Running Tests  
To execute Playwright tests, use:  

```sh
$env:env="dev"; npx playwright test
npx tsc

```  
## Run Reports


## Additional Configuration  
Modify `playwright.config.ts` to customize settings such as timeouts, browser options, and test retries.  

For more details, check the [Playwright documentation](https://playwright.dev/).  

 

