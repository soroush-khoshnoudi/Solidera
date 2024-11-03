### Check Binary Operation
#### Description:
Where possible, avoid using `<=` and `>=`. Using `<` and `>` is more gas-efficient.

#### Incorrect Code:
```solidity
if (x <= 5) { /* ... */ }
```

#### Correct Code:
```solidity
if (x < 6) { /* ... */ }
```

#### Source:
[Binary Operations Optimization - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)