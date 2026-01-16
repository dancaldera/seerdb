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

```
seerdb/
├── src/
│   ├── components/     # React/Ink UI components
│   ├── database/       # Database drivers (PostgreSQL, MySQL, SQLite)
│   ├── state/          # State management (reducer, actions, effects)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── agent-api.ts    # Programmatic API for AI agents
│   └── index.tsx       # Main entry point
├── tests/              # Test files
├── scripts/            # Build and utility scripts
└── dist/               # Build output
```

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

1. **Start Dev Server**:
   Runs the app in watch mode.
   ```bash
   bun dev
   ```

2. **Run Tests**:
   ```bash
   bun test
   ```

3. **Lint / Format**:
   We use [Biome](https://biomejs.dev/) for linting and formatting.
   ```bash
   bun run check
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Run in development mode with hot reload |
| `bun run build` | Build both bundle and binary |
| `bun run build:bundle` | Build JavaScript bundle only |
| `bun run build:compile` | Build native binary |
| `bun test` | Run all tests |
| `bun test --coverage` | Run tests with coverage report |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix linting issues automatically |
| `bun run format` | Check formatting |
| `bun run format:fix` | Fix formatting issues |
| `bun run check` | Run all Biome checks with auto-fix |
| `bun run type-check` | Run TypeScript type checking |
| `bun run verify` | Run full verification (type-check, lint, test, build) |

## Verify Your Changes

Before pushing, please run the verification script to ensure everything is correct:

```bash
bun run verify
```

This runs:
1. Type checking (`bun run type-check`)
2. Linting & Formatting (`bun run check`)
3. Tests (`bun test`)
4. Build (`bun run build`)

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Document public APIs with JSDoc comments

### React/Ink Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use the existing `ViewBuilder` component for consistent layouts

### Database Code

- Always use parameterized queries to prevent SQL injection
- Handle errors gracefully with descriptive messages
- Support all three database types (PostgreSQL, MySQL, SQLite) where applicable

### Testing

- Write tests for new functionality
- Place tests in the `tests/` directory mirroring the source structure
- Use descriptive test names
- Test edge cases and error conditions

## Pull Requests

1. Create a new branch: `git checkout -b my-feature-branch`
2. Make your changes.
3. Run `bun run verify` to ensure quality.
4. Push to your fork and submit a Pull Request.
5. Add a clear description of what your changes do.

### PR Checklist

- [ ] All tests pass (`bun test`)
- [ ] Code is formatted (`bun run format:fix`)
- [ ] Linting passes (`bun run lint`)
- [ ] Type checking passes (`bun run type-check`)
- [ ] Documentation is updated if needed

## Commit Messages

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add support for PostgreSQL connection pooling"
git commit -m "fix: resolve memory leak in query results"
git commit -m "docs: update API documentation"
```

Commit message prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Reporting Issues

### Bug Reports

Include:
- SeerDB version (`sdb --version`)
- Operating system and version
- Database type and version
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs

### Feature Requests

Include:
- Clear description of the feature
- Use case / motivation
- Possible implementation approach (optional)

## AI Agents

If you are an AI Agent contributing to this project:
1. Read `AGENTS.md` for specific capabilities.
2. Follow the guidelines in this file.
3. Ensure all new features have appropriate tests.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
