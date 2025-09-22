/**
 * Test file for Mention Handler functionality
 * Demonstrates detection and processing of various mention types
 */

const MentionHandler = require('./mention_handler.js');
const fs = require('fs');
const path = require('path');

async function testMentionHandler() {
    console.log('🧪 Testing Mention Handler Functionality\n');

    const handler = new MentionHandler();

    // Test text with various mentions
    const testText = `
        Here are some file references:
        - ./file_a.js - relative path
        - /absolute/path/to/file.js - absolute path
        - ~/Documents/config.json - home directory path

        Git commit references:
        - Latest commit: f55e6a4196de4fddb9ede6dc7d391cb77af828a0
        - Previous: a1b2c3d4e5f6

        Workspace problems:
        - Error: Cannot find module './missing_module.js'
        - Warning: Deprecated function usage
        - Problem: Syntax error in line 42

        Terminal commands:
        $ npm install
        > node server.js
        # git status

        URLs:
        - https://github.com/user/repo
        - http://localhost:3000/api/data
        - https://example.com/path?query=value#fragment

        URI conversions needed:
        - file:///Users/jaygohil/researchDemo/researchDemo/package.json
        - file://localhost/Users/jaygohil/test.txt
    `;

    console.log('📝 Test Text:');
    console.log(testText);
    console.log('\n' + '='.repeat(60) + '\n');

    // Test 1: Detect mentions
    console.log('🔍 1. DETECTING MENTIONS:');
    const mentions = handler.detectMentions(testText);
    console.log(`Found ${mentions.length} mentions:`);
    mentions.forEach((mention, index) => {
        console.log(`  ${index + 1}. ${mention.type}: "${mention.value}"`);
    });
    console.log();

    // Test 2: Process mentions (excluding terminal and git for speed)
    console.log('⚙️  2. PROCESSING MENTIONS (excluding terminal/git for speed):');

    // Process only non-terminal/git mentions first
    const mentionsToProcess = mentions.filter(m => m.type !== 'terminal' && m.type !== 'commit');
    const processedMentions = [];

    for (const mention of mentionsToProcess) {
        let result;

        switch (mention.type) {
            case 'file':
                result = await handler.openFileMention(mention.value);
                break;
            case 'problem':
                result = handler.handleWorkspaceProblem(mention.value);
                break;
            case 'url':
                result = handler.handleUrlMention(mention.value);
                break;
            default:
                result = { success: false, error: 'Unknown mention type' };
        }

        processedMentions.push({
            ...mention,
            result: result
        });
    }

    for (const processed of processedMentions) {
        console.log(`\n📋 ${processed.type.toUpperCase()} MENTION:`);
        console.log(`   Value: "${processed.value}"`);
        console.log(`   Result:`, processed.result);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 3: Individual functionality tests
    console.log('🧪 3. INDIVIDUAL FUNCTIONALITY TESTS:\n');

    // File path tests
    console.log('📁 FILE PATH TESTS:');
    const fileTests = [
        './file_a.js',
        './nonexistent.js',
        'package.json',
        '~/Documents/test.txt'
    ];

    for (const filePath of fileTests) {
        console.log(`\nTesting: ${filePath}`);
        const result = await handler.openFileMention(filePath);
        console.log('Result:', result);
    }

    // URL test
    console.log('\n🌐 URL TEST:');
    const urlResult = handler.handleUrlMention('https://github.com/user/repo/blob/main/README.md');
    console.log('URL result:', urlResult);

    // URI conversion test
    console.log('\n🔄 URI CONVERSION TEST:');
    const uriTests = [
        'file:///Users/jaygohil/researchDemo/researchDemo/package.json',
        'https://example.com/path/file.js'
    ];

    for (const uri of uriTests) {
        const converted = handler.convertUriToRelativePath(uri);
        console.log(`Original: ${uri}`);
        console.log(`Converted: ${converted}`);
    }

    // Path resolution test
    console.log('\n🗂️  PATH RESOLUTION TEST:');
    const pathTests = [
        './file_a.js',
        'package.json',
        '../nonexistent',
        '/absolute/path'
    ];

    for (const testPath of pathTests) {
        console.log(`\nTesting path: ${testPath}`);
        const resolution = handler.testPathResolution(testPath);
        console.log('Resolution result:', resolution);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 4: Workspace problem analysis
    console.log('🚨 4. WORKSPACE PROBLEM ANALYSIS:');
    const problems = [
        'Error: Cannot find module \'./missing.js\'',
        'Warning: Function is deprecated',
        'Problem: Syntax error near unexpected token'
    ];

    for (const problem of problems) {
        console.log(`\nAnalyzing: ${problem}`);
        const analysis = handler.handleWorkspaceProblem(problem);
        console.log('Analysis:', analysis);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 5: Terminal command simulation (very safe commands only)
    console.log('💻 5. TERMINAL REFERENCE HANDLING (safe commands only):');
    const safeCommands = [
        'echo "Hello World"',
        'pwd'
    ];

    for (const command of safeCommands) {
        console.log(`\nTesting command: ${command}`);
        const result = await handler.handleTerminalReference(command);
        console.log('Command result:', {
            success: result.success,
            output: result.output.trim(),
            exitCode: result.exitCode
        });
    }

    console.log('\n🎉 All tests completed!');
}

// Run the tests
testMentionHandler().catch(console.error);
