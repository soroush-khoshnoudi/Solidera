### Don’t Use Abbreviations
#### Description:
Use explicit types like `uint256` instead of `uint` for better clarity and standardization.

#### Incorrect Code:
```solidity
uint totalSupply = 1000;
```

#### Correct Code:
```solidity
uint256 totalSupply = 1000;
```

#### Source:
[Solidity Style Guide - Avoid Abbreviations](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#type-names)