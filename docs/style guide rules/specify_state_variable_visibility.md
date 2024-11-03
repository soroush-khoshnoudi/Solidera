### Specify State Variable Visibility
#### Description:
Explicitly declare the visibility of all state variables (`public`, `internal`, etc.) to avoid default behavior.

#### Incorrect Code:
```solidity
uint256 totalSupply;
```

#### Correct Code:
```solidity
uint256 public totalSupply;
```

#### Source:
[Solidity Docs - Visibility](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#visibility)