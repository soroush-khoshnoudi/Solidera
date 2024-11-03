### Check Variable Name
#### Description:
Local variables should use descriptive **camelCase** names to reflect their purpose and improve code readability.

#### Incorrect Code:
```solidity
contract Example {
    function process() public {
        uint256 MyVariable = 5;
    }
}
```

#### Correct Code:
```solidity
contract Example {
    function process() public {
        uint256 totalSupply = 5;
    }
}
```

#### Source:
[Local and State Variable Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#local-and-state-variable-names)