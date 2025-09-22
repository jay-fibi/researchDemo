const puppeteer = require('puppeteer');

async function navigateToFlipkart() {
    console.log('Launching Chrome browser...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to flipkart.com...');
        await page.goto('https://www.flipkart.com', { waitUntil: 'networkidle2' });
        console.log('Successfully navigated to flipkart.com');

        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Click on Login button
        console.log('Looking for Login button...');
        try {
            // Try multiple selectors for login button
            const loginSelectors = [
                'a[href="/account/login"]',
                'button[data-testid="login-button"]',
                'a:contains("Login")',
                '._1_3w1N',
                'a[href*="login"]'
            ];

            let loginClicked = false;
            for (const selector of loginSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    await page.click(selector);
                    console.log(`Login button clicked using selector: ${selector}`);
                    loginClicked = true;
                    break;
                } catch (e) {
                    // Continue to next selector
                }
            }

            if (!loginClicked) {
                // Try clicking by text content
                await page.evaluate(() => {
                    const elements = Array.from(document.querySelectorAll('*'));
                    const loginElement = elements.find(el =>
                        el.textContent && el.textContent.trim().toLowerCase().includes('login') &&
                        (el.tagName === 'A' || el.tagName === 'BUTTON')
                    );
                    if (loginElement) {
                        loginElement.click();
                        return true;
                    }
                    return false;
                });
                console.log('Login button clicked by text content');
            }

            // Wait for login modal/form to appear
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.log('Could not find or click login button:', error.message);
        }

        // Enter email address
        console.log('Looking for email input field...');
        try {
            // Try multiple selectors for email input
            const emailSelectors = [
                'input[type="email"]',
                'input[placeholder*="email"]',
                'input[placeholder*="Email"]',
                'input[name="email"]',
                'input[name="loginId"]',
                'input[data-testid="email-input"]'
            ];

            let emailEntered = false;
            for (const selector of emailSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    await page.type(selector, 'jay@test.com');
                    console.log(`Email entered using selector: ${selector}`);
                    emailEntered = true;
                    break;
                } catch (e) {
                    // Continue to next selector
                }
            }

            if (!emailEntered) {
                // Try entering by finding input with email-like attributes
                await page.evaluate((email) => {
                    const inputs = Array.from(document.querySelectorAll('input'));
                    const emailInput = inputs.find(input =>
                        input.type === 'email' ||
                        input.placeholder.toLowerCase().includes('email') ||
                        input.name.toLowerCase().includes('email') ||
                        input.name.toLowerCase().includes('login')
                    );
                    if (emailInput) {
                        emailInput.value = email;
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                        return true;
                    }
                    return false;
                }, 'jay@test.com');
                console.log('Email entered using JavaScript evaluation');
            }

        } catch (error) {
            console.log('Could not find or enter email:', error.message);
        }

        console.log('Automation completed successfully');
        console.log('Email "jay@test.com" has been entered');

    } catch (error) {
        console.error('Error during automation:', error);
    } finally {
        // Keep browser open for user to interact
        console.log('Browser is now open. You can continue interacting with flipkart.com');
        console.log('Press Ctrl+C in terminal to close the browser');
    }
}

navigateToFlipkart().catch(console.error);
