### Use ERC-1155 for Batch Operations
#### Description:
When dealing with multiple tokens, use the ERC-1155 standard for batch operations to save gas compared to using multiple ERC-20 or ERC-721 transactions.

#### Incorrect Code:
```solidity
// Multiple ERC-20 transfers
tokenA.transfer(to, amountA);
tokenB.transfer(to, amountB);
```

#### Correct Code:
```solidity
// Use ERC-1155 batch transfer
IERC1155(tokenAddress).safeBatchTransferFrom(from, to, ids, amounts, data);
```

#### Source:
[Use ERC-1155 for Gas-Efficient Transfers - Rareskills](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8v8t9)