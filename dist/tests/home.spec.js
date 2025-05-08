"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const breakpoints_1 = require("@utils/breakpoints");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables from env/dev.env
dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });
const BASE_URL = `${process.env.BASE_URL}`;
const pageName = 'home'; // Customize per spec or parameterize
for (const [label, viewport] of Object.entries(breakpoints_1.breakpoints)) {
    (0, test_1.test)(`${pageName} renders correctly at ${label}`, async ({ browserName, browser }) => {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        if (!BASE_URL) {
            throw new Error('Missing BASE_URL in environment variables.');
        }
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        const screenshotPath = `screenshots/actual/${browserName}/${label}/${pageName}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await context.close();
    });
}
