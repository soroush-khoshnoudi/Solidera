### Check State Variable Underscore Prefix

#### Description:

Non-external state variables should have a leading underscore to differentiate them from external variables.

#### Incorrect Code:

```solidity
contract Example {
    uint256 someVar;
    string public Hello;
}
```

#### Correct Code:

```solidity
contract Example {
    uint256 _someVar;
    string public Hello;
}
```

#### Source:

[Underscore Prefix for Non-external Variables - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables)
