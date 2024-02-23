# `alerts-to-owasp10` Action

[![Lint](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/linter.yml)
[![CI](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/KittyChiu/alerts-to-owasp10/actions/workflows/codeql-analysis.yml)
![Coverage](badges/coverage.svg)

This GitHub Action filters GitHub security alerts generated from your GitHub repositories that are related to OWASP Top 10 risks. 

## Use cases

- As a security officer, I want to know if my organisation is exposed to OWASP Top 10 risks, so I can trigger incident response to remediate till resolution in production.
- As an engineering manager, I want to know gaps in application security, so that I can prioritise mentoring and learning in the identified areas.

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
    uses: KittyChiu/alerts-to-owasp10@v0.1.2
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

Do fork this action for advanced usage - to customise output format and additional data context. For example, you might want to include alerts that are `closed`, `dismissed`, or `fixed` etc.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

See the [contributing guidelines](CONTRIBUTING.md) for more information. 

## Support

This action is maintained by [codeowners](CODEOWNERS), and supported by the community. To start, open an issue in this repository and the appropriate label.

## Acknowledgement

- [OWASP/Top10 repo](https://github.com/OWASP/Top10/tree/master/2021/docs) for OWASP Top 10 CWE data.