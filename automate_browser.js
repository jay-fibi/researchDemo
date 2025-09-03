const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testBrowserCrashRecovery() {
    console.log('Launching browser for crash recovery testing...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 },
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    const page = await browser.newPage();

    // Array to store all console messages and crash events
    const consoleMessages = [];
    let crashDetected = false;
    let recoveryAttempts = 0;

    // Set up console monitoring for all log types
    page.on('console', (msg) => {
        const logEntry = {
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString(),
            args: msg.args().map(arg => {
                try {
                    return arg.toString();
                } catch (e) {
                    return '[Object]';
                }
            })
        };
        consoleMessages.push(logEntry);
        console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    // Monitor for page crashes
    page.on('error', (error) => {
        console.log('Page error detected:', error.message);
        crashDetected = true;
    });

    page.on('pageerror', (error) => {
        console.log('Page JavaScript error:', error.message);
        crashDetected = true;
    });

    // Handle page crashes
    page.on('crashed', () => {
        console.log('Page crashed!');
        crashDetected = true;
    });

    try {
        // 1. Navigate to crash test page
        console.log('Navigating to crash test page...');
        await page.goto('data:text/html,' + encodeURIComponent(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Browser Crash Test Page</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .crash-controls { margin: 20px 0; padding: 15px; background: #ffebee; border: 2px solid #f44336; }
                    .recovery-controls { margin: 20px 0; padding: 15px; background: #e8f5e8; border: 2px solid #4caf50; }
                    button { margin: 5px; padding: 10px 15px; font-size: 14px; }
                    .danger { background: #f44336; color: white; border: none; }
                    .safe { background: #4caf50; color: white; border: none; }
                    .warning { background: #ff9800; color: white; border: none; }
                    #status { font-size: 16px; font-weight: bold; margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>Browser Crash Recovery Test</h1>
                <div id="status">Ready for crash testing...</div>

                <div class="crash-controls">
                    <h3>🚨 Crash Triggers</h3>
                    <button class="danger" onclick="triggerInfiniteLoop()">Infinite Loop</button>
                    <button class="danger" onclick="triggerStackOverflow()">Stack Overflow</button>
                    <button class="danger" onclick="triggerMemoryExhaustion()">Memory Exhaustion</button>
                    <button class="danger" onclick="triggerComplexComputation()">Complex Computation</button>
                    <button class="danger" onclick="triggerMultipleCrashes()">Multiple Crashes</button>
                </div>

                <div class="recovery-controls">
                    <h3>🔄 Recovery Operations</h3>
                    <button class="safe" onclick="testRecovery()">Test Recovery</button>
                    <button class="safe" onclick="continueOperations()">Continue Operations</button>
                    <button class="warning" onclick="checkBrowserHealth()">Check Health</button>
                </div>

                <div id="recovery-log" style="margin-top: 20px; padding: 10px; background: #f5f5f5; max-height: 300px; overflow-y: auto;"></div>

                <script>
                    let crashCount = 0;
                    let recoveryCount = 0;
                    let isRecovering = false;

                    function logRecovery(message) {
                        const log = document.getElementById('recovery-log');
                        const timestamp = new Date().toLocaleTimeString();
                        log.innerHTML += '<div>[' + timestamp + '] ' + message + '</div>';
                        log.scrollTop = log.scrollHeight;
                        console.log('Recovery:', message);
                    }

                    function triggerInfiniteLoop() {
                        document.getElementById('status').textContent = 'Triggering infinite loop...';
                        logRecovery('Starting infinite loop crash test');

                        // Create infinite loop that will freeze the page
                        while (true) {
                            Math.random();
                            Date.now();
                            // This will eventually cause the browser to freeze/crash
                        }
                    }

                    function triggerStackOverflow() {
                        document.getElementById('status').textContent = 'Triggering stack overflow...';
                        logRecovery('Starting stack overflow crash test');

                        function recursiveCrash() {
                            return recursiveCrash();
                        }
                        recursiveCrash();
                    }

                    function triggerMemoryExhaustion() {
                        document.getElementById('status').textContent = 'Triggering memory exhaustion...';
                        logRecovery('Starting memory exhaustion crash test');

                        const memoryHog = [];
                        while (true) {
                            memoryHog.push(new Array(1000000).fill('memory_hog_data'));
                        }
                    }

                    function triggerComplexComputation() {
                        document.getElementById('status').textContent = 'Triggering complex computation...';
                        logRecovery('Starting complex computation crash test');

                        // Complex computation that may freeze the browser
                        function complexCalc() {
                            let result = 0;
                            for (let i = 0; i < 100000000; i++) {
                                result += Math.sin(i) * Math.cos(i) * Math.tan(i);
                                result *= Math.sqrt(i + 1);
                            }
                            return result;
                        }

                        // Run multiple complex calculations simultaneously
                        for (let i = 0; i < 10; i++) {
                            setTimeout(complexCalc, i * 100);
                        }
                    }

                    function triggerMultipleCrashes() {
                        document.getElementById('status').textContent = 'Triggering multiple crashes...';
                        logRecovery('Starting multiple crash sequence');

                        // Trigger different types of crashes in sequence
                        setTimeout(() => {
                            try {
                                triggerStackOverflow();
                            } catch (e) {
                                logRecovery('Stack overflow caught, continuing...');
                            }
                        }, 1000);

                        setTimeout(() => {
                            try {
                                triggerMemoryExhaustion();
                            } catch (e) {
                                logRecovery('Memory exhaustion caught, continuing...');
                            }
                        }, 3000);

                        setTimeout(() => {
                            try {
                                triggerInfiniteLoop();
                            } catch (e) {
                                logRecovery('Infinite loop caught, continuing...');
                            }
                        }, 5000);
                    }

                    function testRecovery() {
                        document.getElementById('status').textContent = 'Testing recovery mechanisms...';
                        logRecovery('Testing recovery from crash state');

                        try {
                            // Test if basic JavaScript still works
                            const test = Math.random();
                            console.log('Basic computation works:', test);

                            // Test DOM manipulation
                            const div = document.createElement('div');
                            div.textContent = 'Recovery test element';
                            document.body.appendChild(div);

                            logRecovery('Recovery test successful - basic functionality restored');
                            recoveryCount++;
                        } catch (error) {
                            logRecovery('Recovery test failed: ' + error.message);
                        }
                    }

                    function continueOperations() {
                        document.getElementById('status').textContent = 'Continuing operations after crash...';
                        logRecovery('Attempting to continue operations post-crash');

                        try {
                            // Simulate continued operations
                            setInterval(() => {
                                if (!isRecovering) {
                                    console.log('Continued operation at', new Date().toLocaleTimeString());
                                    logRecovery('Operation continued successfully');
                                }
                            }, 2000);

                            logRecovery('Operations resumed successfully');
                        } catch (error) {
                            logRecovery('Failed to continue operations: ' + error.message);
                        }
                    }

                    function checkBrowserHealth() {
                        document.getElementById('status').textContent = 'Checking browser health...';
                        logRecovery('Performing browser health check');

                        const health = {
                            timestamp: new Date().toISOString(),
                            crashCount: crashCount,
                            recoveryCount: recoveryCount,
                            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
                            timing: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A'
                        };

                        console.log('Browser Health Check:', health);
                        logRecovery('Health check completed - Status: ' + (crashCount > recoveryCount ? 'DEGRADED' : 'HEALTHY'));

                        return health;
                    }

                    // Monitor for crashes and recovery
                    window.addEventListener('error', (event) => {
                        crashCount++;
                        logRecovery('JavaScript error detected: ' + event.error.message);
                        isRecovering = true;

                        // Attempt automatic recovery
                        setTimeout(() => {
                            testRecovery();
                            isRecovering = false;
                        }, 1000);
                    });

                    window.addEventListener('unhandledrejection', (event) => {
                        crashCount++;
                        logRecovery('Unhandled promise rejection: ' + event.reason);
                        isRecovering = true;

                        setTimeout(() => {
                            testRecovery();
                            isRecovering = false;
                        }, 1000);
                    });

                    // Auto-generate some initial logs when page loads
                    window.addEventListener('load', () => {
                        console.log('Crash test page loaded successfully');
                        logRecovery('Page initialization complete - ready for crash testing');
                        console.warn('Warning: This page contains crash-inducing code');
                    });
                </script>
            </body>
            </html>
        `), {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        console.log('Navigation to crash test page successful.');

        // 2. Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Trigger crash scenarios
        console.log('Starting crash testing sequence...');

        // Trigger different crash types with delays
        const crashScenarios = [
            { name: 'Stack Overflow', selector: 'button[onclick="triggerStackOverflow()"]' },
            { name: 'Memory Exhaustion', selector: 'button[onclick="triggerMemoryExhaustion()"]' },
            { name: 'Infinite Loop', selector: 'button[onclick="triggerInfiniteLoop()"]' }
        ];

        for (const scenario of crashScenarios) {
            console.log(`Triggering ${scenario.name}...`);
            try {
                await page.click(scenario.selector, { timeout: 5000 });
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for crash to occur

                // Check if page is still responsive
                const isResponsive = await page.evaluate(() => {
                    try {
                        return document.body !== null;
                    } catch (e) {
                        return false;
                    }
                });

                if (!isResponsive || crashDetected) {
                    console.log(`${scenario.name} caused page to become unresponsive`);
                    recoveryAttempts++;

                    // Attempt recovery
                    console.log('Attempting recovery...');
                    await page.reload({ waitUntil: 'networkidle2', timeout: 10000 });
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Test recovery
                    await page.click('button[onclick="testRecovery()"]');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.log(`${scenario.name} triggered error:`, error.message);
                crashDetected = true;
                recoveryAttempts++;
            }
        }

        // 4. Test recovery and continued operations
        console.log('Testing recovery mechanisms...');
        try {
            await page.click('button[onclick="testRecovery()"]');
            await new Promise(resolve => setTimeout(resolve, 1000));

            await page.click('button[onclick="continueOperations()"]');
            await new Promise(resolve => setTimeout(resolve, 3000));

            await page.click('button[onclick="checkBrowserHealth()"]');
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log('Recovery testing failed:', error.message);
        }

        // 5. Save crash recovery results
        console.log('Saving crash recovery results...');
        const outputPath = path.join(__dirname, 'browser_capture', 'crash_recovery_results.txt');

        let output = 'Browser Crash Recovery Test Results - ' + new Date().toISOString() + '\n\n';
        output += 'Crash Detection: ' + (crashDetected ? 'YES' : 'NO') + '\n';
        output += 'Recovery Attempts: ' + recoveryAttempts + '\n';
        output += 'Console Messages Captured: ' + consoleMessages.length + '\n\n';

        // Group messages by type
        const messagesByType = {};
        consoleMessages.forEach(msg => {
            if (!messagesByType[msg.type]) {
                messagesByType[msg.type] = [];
            }
            messagesByType[msg.type].push(msg);
        });

        Object.keys(messagesByType).forEach(type => {
            output += `${type.toUpperCase()} MESSAGES (${messagesByType[type].length}):\n`;
            messagesByType[type].forEach((msg, index) => {
                output += `${index + 1}. [${msg.timestamp}] ${msg.text}\n`;
            });
            output += '\n';
        });

        fs.writeFileSync(outputPath, output);
        console.log(`Crash recovery results saved to ${outputPath}`);

        console.log('Crash recovery testing completed.');
        console.log(`Detected ${crashDetected ? 'crashes' : 'no crashes'}, ${recoveryAttempts} recovery attempts`);

    } catch (error) {
        console.error('Error during crash testing:', error);
        crashDetected = true;
    } finally {
        // Close browser after experiencing issues
        console.log('Closing browser after crash testing...');
        if (crashDetected) {
            console.log('Browser closure due to detected crashes/issues');
        }
        await browser.close();
        console.log('Browser closed.');
    }
}

testBrowserCrashRecovery().catch(console.error);
