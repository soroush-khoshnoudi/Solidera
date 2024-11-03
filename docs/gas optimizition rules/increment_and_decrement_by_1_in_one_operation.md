### Increment and Decrement by 1 in One Operation
#### Description:
Use pre-increment or pre-decrement (`++i` or `--i`) to save gas over post-increment/decrement (`i++` or `i--`).

#### Incorrect Code:
```solidity
for (uint256 i = 0; i < 10; i++) {
    // ...
}
```

#### Correct Code:
```solidity
for (uint256 i = 0; i < 10; ++i) {
    // ...
}
```

#### Source:
[Incrementing/Decrementing Optimization - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)