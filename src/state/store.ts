import type { AppState } from "../types/state.js";
import { initialAppState } from "../types/state.js";
import type { AppAction } from "./actions.js";
import { appReducer } from "./reducer.js";

/**
 * Type for the dispatch function
 */
export type AppDispatch = (action: AppAction) => void;

/**
 * Simple state container that wraps the existing appReducer.
 * This replaces React Context for headless and API modes.
 */
export class StateStore {
	private state: AppState;

	constructor(initialState: AppState = initialAppState) {
		this.state = initialState;
	}

	/**
	 * Get the current state
	 */
	getState(): AppState {
		return this.state;
	}

	/**
	 * Dispatch an action to update state
	 */
	dispatch(action: AppAction): void {
		this.state = appReducer(this.state, action);
	}
}

/**
 * Factory function to create a new store instance
 */
export const createStore = (initialState?: AppState): StateStore =>
	new StateStore(initialState);
