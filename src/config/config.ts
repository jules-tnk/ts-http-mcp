import { McpConfig } from '../types';

export const config: McpConfig = {
	transport: (process.env.MCP_TRANSPORT as 'stdio' | 'httpStream') || 'stdio',
	port: parseInt(process.env.MCP_PORT || '3000', 10),
};
