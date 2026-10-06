# Contributing

Thank you for your interest in contributing!

## Before You Start

If you plan to make major changes (especially new features or design changes), please open an issue or discussion before starting work. This helps ensure your effort aligns with the project's direction.

## Submitting Code

Please keep each pull request focused on a single purpose. Avoid mixing unrelated changes in one PR, as this can make reviewing and merging code more difficult.

Please use the [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages whenever possible. This keeps our history clear and consistent.

Before submitting code, please run the appropriate commands to check for errors and format your code.

```bash
pnpm format
pnpm type-check
pnpm test:unit
```

提交前请确保以上检查全部通过（CI 亦会运行同样的检查，见 `.github/workflows/ci.yml`）。
