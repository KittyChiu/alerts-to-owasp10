# Contributing

There are many ways to contribute, from writing code to submitting bug reports.
Here are some guidelines on how you can contribute:

## Getting Started

Before you start contributing, please make sure that you have read the
[README.md](README.md) file and have a basic understanding of the action.

## Contributing Code

1. Fork the repository on GitHub

1. Copy `.env-example` to `.env` and update the environment variables

1. Make sure your local clone pass build and test with

```bash
npm install
npm run bundle
npm test
```

1. Make your changes. Add\update tests under `\test`. Update the documentation
   as required

1. Before committing, validate the format, test, and build the action

```bash
npm run all
```

> [!WARNING]
>
> This step is important! It will run
> [`vercel/ncc`](https://github.com/vercel/ncc) to build the final JavaScript
> action code with all dependencies included. If you do not run this step, the
> action will not work correctly when it is used in a workflow. This step also
> includes the `--license` option for `ncc`, which will create a license file
> for all of the production node modules used in the action.

1. Push your changes to your forked repository on GitHub.

1. Create a pull request against `main` and get feedback on your changes.

## Reporting Bugs

If you find a bug, please open an issue on our GitHub repository.

## Suggesting Enhancements

If you have an idea for a new feature, please open an issue on our GitHub
repository.
