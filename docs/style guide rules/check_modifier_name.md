### Check Modifier Name
#### Description:
Modifier names should use camelCase and clearly indicate their purpose.

#### Incorrect Code:
```solidity
modifier ONLYOWNER() {
    require(msg.sender == owner);
    _;
}
```

#### Correct Code:
```solidity
modifier onlyOwner() {
    require(msg.sender == owner);
    _;
}
```

#### Source:
[Modifier Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#modifier-names)