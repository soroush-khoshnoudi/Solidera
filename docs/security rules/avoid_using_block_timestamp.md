### Avoid Using Block Timestamp
#### Description:
Avoid relying on block timestamps for critical logic since miners can manipulate it.

#### Incorrect Code:
```solidity
require(block.timestamp > lastExecution + 1 days);
```

#### Correct Code:
```solidity
require(block.number > lastExecutionBlock + 6500); // approx. 1 day in blocks
```

#### Source:
[Block Timestamp Manipulation - Solidity101](https://medium.com/@solidity101/block-timestamp-manipulation-2f5e86b1594f)