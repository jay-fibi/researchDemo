# Mention Handler System

A comprehensive Node.js system for detecting and processing different types of mentions in text content, including file paths, git commits, workspace problems, terminal references, and URLs.

## Features

### 🔍 Mention Detection
- **File Paths**: Detects relative paths (`./file.js`), absolute paths (`/path/to/file.js`), and home directory paths (`~/Documents/file.txt`)
- **Git Commits**: Identifies commit hashes (7-40 character hexadecimal strings)
- **Workspace Problems**: Recognizes error, warning, and problem statements
- **Terminal References**: Detects command-line instructions prefixed with `$`, `>`, or `#`
- **URLs**: Identifies HTTP and HTTPS URLs with proper validation

### 📁 File Path Handling
- Resolves relative paths to absolute paths
- Validates file/directory existence
- Provides file metadata (size, type, modification date)
- Supports home directory expansion (`~`)

### 🔗 Git Integration
- Fetches commit details using `git show --stat`
- Handles commit hash validation
- Provides commit statistics and changes

### 🚨 Problem Analysis
- Categorizes problems by type (syntax, reference, type, import, general)
- Analyzes severity levels (error, warning, info, unknown)
- Generates contextual suggestions for resolution

### 💻 Terminal Command Execution
- Safely executes terminal commands
- Captures stdout, stderr, and exit codes
- Provides execution results and error handling

### 🌐 URL Processing
- Parses URLs into components (protocol, hostname, pathname, search, hash)
- Validates URL format
- Extracts query parameters and fragments

### 🔄 URI Conversion
- Converts `file://` URIs to relative paths
- Handles different URI schemes
- Maintains workspace-relative path resolution

### 🗂️ Path Resolution Testing
- Tests paths in multiple contexts (workspace root, current directory, home directory)
- Provides comprehensive resolution information
- Validates path existence and types

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const MentionHandler = require('./mention_handler.js');

const handler = new MentionHandler();

// Detect mentions in text
const text = "Check ./src/main.js and visit https://github.com/user/repo";
const mentions = handler.detectMentions(text);
console.log(mentions);
// Output: [{ type: 'file', value: './src/main.js', ... }, { type: 'url', value: 'https://github.com/user/repo', ... }]

// Process all mentions
const results = await handler.processMentions(text);
console.log(results);
```

### Individual Functionality

```javascript
// File path handling
const fileResult = await handler.openFileMention('./package.json');
console.log(fileResult);
// { success: true, path: '/absolute/path/package.json', type: 'file', size: 335, ... }

// URL parsing
const urlResult = handler.handleUrlMention('https://example.com/path?query=value');
console.log(urlResult);
// { success: true, protocol: 'https:', hostname: 'example.com', pathname: '/path', ... }

// Problem analysis
const problemResult = handler.handleWorkspaceProblem('Error: Cannot find module');
console.log(problemResult);
// { success: true, severity: 'error', category: 'import', suggestions: [...] }

// URI conversion
const relativePath = handler.convertUriToRelativePath('file:///absolute/path/file.js');
console.log(relativePath); // 'relative/path/file.js'

// Path resolution testing
const resolution = handler.testPathResolution('./src');
console.log(resolution);
// { original: './src', absolute: '/full/path/src', exists: true, type: 'directory', ... }
```

## API Reference

### Constructor
```javascript
new MentionHandler(workspaceRoot = process.cwd())
```

### Methods

#### `detectMentions(text)`
Detects all mentions in the provided text.
- **Parameters**: `text` (string) - Text to analyze
- **Returns**: Array of mention objects

#### `processMentions(text)`
Processes all detected mentions and returns results.
- **Parameters**: `text` (string) - Text to process
- **Returns**: Promise<Array> - Array of processed mention results

#### `openFileMention(filePath)`
Handles file path mentions.
- **Parameters**: `filePath` (string) - Path to the file
- **Returns**: Promise<Object> - File information or error

#### `openGitCommitMention(commitHash)`
Handles git commit mentions.
- **Parameters**: `commitHash` (string) - Git commit hash
- **Returns**: Promise<Object> - Commit information or error

#### `handleWorkspaceProblem(problem)`
Analyzes workspace problems.
- **Parameters**: `problem` (string) - Problem description
- **Returns**: Object - Problem analysis with suggestions

#### `handleTerminalReference(command)`
Executes terminal commands.
- **Parameters**: `command` (string) - Terminal command to execute
- **Returns**: Promise<Object> - Command execution results

#### `handleUrlMention(url)`
Parses and validates URLs.
- **Parameters**: `url` (string) - URL to parse
- **Returns**: Object - Parsed URL components

#### `convertUriToRelativePath(uri)`
Converts URIs to relative paths.
- **Parameters**: `uri` (string) - URI to convert
- **Returns**: string - Relative path

#### `testPathResolution(inputPath)`
Tests path resolution in different contexts.
- **Parameters**: `inputPath` (string) - Path to test
- **Returns**: Object - Comprehensive path resolution information

## Examples

### Code Review Integration
```javascript
const reviewComment = `
    The issue is in ./src/auth.js at line 25.
    Also check https://docs.example.com/api/auth for the API docs.
    Error: Type mismatch in authentication function
    Try running: npm test auth
`;

const handler = new MentionHandler();
const results = await handler.processMentions(reviewComment);

// Process each result
results.forEach(result => {
    switch (result.type) {
        case 'file':
            if (result.result.success) {
                console.log(`📁 Found file: ${result.result.path}`);
            }
            break;
        case 'url':
            if (result.result.success) {
                console.log(`🌐 URL: ${result.result.hostname}${result.result.pathname}`);
            }
            break;
        case 'problem':
            console.log(`🚨 ${result.result.severity}: ${result.result.category}`);
            break;
    }
});
```

### Development Workflow Integration
```javascript
// Process commit messages, issue descriptions, or documentation
const content = `
    Fixed bug in ./components/Button.js
    See commit a1b2c3d for details
    Related issue: https://github.com/org/repo/issues/123
    Warning: Deprecated prop usage detected
`;

const mentions = handler.detectMentions(content);
// Handle each mention type appropriately for your workflow
```

## Testing

Run the comprehensive test suite:
```bash
node test_mentions.js
```

Run the demo:
```bash
node demo.js
```

## File Structure

```
├── mention_handler.js     # Main MentionHandler class
├── test_mentions.js       # Comprehensive test suite
├── demo.js               # Usage examples and demo
└── README_MENTION_HANDLER.md # This documentation
```

## Dependencies

- **Node.js**: >= 12.0.0
- **Git**: For commit-related functionality
- **File System**: Built-in Node.js modules

## Error Handling

The system provides comprehensive error handling:
- Invalid file paths return existence and permission errors
- Malformed URLs return validation errors
- Git operations handle repository and commit not found errors
- Terminal commands capture execution errors and exit codes

## Security Considerations

- Terminal command execution is limited to safe, read-only operations in testing
- File path resolution prevents directory traversal attacks
- URL parsing uses Node.js built-in URL validation
- Git operations are read-only (git show --stat)

## Contributing

1. Add new mention types by extending the `mentionPatterns` object
2. Implement corresponding handler methods
3. Add comprehensive tests for new functionality
4. Update documentation

## License

ISC License
