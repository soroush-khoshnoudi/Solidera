### Check Struct Name
#### Description:
Struct names should be capitalized and clearly describe the structure of data they encapsulate.

#### Incorrect Code:
```solidity
struct userInfo {
    uint256 age;
    string name;
}
```

#### Correct Code:
```solidity
struct UserInfo {
    uint256 age;
    string name;
}
```

#### Source:
[Struct Names - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#struct-names)