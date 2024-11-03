### Use `calldata` Instead of `memory`
#### Description:
Use `calldata` instead of `memory` for function inputs to save gas when the data is not modified.

#### Incorrect Code:
```solidity
function processData(string memory data) public {}
```

#### Correct Code:
```solidity
function processData(string calldata data) public {}
```

#### Source:
[Calldata vs Memory - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)