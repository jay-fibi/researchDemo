const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function automateBrowser() {
    const outputDir = path.join(__dirname, 'browser_capture');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const browser = await puppeteer.launch({ headless: false }); // Set to true for headless
    const page = await browser.newPage();

    // Array to store console logs
    const consoleLogs = [];

    // Listen for console events
    page.on('console', (msg) => {
        console.log(`Console: ${msg.type()}: ${msg.text()}`);
        consoleLogs.push(`${new Date().toISOString()}: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to Amazon
    await page.goto('https://amazon.com');
    console.log('Browser launched and navigated to amazon.com');

    // Wait for 1 minute
    console.log('Waiting for 1 minute...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    console.log('Wait completed.');

    // Close browser
    await browser.close();
    console.log('Browser closed.');
}

automateBrowser().catch(console.error);
