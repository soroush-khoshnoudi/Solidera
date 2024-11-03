### Cache Variable
#### Description:
Avoid accessing storage repeatedly inside loops. Cache the storage variable in a local variable for better gas efficiency.

#### Incorrect Code:
```solidity
function sumArray(uint256[] memory data) public returns (uint256) {
    uint256 total;
    for (uint256 i = 0; i < data.length; i++) {
        total += data[i];
    }
    return total;
}
```

#### Correct Code:
```solidity
function sumArray(uint256[] memory data) public returns (uint256) {
    uint256 total;
    uint256 length = data.length;
    for (uint256 i = 0; i < length; i++) {
        total += data[i];
    }
    return total;
}
```

#### Source:
[Storage Access Optimization - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)