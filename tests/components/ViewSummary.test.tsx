import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";
import React from "react";
import { ViewSummary } from "../../src/components/ViewSummary.js";
import { type ViewHistoryEntry, ViewState } from "../../src/types/state.js";

describe("ViewSummary", () => {
	const createEntry = (
		overrides: Partial<ViewHistoryEntry> = {},
	): ViewHistoryEntry => ({
		id: "test-id",
		view: ViewState.Tables,
		timestamp: Date.now(),
		summary: "Test Summary",
		...overrides,
	});

	it("renders summary text", () => {
		const entry = createEntry({ summary: "Viewing tables" });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("Viewing tables");
	});

	it("renders timestamp", () => {
		const timestamp = new Date(2024, 0, 15, 10, 30, 0).getTime();
		const entry = createEntry({ timestamp });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		// Check that some time format is present (varies by locale)
		expect(lastFrame()).toContain(":");
	});

	it("renders table icon for Tables view", () => {
		const entry = createEntry({ view: ViewState.Tables });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("📋");
	});

	it("renders query icon for Query view", () => {
		const entry = createEntry({ view: ViewState.Query });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("⚡");
	});

	it("renders search icon for Search view", () => {
		const entry = createEntry({ view: ViewState.Search });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🔍");
	});

	it("renders database icon for DBType view", () => {
		const entry = createEntry({ view: ViewState.DBType });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🗄️");
	});

	it("renders connection icon for Connection view", () => {
		const entry = createEntry({ view: ViewState.Connection });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🔌");
	});

	it("renders saved connections icon", () => {
		const entry = createEntry({ view: ViewState.SavedConnections });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("💾");
	});

	it("renders columns icon", () => {
		const entry = createEntry({ view: ViewState.Columns });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("📊");
	});

	it("renders data preview icon", () => {
		const entry = createEntry({ view: ViewState.DataPreview });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("👁️");
	});

	it("renders query history icon", () => {
		const entry = createEntry({ view: ViewState.QueryHistory });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("📜");
	});

	it("renders row detail icon", () => {
		const entry = createEntry({ view: ViewState.RowDetail });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🔬");
	});

	it("renders relationships icon", () => {
		const entry = createEntry({ view: ViewState.Relationships });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🔗");
	});

	it("renders indexes icon", () => {
		const entry = createEntry({ view: ViewState.Indexes });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("📇");
	});

	it("renders context icon", () => {
		const entry = createEntry({ view: ViewState.Context });
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("🧭");
	});

	it("renders table name when present in data", () => {
		const entry = createEntry({
			data: { tableName: "users" },
		});
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		expect(lastFrame()).toContain("(users)");
	});

	it("renders truncated query when present in data", () => {
		const longQuery =
			"SELECT id, name, email, created_at FROM users WHERE active = true ORDER BY created_at DESC";
		const entry = createEntry({
			data: { query: longQuery },
		});
		const { lastFrame } = render(<ViewSummary entry={entry} />);

		// Query should be truncated to 50 chars with "..."
		expect(lastFrame()).toContain('"');
		expect(lastFrame()).toContain("...");
	});
});
