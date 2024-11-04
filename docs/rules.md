# Auditify Rules 

Here is a list of the rules supported by Auditify. We are trying to increase the number of rules supported by the Auditify, so make sure your package is updated.

## Style Guide

| Rule Name                          | Description                                                                         | Link                                                                                 |
|-------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Layout Order                        | Ensure correct layout order in the contract (state variables, constructors, functions). | [Layout Order](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#order-of-layout) |
| State Variable Underscore Prefix    | Use underscores for internal/private state variables.                               | [State Variable Underscore Prefix](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables) |
| State Variable Name                 | Use `camelCase` for state variable names.                                           | [State Variable Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#local-and-state-variable-names) |
| Function Underscore Prefix          | Prefix internal/private functions with an underscore.                               | [Function Underscore Prefix](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables) |
| Function Name                       | Use `camelCase` for function names.                                                 | [Function Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#function-names) |
| Function Parameter Name             | Use descriptive names for function parameters.                                      | [Function Parameter Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#function-argument-names) |
| Contract Name                       | Contract names should be `CamelCase`.                                               | [Contract Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#contract-and-library-names) |
| Struct Name                         | Use `CamelCase` for struct names.                                                   | [Struct Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#struct-names) |
| Event Name                          | Use `CamelCase` for event names.                                                    | [Event Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#event-names) |
| Modifier Name                       | Use `camelCase` for modifier names.                                                 | [Modifier Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#modifier-names) |
| Enum Name                           | Use `CamelCase` for enum names.                                                     | [Enum Name](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#enums) |

## Security Rules

| Rule Name                          | Description                                                                         | Link                                                                                 |
|-------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Check Reentrancy                    | Protect your contract from reentrancy attacks.                                       | [Check Reentrancy](https://medium.com/chainwall-io/reentrancy-attack-in-smart-contracts-4837ed0f9d73) |
| Specify State Variable Visibility   | Always specify visibility for state variables.                                       | [State Variable Visibility](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#visibility) |
| Specify Function Visibility         | Every function should explicitly declare visibility.                                 | [Function Visibility](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#visibility) |
| Avoid Use of `tx.origin`            | Avoid using `tx.origin` for authorization to prevent phishing attacks.               | [Avoid tx.origin](https://medium.com/coinmonks/smart-contract-security-tx-origin-authorization-attack-vectors-027730ae601d) |
| Avoid Block Timestamp               | Do not rely on block timestamps for critical logic.                                  | [Avoid Block Timestamp](https://medium.com/@solidity101/block-timestamp-manipulation-2f5e86b1594f) |
| Check Returned Value                | Always check return values from low-level calls.                                     | [Check Returned Value](https://sm4rty.medium.com/unchecked-call-return-value-solidity-security-1-fe794a7cdb6f) |
| Avoid Abbreviations                 | Use explicit types like `uint256` instead of abbreviated types like `uint`.          | [Avoid Abbreviations](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#type-names) |

## Gas Optimization Rules

| Rule Name                          | Description                                                                         | Link                                                                                 |
|-------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Named Return Parameter              | Use named return parameters to save gas.                                             | [Named Return Parameter](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-6q8ae) |
| Use `calldata` Instead of `memory`  | Use `calldata` for function inputs when the data is not modified.                    | [Use Calldata](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Cache Variable                      | Cache state variables to avoid accessing storage multiple times.                     | [Cache Variable](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Use Custom Error Instead of `require` | Use custom errors to reduce gas costs in `require` statements.                        | [Custom Error](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-a0fm0) |
| Increment/Decrement by 1 Operation  | Use pre-increment/decrement instead of post-increment/decrement.                     | [Increment/Decrement](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Check Binary Operations             | Avoid using `<=` and `>=`, use `<` and `>` where possible.                           | [Binary Operations](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Indexed Events                      | Use indexed parameters in events to optimize gas costs.                              | [Indexed Events](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Cache Array Length in Loops         | Cache the array length in a local variable when looping over arrays.                 | [Cache Array Length](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) |
| Use ERC-1155 for Batch Operations    | Use ERC-1155 for batch transfers instead of multiple ERC-20 or ERC-721 transactions. | [Use ERC-1155](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8v8t9) |

