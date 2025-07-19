# Contributing to Multiprints Business System

Thank you for considering contributing to the Multiprints Business Management System. This document outlines our branching strategy and contribution workflow.

## Branching Strategy

We follow a modified GitFlow workflow:

### Main Branches

- `main` - Production-ready code. Deployed to production environment.
- `develop` - Integration branch for features. Deployed to staging environment.

### Supporting Branches

- `feature/*` - Feature branches for new functionality (branched from `develop`)
- `bugfix/*` - Bug fix branches (branched from `develop`)
- `hotfix/*` - Emergency fixes for production (branched from `main`)
- `release/*` - Release preparation branches (branched from `develop`)

## Workflow

1. **Create a branch**
   - For new features: `git checkout -b feature/your-feature-name develop`
   - For bug fixes: `git checkout -b bugfix/issue-description develop`
   - For hotfixes: `git checkout -b hotfix/issue-description main`

2. **Make your changes**
   - Write code and tests
   - Commit regularly with clear messages
   - Follow our coding standards

3. **Push your branch**
   ```
   git push -u origin your-branch-name
   ```

4. **Create a Pull Request**
   - Create a PR to merge into the appropriate branch (`develop` for features/bugfixes, `main` for hotfixes)
   - Fill in the PR template with details about your changes
   - Link any related issues

5. **Code Review**
   - Address any feedback from reviewers
   - Ensure all CI checks pass

6. **Merging**
   - PRs are merged using squash merging
   - The PR title and description will be used as the commit message
   - Delete the branch after merging

## Branch Protection Rules

We enforce the following branch protection rules:

### `main` branch
- Requires pull request reviews (at least 1 approval)
- Requires all status checks to pass
- Requires conversation resolution
- Requires signed commits
- No direct pushes (except by administrators in emergencies)

### `develop` branch
- Requires pull request reviews (at least 1 approval)
- Requires all status checks to pass
- Requires conversation resolution

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(auth): add user registration endpoint
fix(orders): correct tax calculation formula
docs: update API documentation
```

## Code Style

- Backend: Follow PEP 8 style guide for Python
- Frontend: Follow Airbnb JavaScript Style Guide
- Use ESLint and Prettier for JavaScript/TypeScript
- Use Black and Flake8 for Python

## Testing

- Write tests for all new features and bug fixes
- Maintain or improve code coverage
- Run tests locally before pushing

## Questions?

If you have any questions about contributing, please contact the project maintainers.