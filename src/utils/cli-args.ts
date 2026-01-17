import { parseArgs } from "util";

export interface CliArgs {
	/** Run in API mode for programmatic control */
	api?: boolean;
	/** Database type (postgresql, mysql, sqlite) */
	dbType?: string;
	/** Connection string or file path for SQLite */
	connect?: string;
	/** SQL query to execute */
	query?: string;
	/** Output format (json, table, toon) */
	output?: "json" | "table" | "toon";
	/** Run in headless mode for automation */
	headless?: boolean;
	/** List saved connections */
	listConnections?: boolean;
	/** Copy agent documentation to clipboard */
	copy?: boolean;
	/** Show help */
	help?: boolean;
	/** Show version */
	version?: boolean;
	/** Show AI agent help (outputs AGENTS.md) */
	agentHelp?: boolean;
	/** Host for database connection */
	host?: string;
	/** Port for database connection */
	port?: number;
	/** Database name */
	database?: string;
	/** Username for database connection */
	user?: string;
	/** Password for database connection */
	password?: string;
	/** Name of saved connection to use */
	connectionName?: string;
	/** ID of saved connection to use */
	connectionId?: string;
}

export const parseCliArgs = (): CliArgs => {
	try {
		const { values } = parseArgs({
			args: process.argv.slice(2),
			options: {
				api: { type: "boolean", short: "a" },
				"db-type": { type: "string" },
				connect: { type: "string", short: "c" },
				query: { type: "string", short: "q" },
				output: { type: "string", default: "table" },
				headless: { type: "boolean" },
				"list-connections": { type: "boolean" },
				help: { type: "boolean", short: "h" },
				version: { type: "boolean", short: "v" },
				copy: { type: "boolean" },
				"agent-help": { type: "boolean" },
				host: { type: "string" },
				port: { type: "string" },
				database: { type: "string", short: "d" },
				user: { type: "string", short: "u" },
				password: { type: "string", short: "p" },
				"connection-name": { type: "string" },
				"connection-id": { type: "string" },
			},
			allowPositionals: false,
		});

		return {
			api: values.api as boolean,
			dbType: values["db-type"] as string,
			connect: values.connect as string,
			query: values.query as string,
			output: (values.output as "json" | "table" | "toon") || "table",
			headless: values.headless as boolean,
			listConnections: values["list-connections"] as boolean,
			copy: values.copy as boolean,
			help: values.help as boolean,
			version: values.version as boolean,
			agentHelp: values["agent-help"] as boolean,
			host: values.host as string,
			port: values.port ? parseInt(values.port as string, 10) : undefined,
			database: values.database as string,
			user: values.user as string,
			password:
				(values.password as string) && (values.password as string).trim() !== ""
					? (values.password as string)
					: undefined,
			connectionName: values["connection-name"] as string,
			connectionId: values["connection-id"] as string,
		};
	} catch (error) {
		console.error("Error parsing command line arguments:", error);
		return { help: true };
	}
};

export const showHelp = () => {
	console.log(`
SeerDB - Headless CLI Database Explorer for AI Agents

AI Agents: Use --agent-help for comprehensive API documentation and usage examples.

USAGE:
  sdb [OPTIONS]

MODES:
  --headless                   Run in headless mode for automation
  --api, -a                    Run in API mode for programmatic control
  --list-connections           List all saved connections
  --copy                       Copy agent documentation to clipboard

OPENCODE.AI INTEGRATION:
  sdb opencode run "message"   Run OpenCode.ai with SeerDB context (default model: opencode/big-pickle)
  sdb opencode run "message" --model <model>  Run with specific model

CONNECTION OPTIONS:
  --db-type <type>             Database type: postgresql, mysql, sqlite
  --connect, -c <string>       Connection string or SQLite file path
  --connection-name <name>     Use a saved connection by name
  --connection-id <id>         Use a saved connection by ID (recommended for automation)
  --host <host>                Database host
  --port <port>                Database port
  --database, -d <name>        Database name
  --user, -u <username>        Database username
  --password, -p <password>    Database password

QUERY OPTIONS:
  --query, -q <sql>            SQL query to execute
  --output <format>            Output format: json, table, toon (default: table)

OTHER:
  --help, -h                   Show this help message
  --version, -v                Show version number
  --agent-help                 Show AI agent instructions (if you're an agent READ THIS)

DATABASE SUPPORT:
  - PostgreSQL: Full support with connection pooling
  - MySQL: Full support with connection pooling
  - SQLite: Full support with Bun's native driver

EXAMPLES:
  # List saved connections
  sdb --headless --list-connections --output toon

  # Connect to PostgreSQL and run a query
  sdb --headless --db-type postgresql --host localhost --database mydb --user myuser --query "SELECT * FROM users"

  # Connect to SQLite file
  sdb --headless --db-type sqlite --connect /path/to/db.sqlite --query "SELECT * FROM table1"

  # API mode for programmatic control
  sdb --api

  # Headless mode with JSON output
  sdb --headless --db-type postgresql --connect "postgresql://user:pass@host/db" --query "SELECT * FROM users" --output json

  # Headless mode with TOON output (optimized for AI agents - 30-60% fewer tokens)
  sdb --headless --db-type postgresql --connect "postgresql://user:pass@host/db" --query "SELECT * FROM users LIMIT 10" --output toon

  # Use saved connection by ID (most reliable for automation)
  sdb --headless --connection-id "QvdD72rW6TEL1cSdoPOPP" --query "SELECT table_name FROM information_schema.tables"

  # Use saved connection by name
  sdb --headless --connection-name "My Database" --query "SELECT * FROM users LIMIT 10"

SECURITY NOTES:
  - Passwords are encrypted at rest and masked in output
  - Use saved connections to avoid exposing credentials
  - Connection IDs are unique and never change (perfect for automation)
  - Never share database passwords or complete connection strings with passwords

TOON FORMAT (AI Agent Optimized):
  - 30-60% fewer tokens than JSON for uniform data arrays
  - LLM-friendly with explicit array lengths [N] and field declarations {fields}
  - Schema-aware with column metadata
  - Compact tabular format for uniform object arrays

  Example TOON output:
  data[1]{id,name,role}:
    1,Alice,admin

For complete AI agent documentation, see AGENTS.md or run: sdb --copy
`);
};
