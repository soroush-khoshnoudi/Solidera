### Avoid Using `tx.origin`
#### Description:
Avoid using `tx.origin` for authorization because it can lead to phishing attacks.

#### Incorrect Code:
```solidity
require(tx.origin == owner);
```

#### Correct Code:
```solidity
require(msg.sender == owner);
```

#### Source:
[Tx.origin Authorization Attack - Coinmonks](https://medium.com/coinmonks/smart-contract-security-tx-origin-authorization-attack-vectors-027730ae601d)