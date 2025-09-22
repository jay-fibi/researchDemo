const puppeteer = require('puppeteer');

async function navigateToAmazon() {
    console.log('Launching Chrome browser...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to amazon.in...');
        await page.goto('https://www.amazon.in', { waitUntil: 'networkidle2' });
        console.log('Successfully navigated to amazon.in');

        // Click on the login button
        console.log('Clicking on Login button...');
        await page.waitForSelector('#nav-link-accountList', { timeout: 10000 });
        await page.click('#nav-link-accountList');
        console.log('Login button clicked');

        // Wait for the login page to load
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitForSelector('input[name="email"]', { timeout: 15000 });

        // Enter email
        console.log('Entering email: jay@test.com');
        await page.type('input[name="email"]', 'jay@test.com');
        console.log('Email entered');

        // Wait a moment to see the result
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('Automation completed successfully');

    } catch (error) {
        console.error('Error during automation:', error);
    } finally {
        // Keep browser open for user to interact
        console.log('Browser is now open. You can interact with amazon.in');
        console.log('Press Ctrl+C in terminal to close the browser');
    }
}

navigateToAmazon().catch(console.error);
