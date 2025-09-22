/**
 * Mention Handler - A system to detect and process different types of mentions
 * Supports file paths, git commits, workspace problems, terminal references, and URLs
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class MentionHandler {
    constructor(workspaceRoot = process.cwd()) {
        this.workspaceRoot = workspaceRoot;
        this.mentionPatterns = {
            // URL pattern - check this first to avoid conflicts with file paths
            url: {
                pattern: /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,
                type: 'url'
            },
            // File path pattern - more specific to avoid matching URLs
            filePath: {
                pattern: /(?:^|[^a-zA-Z0-9_])((?:\.\.?\/|~\/|[a-zA-Z]:\/|\/)(?:[^\s<>[\]{}|\\^`\[\]]*[^\s<>[\]{}|\\^`\[\].,;!?]))/g,
                type: 'file'
            },
            gitCommit: {
                pattern: /\b([a-f0-9]{7,40})\b/g,
                type: 'commit'
            },
            workspaceProblem: {
                pattern: /(?:error|warning|problem):\s*([^\n]+)/gi,
                type: 'problem'
            },
            terminalReference: {
                pattern: /(?:\$|>|#)\s*([^\n]+)/g,
                type: 'terminal'
            }
        };
    }

    /**
     * Detect mentions in text content
     * @param {string} text - Text to analyze for mentions
     * @returns {Array} Array of detected mentions
     */
    detectMentions(text) {
        const mentions = [];

        for (const [mentionType, config] of Object.entries(this.mentionPatterns)) {
            let match;
            while ((match = config.pattern.exec(text)) !== null) {
                mentions.push({
                    type: config.type,
                    value: match[1] || match[0],
                    index: match.index,
                    fullMatch: match[0]
                });
            }
        }

        return mentions;
    }

    /**
     * Open/handle a file path mention
     * @param {string} filePath - File path to open
     * @returns {Promise<Object>} Result of opening the file
     */
    async openFileMention(filePath) {
        try {
            // Convert to absolute path if relative
            const absolutePath = this.resolveToAbsolutePath(filePath);

            // Check if file exists
            const exists = fs.existsSync(absolutePath);

            if (exists) {
                const stats = fs.statSync(absolutePath);
                return {
                    success: true,
                    path: absolutePath,
                    type: stats.isDirectory() ? 'directory' : 'file',
                    size: stats.size,
                    modified: stats.mtime
                };
            } else {
                return {
                    success: false,
                    path: absolutePath,
                    error: 'File does not exist'
                };
            }
        } catch (error) {
            return {
                success: false,
                path: filePath,
                error: error.message
            };
        }
    }

    /**
     * Open/handle a git commit mention
     * @param {string} commitHash - Git commit hash
     * @returns {Promise<Object>} Git commit information
     */
    async openGitCommitMention(commitHash) {
        return new Promise((resolve) => {
            exec(`git show --stat ${commitHash}`, { cwd: this.workspaceRoot }, (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        success: false,
                        commit: commitHash,
                        error: stderr || error.message
                    });
                } else {
                    resolve({
                        success: true,
                        commit: commitHash,
                        details: stdout
                    });
                }
            });
        });
    }

    /**
     * Handle workspace problem mention
     * @param {string} problem - Problem description
     * @returns {Object} Problem analysis result
     */
    handleWorkspaceProblem(problem) {
        // Analyze the problem type and severity
        const severity = this.analyzeProblemSeverity(problem);
        const category = this.categorizeProblem(problem);

        return {
            success: true,
            problem: problem,
            severity: severity,
            category: category,
            suggestions: this.generateProblemSuggestions(problem, category)
        };
    }

    /**
     * Handle terminal reference mention
     * @param {string} command - Terminal command
     * @returns {Promise<Object>} Command execution result
     */
    async handleTerminalReference(command) {
        return new Promise((resolve) => {
            exec(command, { cwd: this.workspaceRoot }, (error, stdout, stderr) => {
                resolve({
                    success: !error,
                    command: command,
                    output: stdout,
                    error: stderr,
                    exitCode: error ? error.code : 0
                });
            });
        });
    }

    /**
     * Handle URL mention
     * @param {string} url - URL to handle
     * @returns {Object} URL information
     */
    handleUrlMention(url) {
        try {
            const urlObj = new URL(url);
            return {
                success: true,
                url: url,
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                pathname: urlObj.pathname,
                search: urlObj.search,
                hash: urlObj.hash
            };
        } catch (error) {
            return {
                success: false,
                url: url,
                error: 'Invalid URL format'
            };
        }
    }

    /**
     * Convert URI to relative path
     * @param {string} uri - URI to convert
     * @returns {string} Relative path
     */
    convertUriToRelativePath(uri) {
        try {
            // Handle file:// URIs
            if (uri.startsWith('file://')) {
                const filePath = uri.replace('file://', '');
                return path.relative(this.workspaceRoot, filePath);
            }

            // Handle other URI schemes
            const url = new URL(uri);
            if (url.protocol === 'file:') {
                return path.relative(this.workspaceRoot, url.pathname);
            }

            // For non-file URIs, return as-is or convert to relative if possible
            return uri;
        } catch (error) {
            return uri; // Return original if conversion fails
        }
    }

    /**
     * Test path resolution in different contexts
     * @param {string} inputPath - Path to test
     * @returns {Object} Path resolution results
     */
    testPathResolution(inputPath) {
        const results = {
            original: inputPath,
            absolute: null,
            relative: null,
            exists: false,
            type: null,
            contexts: {}
        };

        try {
            // Test absolute path resolution
            results.absolute = path.resolve(inputPath);

            // Test relative path resolution from workspace root
            results.relative = path.relative(this.workspaceRoot, results.absolute);

            // Check if path exists
            results.exists = fs.existsSync(results.absolute);

            if (results.exists) {
                const stats = fs.statSync(results.absolute);
                results.type = stats.isDirectory() ? 'directory' : 'file';
            }

            // Test in different contexts
            results.contexts = {
                workspaceRoot: path.resolve(this.workspaceRoot, inputPath),
                currentDir: path.resolve(process.cwd(), inputPath),
                homeDir: path.resolve(require('os').homedir(), inputPath.replace(/^~/, ''))
            };

        } catch (error) {
            results.error = error.message;
        }

        return results;
    }

    /**
     * Resolve path to absolute path
     * @param {string} inputPath - Input path
     * @returns {string} Absolute path
     */
    resolveToAbsolutePath(inputPath) {
        if (path.isAbsolute(inputPath)) {
            return inputPath;
        }

        // Handle home directory
        if (inputPath.startsWith('~')) {
            return path.resolve(require('os').homedir(), inputPath.slice(1));
        }

        // Resolve relative to workspace root
        return path.resolve(this.workspaceRoot, inputPath);
    }

    /**
     * Analyze problem severity
     * @param {string} problem - Problem text
     * @returns {string} Severity level
     */
    analyzeProblemSeverity(problem) {
        const lowerProblem = problem.toLowerCase();

        if (lowerProblem.includes('error') || lowerProblem.includes('failed')) {
            return 'error';
        } else if (lowerProblem.includes('warning') || lowerProblem.includes('deprecated')) {
            return 'warning';
        } else if (lowerProblem.includes('info') || lowerProblem.includes('notice')) {
            return 'info';
        }

        return 'unknown';
    }

    /**
     * Categorize problem
     * @param {string} problem - Problem text
     * @returns {string} Problem category
     */
    categorizeProblem(problem) {
        const lowerProblem = problem.toLowerCase();

        if (lowerProblem.includes('syntax') || lowerProblem.includes('parse')) {
            return 'syntax';
        } else if (lowerProblem.includes('reference') || lowerProblem.includes('undefined')) {
            return 'reference';
        } else if (lowerProblem.includes('type') || lowerProblem.includes('mismatch')) {
            return 'type';
        } else if (lowerProblem.includes('import') || lowerProblem.includes('module')) {
            return 'import';
        }

        return 'general';
    }

    /**
     * Generate problem suggestions
     * @param {string} problem - Problem text
     * @param {string} category - Problem category
     * @returns {Array} Array of suggestions
     */
    generateProblemSuggestions(problem, category) {
        const suggestions = [];

        switch (category) {
            case 'syntax':
                suggestions.push('Check for missing semicolons, brackets, or quotes');
                suggestions.push('Verify correct syntax for the programming language');
                break;
            case 'reference':
                suggestions.push('Ensure the variable or function is properly declared');
                suggestions.push('Check import statements and module exports');
                break;
            case 'type':
                suggestions.push('Verify variable types match expected types');
                suggestions.push('Check function parameter types');
                break;
            case 'import':
                suggestions.push('Verify the module path is correct');
                suggestions.push('Check if the module is installed');
                break;
            default:
                suggestions.push('Review the error message for specific guidance');
        }

        return suggestions;
    }

    /**
     * Process all mentions in text
     * @param {string} text - Text to process
     * @returns {Promise<Array>} Array of processed mentions
     */
    async processMentions(text) {
        const mentions = this.detectMentions(text);
        const results = [];

        for (const mention of mentions) {
            let result;

            switch (mention.type) {
                case 'file':
                    result = await this.openFileMention(mention.value);
                    break;
                case 'commit':
                    result = await this.openGitCommitMention(mention.value);
                    break;
                case 'problem':
                    result = this.handleWorkspaceProblem(mention.value);
                    break;
                case 'terminal':
                    result = await this.handleTerminalReference(mention.value);
                    break;
                case 'url':
                    result = this.handleUrlMention(mention.value);
                    break;
                default:
                    result = { success: false, error: 'Unknown mention type' };
            }

            results.push({
                ...mention,
                result: result
            });
        }

        return results;
    }
}

module.exports = MentionHandler;
