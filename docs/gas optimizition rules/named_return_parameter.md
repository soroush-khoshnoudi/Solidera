## Gas Optimization Rules

### Named Return Parameter
#### Description:
Use named return parameters to reduce gas by cutting down on memory operations.

#### Incorrect Code:
```solidity
function getBalance() public returns (uint256) {
    return address(this).balance;
}
```

#### Correct Code:
```solidity
function getBalance() public returns (uint256 balance) {
    balance = address(this).balance;
}
```

#### Source:
[Named Return Parameters - Rareskills](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-6q8ae)