## Security Rules

### Check Reentrancy
#### Description:
Prevent reentrancy attacks by using the checks-effects-interactions pattern or OpenZeppelin's `ReentrancyGuard`.

#### Incorrect Code:
```solidity
function withdraw(uint256 amount) public {
    require(balance[msg.sender] >= amount);
    msg.sender.call{value: amount}("");
    balance[msg.sender] -= amount;
}
```

#### Correct Code:
```solidity
function withdraw(uint256 amount) public nonReentrant {
    require(balance[msg.sender] >= amount);
    balance[msg.sender] -= amount;
    msg.sender.call{value: amount}("");
}
```

#### Source:
[Reentrancy Security - Chainwall](https://medium.com/chainwall-io/reentrancy-attack-in-smart-contracts-4837ed0f9d73)