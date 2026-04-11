# Contributing to FieldFlow

Thank you for your interest in contributing to **FieldFlow**! We welcome contributions from anyone to help improve this high-performance keyboard avoidance library.

## How to Contribute

### Reporting Bugs

- Check the [Issues](https://github.com/SyedSohaib456/react-native-fieldflow/issues) to see if the bug has already been reported.
- If not, create a new issue with a clear description of the problem and steps to reproduce it.

### Suggesting Enhancements

- If you have an idea for a new feature or improvement, please open a new issue to discuss it.

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Project Structure**: We use a monorepo structure powered by **Bun**.
   - Core library: `packages/react-native-fieldflow`
   - Showcase app: `example/`
3. **Setup**:
   ```bash
   bun install
   ```
4. **Development**:
   - Make your changes in the library or example app.
   - Ensure the example app still runs and correctly reflects your changes.
5. **Commit**: Use descriptive commit messages.
6. **Push**: Push your branch to your fork.
7. **Create a Pull Request**: Submit a PR to our `main` branch.

## Development Workflow

### Testing the library

To test changes in the library within the `example` app:
1. Make changes in `packages/react-native-fieldflow/src`.
2. The `example` app uses Bun workspaces to link the library locally, so changes should be reflected during development.

## Style Guidelines

- Follow existing code style and formatting.
- Use TypeScript for all core logic.
- Ensure all new components are documented in the `README.md`.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
