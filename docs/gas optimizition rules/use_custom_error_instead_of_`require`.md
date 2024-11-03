### Use Custom Error Instead of `require`
#### Description:
Using custom errors instead of `require` with strings reduces gas costs significantly.

#### Incorrect Code:
```solidity
require(condition, "Condition not met");
```

#### Correct Code:
```solidity
error ConditionNotMet();
if (!condition) revert ConditionNotMet();
```

#### Source:
[Use Custom Errors - Rareskills](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-a0fm0)