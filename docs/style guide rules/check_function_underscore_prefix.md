### Check Function Underscore Prefix
#### Description:
Prefix non-external function names with an underscore to clearly distinguish them from external functions.

#### Incorrect Code:
```solidity
contract Example {
    function doInternalTask() internal {}
    function doExternalTask() external {}
}
```

#### Correct Code:
```solidity
contract Example {
    function _doInternalTask() internal {}
    function doExternalTask() external {}
}
```

#### Source:
[Underscore Prefix for Non-external Functions - Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables)