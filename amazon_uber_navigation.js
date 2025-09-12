const puppeteer = require('puppeteer');

async function navigateAmazonUber() {
    console.log('Launching Chrome browser...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 },
        args: ['--disable-web-security']
    });

    const page = await browser.newPage();

    try {
        // 1. Navigate to amazon.com
        console.log('Navigating to amazon.com...');
        await page.goto('https://amazon.com', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        console.log('Successfully navigated to amazon.com');

        // 2. Wait 30 seconds
        console.log('Waiting 30 seconds...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        console.log('Wait completed');

        // 3. Navigate to uber.com
        console.log('Navigating to uber.com...');
        await page.goto('https://uber.com', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        console.log('Successfully navigated to uber.com');

        // 4. Wait a moment to see the page
        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error('Error during navigation:', error);
    } finally {
        // 5. Close the browser
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed.');
    }
}

navigateAmazonUber().catch(console.error);
