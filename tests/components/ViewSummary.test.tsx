import { describe, expect, it, mock } from "bun:test";
import React from "react";

// Mock ink module to avoid yoga-wasm-web WASM loading issues in Bun's test environment
mock.module("ink", () => ({
	Box: ({ children, ...props }: any) =>
		React.createElement("div", props, children),
	Text: ({ children, ...props }: any) =>
		React.createElement("span", props, children),
}));

// Import after mocking
const { ViewSummary } = await import("../../src/components/ViewSummary.js");
const { ViewState } = await import("../../src/types/state.js");

interface ViewHistoryEntry {
	id: string;
	view: (typeof ViewState)[keyof typeof ViewState];
	timestamp: number;
	summary: string;
	data?: { tableName?: string; query?: string };
}

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

	it("accepts entry prop with summary", () => {
		const entry = createEntry({ summary: "Viewing tables" });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.summary).toBe("Viewing tables");
	});

	it("accepts entry prop with timestamp", () => {
		const timestamp = new Date(2024, 0, 15, 10, 30, 0).getTime();
		const entry = createEntry({ timestamp });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.timestamp).toBe(timestamp);
	});

	it("accepts Tables view state", () => {
		const entry = createEntry({ view: ViewState.Tables });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Tables);
	});

	it("accepts Query view state", () => {
		const entry = createEntry({ view: ViewState.Query });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Query);
	});

	it("accepts Search view state", () => {
		const entry = createEntry({ view: ViewState.Search });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Search);
	});

	it("accepts DBType view state", () => {
		const entry = createEntry({ view: ViewState.DBType });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.DBType);
	});

	it("accepts Connection view state", () => {
		const entry = createEntry({ view: ViewState.Connection });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Connection);
	});

	it("accepts SavedConnections view state", () => {
		const entry = createEntry({ view: ViewState.SavedConnections });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.SavedConnections);
	});

	it("accepts Columns view state", () => {
		const entry = createEntry({ view: ViewState.Columns });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Columns);
	});

	it("accepts DataPreview view state", () => {
		const entry = createEntry({ view: ViewState.DataPreview });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.DataPreview);
	});

	it("accepts QueryHistory view state", () => {
		const entry = createEntry({ view: ViewState.QueryHistory });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.QueryHistory);
	});

	it("accepts RowDetail view state", () => {
		const entry = createEntry({ view: ViewState.RowDetail });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.RowDetail);
	});

	it("accepts Relationships view state", () => {
		const entry = createEntry({ view: ViewState.Relationships });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Relationships);
	});

	it("accepts Indexes view state", () => {
		const entry = createEntry({ view: ViewState.Indexes });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Indexes);
	});

	it("accepts Context view state", () => {
		const entry = createEntry({ view: ViewState.Context });
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.view).toBe(ViewState.Context);
	});

	it("accepts entry with data containing tableName", () => {
		const entry = createEntry({
			data: { tableName: "users" },
		});
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.data?.tableName).toBe("users");
	});

	it("accepts entry with data containing query", () => {
		const longQuery =
			"SELECT id, name, email, created_at FROM users WHERE active = true ORDER BY created_at DESC";
		const entry = createEntry({
			data: { query: longQuery },
		});
		const element = <ViewSummary entry={entry} />;

		expect(element.props.entry.data?.query).toBe(longQuery);
	});

	it("is a valid React element", () => {
		const entry = createEntry();
		const element = <ViewSummary entry={entry} />;
		expect(React.isValidElement(element)).toBe(true);
	});

	it("has correct component type", () => {
		const entry = createEntry();
		const element = <ViewSummary entry={entry} />;
		expect(element.type).toBe(ViewSummary);
	});
});
