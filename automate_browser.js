const puppeteer = require('puppeteer');

async function automateBrowser() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('Waiting for 15 seconds...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    console.log('Navigating to amazon.com...');
    await page.goto('https://amazon.com', { waitUntil: 'networkidle2' });
    console.log('Navigation to amazon.com successful.');

    console.log('Waiting for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log('Refreshing the page...');
    await page.reload({ waitUntil: 'networkidle2' });

    console.log('Closing browser...');
    await browser.close();
    console.log('Browser closed.');
}

automateBrowser().catch(console.error);
