/**
 * Demo script for Mention Handler
 * Shows practical usage examples
 */

const MentionHandler = require('./mention_handler.js');

async function runDemo() {
    console.log('🚀 Mention Handler Demo\n');

    const handler = new MentionHandler();

    // Example 1: Code review comment with mentions
    console.log('📝 Example 1: Code Review Comment');
    const reviewComment = `
        Looking at ./src/main.js, I noticed there's an issue with the import on line 15.
        The function in ./utils/helpers.js is not being used correctly.
        Also check https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API for the fetch usage.
        Error: Cannot find module './missing_dependency'
        Consider running: npm install missing-package
    `;

    console.log('Comment:', reviewComment.trim());
    console.log('\nDetected mentions:');
    const mentions = handler.detectMentions(reviewComment);
    mentions.forEach((mention, i) => {
        console.log(`  ${i + 1}. ${mention.type}: ${mention.value}`);
    });

    // Example 2: File path resolution
    console.log('\n📁 Example 2: File Path Resolution');
    const testPaths = ['./file_a.js', 'package.json', './nonexistent.js'];

    for (const path of testPaths) {
        const result = await handler.openFileMention(path);
        console.log(`${path}: ${result.success ? '✅ Found' : '❌ Not found'}`);
        if (result.success) {
            console.log(`   Size: ${result.size} bytes, Type: ${result.type}`);
        }
    }

    // Example 3: URI conversion
    console.log('\n🔄 Example 3: URI Conversion');
    const uris = [
        'file:///Users/jaygohil/researchDemo/researchDemo/package.json',
        'https://github.com/user/repo/blob/main/src/index.js'
    ];

    for (const uri of uris) {
        const converted = handler.convertUriToRelativePath(uri);
        console.log(`${uri}`);
        console.log(`→ ${converted}\n`);
    }

    // Example 4: Problem analysis
    console.log('🚨 Example 4: Problem Analysis');
    const problems = [
        'Error: Cannot find module \'./config\'',
        'Warning: Deprecated API usage',
        'Problem: Syntax error near unexpected token'
    ];

    for (const problem of problems) {
        const analysis = handler.handleWorkspaceProblem(problem);
        console.log(`\n${problem}`);
        console.log(`Severity: ${analysis.severity} | Category: ${analysis.category}`);
        console.log(`Suggestions: ${analysis.suggestions.join(', ')}`);
    }

    // Example 5: URL parsing
    console.log('\n🌐 Example 5: URL Parsing');
    const urls = [
        'https://github.com/user/repo/issues/123',
        'http://localhost:3000/api/users?active=true'
    ];

    for (const url of urls) {
        const parsed = handler.handleUrlMention(url);
        if (parsed.success) {
            console.log(`${url}`);
            console.log(`   Host: ${parsed.hostname}${parsed.pathname}`);
            console.log(`   Query: ${parsed.search || 'none'}`);
        }
    }

    console.log('\n✨ Demo completed! The Mention Handler can detect and process:');
    console.log('   • File paths (relative, absolute, home directory)');
    console.log('   • Git commit hashes');
    console.log('   • Workspace problems and errors');
    console.log('   • Terminal commands');
    console.log('   • URLs and URIs');
    console.log('   • Path resolution in different contexts');
}

runDemo().catch(console.error);
