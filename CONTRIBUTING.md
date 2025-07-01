# Contributing to Blog Dashboard

We love your input! We want to make contributing to the Blog Dashboard as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/your-username/blog-dashboard/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-username/blog-dashboard/issues/new).

### Bug Reports

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blog-dashboard.git
   cd blog-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   ```
   Or manually copy `.env.local.template` to `.env.local` and fill in your Sanity credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use proper JSDoc comments for complex functions

### React Components

- Use functional components with hooks
- Prefer client components only when necessary (interactivity)
- Use proper prop typing with TypeScript interfaces
- Follow the naming convention: PascalCase for components

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography scale
- Use the `cn()` utility for conditional classes

### File Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions and API calls
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Coding Guidelines

### General

- Write clear, self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow the existing code style

### Git Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` adding missing tests
- `chore:` changes to build process or auxiliary tools

Examples:
```
feat: add calendar view for posts
fix: resolve date formatting issue in posts list
docs: update setup instructions in README
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing features
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

## Feature Requests

We track feature requests as GitHub issues. Before creating a new feature request:

1. Check if a similar request already exists
2. Provide a clear description of the problem you're trying to solve
3. Describe the solution you'd like to see
4. Consider alternative solutions
5. Add any additional context or screenshots

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in our README and release notes. We appreciate all forms of contribution, from code to documentation to bug reports!

## Getting Help

- Check the [README](README.md) for setup instructions
- Look through existing [issues](https://github.com/your-username/blog-dashboard/issues)
- Join our [discussions](https://github.com/your-username/blog-dashboard/discussions)
- Contact the maintainers directly

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

## Project Maintenance

### Maintainer Responsibilities

- Review and merge pull requests
- Triage and respond to issues
- Release new versions
- Update documentation
- Foster a welcoming community

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a new GitHub release
4. Deploy to npm (if applicable)

---

Thank you for contributing to Blog Dashboard! 🎉
