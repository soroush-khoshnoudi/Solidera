### Check State Variable Name
#### Description:
Use descriptive **camelCase** names for state variables to improve code readability and clarity.

#### Incorrect Code:
```solidity
contract Example {
    uint256 UserB;
}
```

#### Correct Code:
```solidity
contract Example {
    uint256 userBalance;
}
```

#### Source:
[Local and State Variable Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#local-and-state-variable-names)