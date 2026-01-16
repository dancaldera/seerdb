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
const { ViewBuilder } = await import("../../src/components/ViewBuilder.js");

describe("ViewBuilder", () => {
	it("accepts title prop", () => {
		const element = <ViewBuilder title="Test Title">Content</ViewBuilder>;
		expect(element.props.title).toBe("Test Title");
	});

	it("accepts subtitle prop", () => {
		const element = (
			<ViewBuilder title="Title" subtitle="Test Subtitle">
				Content
			</ViewBuilder>
		);
		expect(element.props.subtitle).toBe("Test Subtitle");
	});

	it("accepts children", () => {
		const element = (
			<ViewBuilder title="Title">
				<span>Hello World</span>
			</ViewBuilder>
		);
		expect(element.props.children).toBeDefined();
	});

	it("accepts footer prop", () => {
		const element = (
			<ViewBuilder title="Title" footer="Press ESC to exit">
				Content
			</ViewBuilder>
		);
		expect(element.props.footer).toBe("Press ESC to exit");
	});

	it("works without optional props", () => {
		const element = <ViewBuilder title="Minimal Title">Content</ViewBuilder>;
		expect(element.props.title).toBe("Minimal Title");
		expect(element.props.subtitle).toBeUndefined();
		expect(element.props.footer).toBeUndefined();
	});

	it("accepts all props together", () => {
		const element = (
			<ViewBuilder
				title="Full Title"
				subtitle="Full Subtitle"
				footer="Full Footer"
			>
				Full Content
			</ViewBuilder>
		);

		expect(element.props.title).toBe("Full Title");
		expect(element.props.subtitle).toBe("Full Subtitle");
		expect(element.props.footer).toBe("Full Footer");
		expect(element.props.children).toBe("Full Content");
	});

	it("is a valid React element", () => {
		const element = <ViewBuilder title="Test">Content</ViewBuilder>;
		expect(React.isValidElement(element)).toBe(true);
	});

	it("has correct component type", () => {
		const element = <ViewBuilder title="Test">Content</ViewBuilder>;
		expect(element.type).toBe(ViewBuilder);
	});
});
