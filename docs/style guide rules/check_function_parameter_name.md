### Check Function Parameter Name
#### Description:
Function parameters should be clearly named using **camelCase** to indicate their purpose.

#### Incorrect Code:
```solidity
contract Example {
    function transfer(uint256 Val) public {}
}
```

#### Correct Code:
```solidity
contract Example {
    function withdraw(uint256 withdrawAmount) public {}
}
```

#### Source:
[Function Argument Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#function-argument-names)