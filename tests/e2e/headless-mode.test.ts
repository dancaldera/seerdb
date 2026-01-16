import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { execSync, spawn } from "child_process";
import { existsSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

const TEST_DB_DIR = join(import.meta.dir, "test-dbs");
const TEST_DB_PATH = join(TEST_DB_DIR, "test.db");

describe("Headless Mode E2E", () => {
	beforeAll(() => {
		// Create test directory
		if (!existsSync(TEST_DB_DIR)) {
			mkdirSync(TEST_DB_DIR, { recursive: true });
		}

		// Create a test SQLite database with some data
		const { Database } = require("bun:sqlite");
		const db = new Database(TEST_DB_PATH);

		// Create tables
		db.run(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT UNIQUE,
				active INTEGER DEFAULT 1,
				created_at TEXT DEFAULT CURRENT_TIMESTAMP
			)
		`);

		db.run(`
			CREATE TABLE IF NOT EXISTS products (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				price REAL NOT NULL,
				category TEXT
			)
		`);

		// Insert test data
		db.run(
			"INSERT OR IGNORE INTO users (name, email, active) VALUES (?, ?, ?)",
			["Alice", "alice@example.com", 1],
		);
		db.run(
			"INSERT OR IGNORE INTO users (name, email, active) VALUES (?, ?, ?)",
			["Bob", "bob@example.com", 1],
		);
		db.run(
			"INSERT OR IGNORE INTO users (name, email, active) VALUES (?, ?, ?)",
			["Charlie", "charlie@example.com", 0],
		);

		db.run(
			"INSERT OR IGNORE INTO products (name, price, category) VALUES (?, ?, ?)",
			["Widget", 19.99, "Electronics"],
		);
		db.run(
			"INSERT OR IGNORE INTO products (name, price, category) VALUES (?, ?, ?)",
			["Gadget", 29.99, "Electronics"],
		);

		db.close();
	});

	afterAll(() => {
		// Cleanup test database
		if (existsSync(TEST_DB_PATH)) {
			try {
				unlinkSync(TEST_DB_PATH);
			} catch {
				// Ignore errors
			}
		}
		if (existsSync(TEST_DB_DIR)) {
			try {
				rmSync(TEST_DB_DIR, { recursive: true });
			} catch {
				// Ignore errors
			}
		}
	});

	describe("--help flag", () => {
		it("should display help when --help is passed", () => {
			const result = execSync("bun src/index.tsx --help", {
				encoding: "utf-8",
				cwd: join(import.meta.dir, "../.."),
			});

			expect(result).toContain("SeerDB");
			expect(result).toContain("--headless");
			expect(result).toContain("--query");
		});

		it("should display help when -h is passed", () => {
			const result = execSync("bun src/index.tsx -h", {
				encoding: "utf-8",
				cwd: join(import.meta.dir, "../.."),
			});

			expect(result).toContain("SeerDB");
		});
	});

	describe("SQLite queries", () => {
		it("should execute a simple SELECT query with JSON output", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT * FROM users LIMIT 3" --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			const parsed = JSON.parse(result);
			expect(parsed).toHaveProperty("rows");
			expect(parsed).toHaveProperty("rowCount");
			expect(parsed.rowCount).toBeLessThanOrEqual(3);
		});

		it("should execute a SELECT query with TOON output", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT id, name FROM users LIMIT 2" --output toon`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			// TOON format should have a specific structure
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it("should filter with WHERE clause", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT * FROM users WHERE active = 1" --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			const parsed = JSON.parse(result);
			expect(parsed.rows).toBeDefined();
			for (const row of parsed.rows) {
				expect(row.active).toBe(1);
			}
		});

		it("should count records correctly", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT COUNT(*) as count FROM users" --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			const parsed = JSON.parse(result);
			expect(parsed.rows).toBeDefined();
			expect(parsed.rows.length).toBe(1);
			expect(parsed.rows[0].count).toBeGreaterThanOrEqual(3);
		});

		it("should query different tables", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT * FROM products" --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			const parsed = JSON.parse(result);
			expect(parsed.rows).toBeDefined();
			expect(parsed.rows.length).toBeGreaterThanOrEqual(2);
		});

		it("should handle ORDER BY clause", () => {
			const result = execSync(
				`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "SELECT name FROM users ORDER BY name ASC" --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			const parsed = JSON.parse(result);
			expect(parsed.rows).toBeDefined();
			const names = parsed.rows.map((r: { name: string }) => r.name);
			const sortedNames = [...names].sort();
			expect(names).toEqual(sortedNames);
		});
	});

	describe("Error handling", () => {
		it("should fail gracefully with invalid SQL", () => {
			try {
				execSync(
					`bun src/index.tsx --headless --db-type sqlite --connect "${TEST_DB_PATH}" --query "INVALID SQL SYNTAX" --output json`,
					{
						encoding: "utf-8",
						cwd: join(import.meta.dir, "../.."),
						stdio: ["pipe", "pipe", "pipe"],
					},
				);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error: unknown) {
				// Command should exit with non-zero status
				const err = error as { status: number };
				expect(err.status).not.toBe(0);
			}
		});

		it("should fail gracefully with non-existent database", () => {
			try {
				execSync(
					`bun src/index.tsx --headless --db-type sqlite --connect "/nonexistent/path/to/db.sqlite" --query "SELECT 1" --output json`,
					{
						encoding: "utf-8",
						cwd: join(import.meta.dir, "../.."),
						stdio: ["pipe", "pipe", "pipe"],
					},
				);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error: unknown) {
				// Command should exit with non-zero status
				const err = error as { status: number };
				expect(err.status).not.toBe(0);
			}
		});

		it("should fail when no connection is provided for query", () => {
			try {
				execSync(
					`bun src/index.tsx --headless --query "SELECT 1" --output json`,
					{
						encoding: "utf-8",
						cwd: join(import.meta.dir, "../.."),
						stdio: ["pipe", "pipe", "pipe"],
					},
				);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error: unknown) {
				// Command should exit with non-zero status
				const err = error as { status: number };
				expect(err.status).not.toBe(0);
			}
		});
	});

	describe("--list-connections flag", () => {
		it("should list connections with JSON output", () => {
			const result = execSync(
				`bun src/index.tsx --headless --list-connections --output json`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			// Should return valid JSON array (might be empty)
			const parsed = JSON.parse(result);
			expect(Array.isArray(parsed)).toBe(true);
		});

		it("should list connections with TOON output", () => {
			const result = execSync(
				`bun src/index.tsx --headless --list-connections --output toon`,
				{
					encoding: "utf-8",
					cwd: join(import.meta.dir, "../.."),
				},
			);

			// Should return something (TOON format)
			expect(result).toBeDefined();
		});
	});
});
