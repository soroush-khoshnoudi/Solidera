### Indexed Events
#### Description:
Use indexed parameters in events to reduce gas costs associated with logging events.

#### Incorrect Code:
```solidity
event Transfer(address from, address to, uint256 amount);
```

#### Correct Code:
```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

#### Source:
[Indexed Events Optimization - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)