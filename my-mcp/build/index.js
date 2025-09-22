#!/usr/bin/env node
/**
 * Simple MCP server that provides greeting functionality.
 * It demonstrates core MCP concepts with tools for generating personalized greetings.
 * Can run as both stdio (local) and HTTP/SSE (remote) server.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import express from 'express';
import cors from 'cors';
// Shared state for testing MCP scenarios
let sharedResource = "initial value";
let exclusiveLock = false;
let lastToolCalled = "";
// Check if we should run as HTTP server
const isHttpServer = process.argv.includes('--http');
const port = process.env.PORT || 3001;
/**
 * Create an MCP server with capabilities for tools (to generate greetings).
 */
const server = new Server({
    name: "simple-greeting-server",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Handler that lists available tools.
 * Exposes greeting tools that let clients generate personalized greetings.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "greet_person",
                description: "Generate a personalized greeting for a person",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the person to greet"
                        },
                        style: {
                            type: "string",
                            description: "Greeting style (formal, casual, friendly)",
                            enum: ["formal", "casual", "friendly"],
                            default: "friendly"
                        }
                    },
                    required: ["name"]
                }
            },
            {
                name: "get_time_based_greeting",
                description: "Generate a greeting based on current time of day",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the person to greet"
                        }
                    },
                    required: ["name"]
                }
            },
            {
                name: "read_shared_resource",
                description: "Read the shared resource",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            },
            {
                name: "write_shared_resource",
                description: "Write to the shared resource",
                inputSchema: {
                    type: "object",
                    properties: {
                        value: {
                            type: "string",
                            description: "Value to write"
                        }
                    },
                    required: ["value"]
                }
            },
            {
                name: "acquire_exclusive_lock",
                description: "Acquire exclusive lock",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            },
            {
                name: "release_exclusive_lock",
                description: "Release exclusive lock",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            },
            {
                name: "conflicting_tool_a",
                description: "Tool with conflicting requirements",
                inputSchema: {
                    type: "object",
                    properties: {
                        param: {
                            type: "string",
                            description: "Parameter that must be 'a'"
                        }
                    },
                    required: ["param"]
                }
            },
            {
                name: "conflicting_tool_b",
                description: "Tool with conflicting requirements",
                inputSchema: {
                    type: "object",
                    properties: {
                        param: {
                            type: "string",
                            description: "Parameter that must be 'b'"
                        }
                    },
                    required: ["param"]
                }
            }
        ]
    };
});
/**
 * Handler for greeting tools.
 * Generates personalized greetings based on the requested style or time.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "greet_person": {
            const name = String(request.params.arguments?.name);
            const style = String(request.params.arguments?.style || "friendly");
            if (!name) {
                throw new Error("Name is required");
            }
            let greeting;
            switch (style) {
                case "formal":
                    greeting = `Good day, ${name}. It is a pleasure to meet you.`;
                    break;
                case "casual":
                    greeting = `Hey ${name}! What's up?`;
                    break;
                case "friendly":
                default:
                    greeting = `Hello ${name}! Hope you're having a great day!`;
                    break;
            }
            return {
                content: [{
                        type: "text",
                        text: greeting
                    }]
            };
        }
        case "get_time_based_greeting": {
            const name = String(request.params.arguments?.name);
            if (!name) {
                throw new Error("Name is required");
            }
            const now = new Date();
            const hour = now.getHours();
            let timeGreeting;
            if (hour < 12) {
                timeGreeting = `Good morning, ${name}!`;
            }
            else if (hour < 17) {
                timeGreeting = `Good afternoon, ${name}!`;
            }
            else {
                timeGreeting = `Good evening, ${name}!`;
            }
            return {
                content: [{
                        type: "text",
                        text: timeGreeting
                    }]
            };
        }
        case "read_shared_resource": {
            return {
                content: [{
                        type: "text",
                        text: sharedResource
                    }]
            };
        }
        case "write_shared_resource": {
            const value = String(request.params.arguments?.value || "");
            sharedResource = value;
            return {
                content: [{
                        type: "text",
                        text: `Shared resource updated to: ${value}`
                    }]
            };
        }
        case "acquire_exclusive_lock": {
            if (exclusiveLock) {
                throw new Error("Exclusive lock is already held");
            }
            exclusiveLock = true;
            return {
                content: [{
                        type: "text",
                        text: "Exclusive lock acquired"
                    }]
            };
        }
        case "release_exclusive_lock": {
            if (!exclusiveLock) {
                throw new Error("Exclusive lock is not held");
            }
            exclusiveLock = false;
            return {
                content: [{
                        type: "text",
                        text: "Exclusive lock released"
                    }]
            };
        }
        case "conflicting_tool_a": {
            const param = String(request.params.arguments?.param);
            if (param !== "a") {
                throw new Error("Parameter must be 'a' for tool A");
            }
            lastToolCalled = "a";
            return {
                content: [{
                        type: "text",
                        text: "Tool A executed successfully"
                    }]
            };
        }
        case "conflicting_tool_b": {
            const param = String(request.params.arguments?.param);
            if (param !== "b") {
                throw new Error("Parameter must be 'b' for tool B");
            }
            if (lastToolCalled === "a") {
                throw new Error("Cannot call tool B after tool A due to conflicting requirements");
            }
            lastToolCalled = "b";
            return {
                content: [{
                        type: "text",
                        text: "Tool B executed successfully"
                    }]
            };
        }
        default:
            throw new Error("Unknown tool");
    }
});
/**
 * Start the server using either stdio or HTTP/SSE transport.
 */
async function main() {
    if (isHttpServer) {
        // HTTP/SSE server mode
        const app = express();
        app.use(cors());
        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({ status: 'ok', server: 'simple-greeting-server', version: '0.1.0' });
        });
        // MCP SSE endpoint
        app.get('/sse', async (req, res) => {
            console.error('New SSE connection established');
            // Set SSE headers
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control',
            });
            // Create SSE transport
            const transport = new SSEServerTransport(res, req);
            // Handle connection
            try {
                await server.connect(transport);
                console.error('SSE transport connected successfully');
            }
            catch (error) {
                console.error('SSE connection error:', error);
                res.end();
            }
        });
        // Start HTTP server
        app.listen(port, () => {
            console.error(`Simple Greeting MCP server running on HTTP/SSE at http://localhost:${port}`);
            console.error(`Health check: http://localhost:${port}/health`);
            console.error(`SSE endpoint: http://localhost:${port}/sse`);
        });
    }
    else {
        // Stdio server mode (default)
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Simple Greeting MCP server running on stdio");
    }
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
