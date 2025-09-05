const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function browserNavigationTest() {
    console.log('Launching browser instance...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();

    // Create browser_capture directory if it doesn't exist
    const captureDir = path.join(process.cwd(), 'browser_capture');
    if (!fs.existsSync(captureDir)) {
        fs.mkdirSync(captureDir);
    }

    // Array to store console messages
    const consoleMessages = [];

    // Listen for console messages
    page.on('console', msg => {
        const message = `${new Date().toISOString()}: ${msg.type()}: ${msg.text()}`;
        console.log('Captured console:', message);
        consoleMessages.push(message);
    });

    try {
        // 1. Navigate to test page with interactive elements
        console.log('Navigating to test page with interactive elements...');
        const testPagePath = `file://${process.cwd()}/test_page.html`;
        await page.goto(testPagePath, { waitUntil: 'networkidle2' });
        console.log('Successfully navigated to test page');

        // 2. Capture initial screenshot
        console.log('Capturing initial screenshot...');
        const initialScreenshotPath = path.join(captureDir, 'initial_screenshot.png');
        await page.screenshot({ path: initialScreenshotPath, fullPage: true });
        console.log(`Initial screenshot captured: ${initialScreenshotPath}`);

        // Wait a moment to see the page
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Click on a button element to trigger JavaScript console logs
        console.log('Clicking on button element to trigger console logs...');
        await page.click('#triggerBtn');
        console.log('Button clicked successfully');

        // Wait to see the button click effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Input text into a form field
        console.log('Inputting text into form field...');
        await page.type('#nameInput', 'John Doe');
        console.log('Text input completed');

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 5. Submit the form to trigger more console logs
        console.log('Submitting the form to trigger console logs...');
        await page.click('#submitBtn');
        console.log('Form submitted successfully');

        // Wait to see the form submission result
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 6. Scroll down the page
        console.log('Scrolling down the page...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        console.log('Page scrolled to bottom');

        // Wait to see the scrolled content
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Scroll back to top for demonstration
        console.log('Scrolling back to top...');
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });
        console.log('Page scrolled back to top');

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 7. Capture final screenshot after page changes
        console.log('Capturing final screenshot after page changes...');
        const finalScreenshotPath = path.join(captureDir, 'final_screenshot.png');
        await page.screenshot({ path: finalScreenshotPath, fullPage: true });
        console.log(`Final screenshot captured: ${finalScreenshotPath}`);

        // 8. Save console output to file
        console.log('Saving console output to file...');
        const consoleOutputPath = path.join(captureDir, 'console_output.txt');
        fs.writeFileSync(consoleOutputPath, consoleMessages.join('\n'));
        console.log(`Console output saved: ${consoleOutputPath}`);

        console.log('Browser automation test completed successfully');
        console.log(`Total console messages captured: ${consoleMessages.length}`);

    } catch (error) {
        console.error('Error during browser automation:', error);
    } finally {
        // 9. Close the browser
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed.');
    }
}

browserNavigationTest().catch(console.error);
