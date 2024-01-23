# `alerts-to-owasp10` Action

[![Lint](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml)
[![CI](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml)

This GitHub Action provides an opinionated approach to find OWASP Top 10
vulnerability in your GitHub repositories. With this action, you can identify
code scanning alerts with [CWE references](https://cwe.mitre.org/about/) to
OWASP Top 10.

Data that are being mapped:

| Data                        | Source                                                                                                                                                                    | Description                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| CodeQL code scanning alerts | API [`/orgs/{org}/code-scanning/alerts`](https://docs.github.com/en/rest/code-scanning/code-scanning?apiVersion=2022-11-28#list-code-scanning-alerts-for-an-organization) | Alerts with state `open` and have CWE references. |
| OWASP Top 10                | [OWASP/Top10](https://github.com/OWASP/Top10/tree/master/2021/docs), 2021 revision                                                                                        | Risks with referenced CWEs                        |

## Example use cases

- As a security officer, I want to know if my organisation is exposed to OWASP
  Top 10 risks, so that I can report back to the management.
- As an engineering manager, I want to prioritise which alerts to remediate to
  be included in the next release cycle.

## Configurations

Configuring the action with the following:

| Environment Variable | Required | Default | Description                                                                               |
| -------------------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| `ORGANISATION`       | Yes      | N/A     | Name of the organisation.                                                                 |
| `GITHUB_TOKEN`       | Yes      | N/A     | A GitHub token with access to the organisation owner. Minimal scope is `security_events`. |

## Outputs

When the action is completed, these outputs are available:

| Output             | Description                                  |
| ------------------ | -------------------------------------------- |
| `mappingsFilepath` | Filepath to the mappings file `mapping.csv`. |

## Example usages

To use this action, simply include it in your workflow file:

### 1. Basic usage

This will analyse workflow runs in the selected repository, including the
durations and success rate of each workflow.

```yml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: OWASP Top 10
    id: owasp10
    uses: KittyChiu/alerts-to-owasp10@v0.1.0
    env:
      ORGANISATION: ${{ github.repository_owner }}
      GITHUB_TOKEN: ${{ secrets.ALERTS_TOKEN }}

  - name: Print Output
    id: output
    run: echo "${{ steps.owasp10.outputs.mappingsFilepath }}"
```

Below is an example of the `mapping.csv` file:

```csv
repo_name,alert_no,risk,cwe_id
webgoat-demo-2,1,A03:2021 – Injection,cwe-079
webgoat-demo-2,9,A03:2021 – Injection,cwe-079
webgoat-demo-2,10,A03:2021 – Injection,cwe-020
webgoat-demo-2,11,A03:2021 – Injection,cwe-020
webgoat-demo-mb,8,A03:2021 – Injection,cwe-079
webgoat-demo-mb,9,A03:2021 – Injection,cwe-079
webgoat-demo-mb,10,A03:2021 – Injection,cwe-020
webgoat-demo-mb,11,A03:2021 – Injection,cwe-020
```

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).
