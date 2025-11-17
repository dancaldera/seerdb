import { createAgent } from "./src/agent-api.js";

// Example demonstrating TOON format export
async function testToonExport() {
	const agent = createAgent();

	try {
		// Connect to a database (using saved connection)
		await agent.connect({
			type: "postgresql",
			connectionString: "postgresql://danielcaldera@localhost/elevenlabs_local"
		});

		// Query some data
		const result = await agent.query("SELECT id, name, email FROM users LIMIT 5");

		// Export in different formats
		console.log("=== JSON Export ===");
		console.log(await agent.exportData(result, "json"));

		console.log("\n=== TOON Export ===");
		console.log(await agent.exportData(result, "toon"));

		console.log("\n=== CSV Export ===");
		console.log(await agent.exportData(result, "csv"));

		// Test table-specific TOON export
		console.log("\n=== Table TOON Export ===");
		console.log(await agent.exportTableToToon("users", { limit: 3 }));

	} catch (error) {
		console.error("Error:", error);
	} finally {
		await agent.disconnect();
	}
}

// Run the test
testToonExport();