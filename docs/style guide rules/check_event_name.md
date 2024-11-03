### Check Event Name
#### Description:
Events should use descriptive, capitalized names, reflecting the action they represent.

#### Incorrect Code:
```solidity
event logTransfer(address indexed from, address indexed to);
```

#### Correct Code:
```solidity
event TransferLogged(address indexed from, address indexed to);
```

#### Source:
[Event Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#event-names)