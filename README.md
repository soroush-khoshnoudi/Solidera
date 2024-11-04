# Auditify

Auditify is an NPM package designed to help developers analyze their Solidity smart contracts for gas optimization, security bugs, and style guide adherence. With a single command, you can receive categorized insights and tips to improve the quality, security, and efficiency of your smart contract code.

## Features

- **Gas Optimization**: Provides tips to make your contract more gas-efficient.
- **Security**: Flags potential vulnerabilities in the code.
- **Style Guide**: Ensures that the code follows best practices for readability and maintainability.

## Installation

To install Auditify, run:

```bash
npm install -g auditify
```

## Usage

After installing, you can analyze your contract by running the following command:

```bash
auditify path/to/your/contract.sol
```

Replace `path/to/your/contract.sol` with the path to the Solidity file you want to audit.

## Report

Auditify will analyze your contract and categorize findings into three main areas:

1. **Gas Optimization**
2. **Security Bugs**
3. **Style Guide**

Each issue found will include a description, allowing you to quickly understand and address the feedback.

## Rules

For a detailed explanation of the rules applied in each category, please refer to the [Auditify Rules Documentation](https://github.com/soroush-khoshnoudi/Auditify/blob/main/docs/rules.md).

## Example

```bash
auditify contracts/MyContract.sol
```

Example output:

```plaintext
Gas Optimization:
- Use 'view' functions to save gas in read-only functions.
...

Security:
- Avoid re-entrancy vulnerabilities by using the 'checks-effects-interactions' pattern.
...

Style Guide:
- Function names should be in mixedCase.
...
```

## License

This project is licensed under the MIT License.