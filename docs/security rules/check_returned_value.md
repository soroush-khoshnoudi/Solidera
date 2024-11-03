### Check Returned Value
#### Description:
Always check the return value of low-level calls (like `call`, `delegatecall`, and `send`) to ensure success.

#### Incorrect Code:
```solidity
address(to).send(amount);
```

#### Correct Code:
```solidity
(bool success, ) = address(to).call{value: amount}("");
require(success, "Transfer failed");
```

#### Source:
[Unchecked Call Return Value - Sm4rty](https://sm4rty.medium.com/unchecked-call-return-value-solidity-security-1-fe794a7cdb6f)