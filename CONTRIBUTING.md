# Contributing to SeerDB

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to SeerDB. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Project Structure

SeerDB is a terminal-based database explorer built with:
- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **UI Framework**: React (via [Ink](https://github.com/vadimdemedes/ink))
- **State Management**: React Context + Immer
- **Build Tool**: esbuild

## Getting Started

### Prerequisites

- MacOS or Linux
- [Bun](https://bun.sh) 1.0+ (will be installed automatically by `scripts/install.sh` if missing)

### Installation

1. Fork the repo on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/seerdb.git
   cd seerdb
   ```
3. Install dependencies:
   ```bash
   bun install
   ```

### Development Workflow

1.  **Start Dev Server**:
    Runs the app in watch mode.
    ```bash
    bun dev
    ```

2.  **Run Tests**:
    ```bash
    bun test
    ```

3.  **Lint / Format**:
    We use [Biome](https://biomejs.dev/) for linting and formatting.
    ```bash
    bun run check
    ```

## Verify Your Changes

Before pushing, please run the verification script to ensure everything is correct:

```bash
bun run verify
```

This runs:
1.  Type checking (`bun run type-check`)
2.  Linting & Formatting (`bun run check`)
3.  Tests (`bun test`)
4.  Build (`bun run build`)

## Pull Requests

1.  Create a new branch: `git checkout -b my-feature-branch`
2.  Make your changes.
3.  Run `bun run verify` to ensure quality.
4.  Push to your fork and submit a Pull Request.
5.  Add a clear description of what your changes do.

## AI Agents

If you are an AI Agent contributing to this project:
1.  Read `AGENTS.md` for specific capabilities.
2.  Follow the guidelines in this file.
3.  Ensure all new features have appropriate tests.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
