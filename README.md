# `alerts-to-owasp10` Action

[![Lint](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml)
[![CI](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml)

This GitHub Action provides an opinionated approach to find OWASP Top 10
vulnerability in your GitHub repositories. This is to identify which code
scanning alert is associated with OWASP Top 10.

## Use cases

- As a security officer, I want to know if my organisation is exposed to OWASP Top 10 risks, so I can report back to the management for support.
- As an engineering manager, I want to prioritise which alerts to remediate in the next release cycle, so I can add to the product backlog.

## How does this action work?

This action performs filtering with [CWEs](https://cwe.mitre.org/about/) in the data
sets below. If the filtered list returns more than zero alert, then your repository may expose to the OWASP Top 10 risks.

| Data                        | Source                                                                                                                                                                    | Description                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| CodeQL code scanning alerts | API [`/orgs/{org}/code-scanning/alerts`](https://docs.github.com/en/rest/code-scanning/code-scanning?apiVersion=2022-11-28#list-code-scanning-alerts-for-an-organization) | Alerts with state `open` and have CWE references. |
| OWASP Top 10                | [OWASP/Top10](https://github.com/OWASP/Top10/tree/master/2021/docs), 2021 revision                                                                                        | Risks with referenced CWEs                        |

## Outputs

When the action is completed, Below outputs are available:

| Output        | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `mapping.csv` | A CSV file contains a list of alerts filtered with OWASP Top 10. |
| `alerts.json` | A JSON file contains an unfiltered list of alerts in the given organisation with status `open`. |

Expand below for an example output of the `mapping.csv` file:

<details>

```csv
repo_name,alert_no,risk,cwe_id
webgoat-demo-2,1,A03:2021 – Injection,cwe-079
webgoat-demo-1,10,A03:2021 – Injection,cwe-020
demo-nodegoat,25,A01:2021 – Broken Access Control,cwe-601
demo-nodegoat,26,A02:2021 – Cryptographic Failures,cwe-319
demo-nodegoat,26,A04:2021 – Insecure Design,cwe-311
demo-nodegoat,26,A05:2021 – Security Misconfiguration,cwe-614
```

</details>

Expand below for an example output of the `alerts.json` file:

<details>

```json
{
  "webgoat-demo-2": {
    "1": [
      "cwe-079",
      "cwe-116"
    ],
    "2": [
      "cwe-079",
      "cwe-116"
    ]
},
  "webgoat-demo-3": {
    "24": [
      "cwe-079",
      "cwe-094",
      "cwe-095",
      "cwe-116"
    ],
    "25": [
      "cwe-601"
    ]
}
```

</details>

## Configurations

Configuring the action with the following:

| Environment Variable | Required | Default | Description                                                                               |
| -------------------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| `ORGANISATION`       | Yes      | N/A     | Name of the organisation.                                                                 |
| `GITHUB_TOKEN`       | Yes      | N/A     | A GitHub token with access to the organisation owner. Minimal scope is `security_events`. |

## Basic Usage

To use this action, simply include it in your workflow file:

```yml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: OWASP Top 10
    uses: KittyChiu/alerts-to-owasp10@v0.1.0
    env:
      ORGANISATION: ${{ github.repository_owner }}
      GITHUB_TOKEN: ${{ secrets.ALERTS_TOKEN }}

  - name: Upload Artifact
    id: upload
    uses: actions/upload-artifact@v4
    with:
      name: mapping
      path: mapping.csv
```

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).
