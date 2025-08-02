# Contributing

Thank you for your interest in contributing to Peeka2! This guide will help you get started.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide details**:
   - OS and version
   - Node.js version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Open a discussion** first for major features
2. **Explain the use case** and benefits
3. **Consider implementation** complexity
4. **Be patient** - features take time

### Submitting Code

#### 1. Fork and Clone
```bash
git clone https://github.com/yourusername/peeka2.git
cd peeka2
npm install
```

#### 2. Create Branch
```bash
git checkout -b feature/your-feature
# or
git checkout -b fix/issue-description
```

#### 3. Make Changes
- Follow existing code style
- Add types to TypeScript interfaces
- Test thoroughly
- Update documentation

#### 4. Commit
```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve issue with..."
```

Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Test additions
- `chore:` Maintenance

#### 5. Push and PR
```bash
git push origin feature/your-feature
```

Then open a Pull Request on GitHub.

## Development Guidelines

### Code Style

#### TypeScript
- Use strict mode
- Avoid `any` type
- Define interfaces
- Use meaningful names

#### React
- Functional components
- Custom hooks for logic
- Props interfaces
- Memoization when needed

#### General
- Clear variable names
- Comments for complex logic
- Error handling
- No console.logs in PR

### Testing Requirements

Before submitting:
- [ ] No TypeScript errors
- [ ] Builds successfully
- [ ] Works in dev mode
- [ ] Works in production
- [ ] No console errors

### Documentation

Update docs for:
- New features
- API changes
- Configuration options
- Breaking changes

## Pull Request Process

### PR Requirements

1. **Clear title** describing the change
2. **Description** with:
   - What changed
   - Why it changed
   - How to test
   - Screenshots (if UI)
3. **Link issues** with "Fixes #123"
4. **Pass CI** checks

### Review Process

1. Automated checks run
2. Maintainer review
3. Address feedback
4. Approval and merge

### What We Look For

- ✅ Code quality
- ✅ Test coverage
- ✅ Documentation
- ✅ Performance impact
- ✅ Security considerations

## Getting Help

### Resources
- [Development Setup](./development-setup.md)
- [Architecture Guide](./architecture.md)
- [API Reference](./api-reference.md)

### Communication
- GitHub Issues for bugs
- Discussions for features
- Pull Requests for code

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commits

## Release Process

We use semantic versioning:
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

Releases happen:
- Monthly for features
- As needed for fixes
- Immediately for security

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.