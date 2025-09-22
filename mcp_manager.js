const fs = require('fs');
const path = require('path');

const settingsPath = '/Users/jaygohil/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json';

function readSettings() {
  try {
    const data = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('Settings updated successfully');
  } catch (error) {
    console.error('Error writing settings:', error);
  }
}

function toggleServer(serverName) {
  const settings = readSettings();
  if (!settings || !settings.mcpServers[serverName]) {
    console.error(`Server ${serverName} not found`);
    return;
  }
  settings.mcpServers[serverName].disabled = !settings.mcpServers[serverName].disabled;
  writeSettings(settings);
  console.log(`Server ${serverName} toggled to ${settings.mcpServers[serverName].disabled ? 'disabled' : 'enabled'}`);
}

function updateTimeout(timeout) {
  const settings = readSettings();
  if (!settings) return;
  settings.timeout = timeout;
  writeSettings(settings);
  console.log(`Timeout updated to ${timeout}ms`);
}

function addRemoteServer(name, command, args, env = {}) {
  const settings = readSettings();
  if (!settings) return;
  settings.mcpServers[name] = {
    command,
    args: args.split(','),
    env,
    disabled: false,
    autoApprove: []
  };
  writeSettings(settings);
  console.log(`Remote server ${name} added`);
}

function deleteServer(serverName) {
  const settings = readSettings();
  if (!settings || !settings.mcpServers[serverName]) {
    console.error(`Server ${serverName} not found`);
    return;
  }
  delete settings.mcpServers[serverName];
  writeSettings(settings);
  console.log(`Server ${serverName} deleted`);
}

function configureAutoApprove(serverName, tools) {
  const settings = readSettings();
  if (!settings || !settings.mcpServers[serverName]) {
    console.error(`Server ${serverName} not found`);
    return;
  }
  settings.mcpServers[serverName].autoApprove = tools.split(',');
  writeSettings(settings);
  console.log(`Auto-approve updated for ${serverName}`);
}

function viewServers() {
  const settings = readSettings();
  if (!settings) return;
  console.log('MCP Servers:');
  for (const [name, config] of Object.entries(settings.mcpServers)) {
    console.log(`- ${name}: ${config.disabled ? 'disabled' : 'enabled'}`);
    if (config.autoApprove && config.autoApprove.length > 0) {
      console.log(`  Auto-approve: ${config.autoApprove.join(', ')}`);
    }
  }
}

const action = process.argv[2];
switch (action) {
  case 'toggle':
    toggleServer(process.argv[3]);
    break;
  case 'timeout':
    updateTimeout(parseInt(process.argv[3]));
    break;
  case 'add':
    addRemoteServer(process.argv[3], process.argv[4], process.argv[5], process.argv[6] ? JSON.parse(process.argv[6]) : {});
    break;
  case 'delete':
    deleteServer(process.argv[3]);
    break;
  case 'autoapprove':
    configureAutoApprove(process.argv[3], process.argv[4]);
    break;
  case 'view':
    viewServers();
    break;
  default:
    console.log('Usage: node mcp_manager.js <action> [args]');
    console.log('Actions: toggle <server>, timeout <ms>, add <name> <command> <args>, delete <server>, autoapprove <server> <tools>, view');
}
