const puppeteer = require('puppeteer');

async function navigateToGoogle() {
    console.log('Launching Chrome browser...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to google.com...');
        await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
        console.log('Successfully navigated to google.com');

        // Get cookies
        const cookies = await page.cookies();
        console.log('Cookies on google.com:');
        cookies.forEach(cookie => {
            console.log(`${cookie.name}: ${cookie.value}`);
        });

        // Wait a moment to see the page
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('Navigation completed successfully');

    } catch (error) {
        console.error('Error during navigation:', error);
    } finally {
        // Keep browser open for user to interact
        console.log('Browser is now open at google.com. You can interact with the page.');
        console.log('Press Ctrl+C in terminal to close the browser');
    }
}

navigateToGoogle().catch(console.error);
