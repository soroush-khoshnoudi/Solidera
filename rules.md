Style Guide :

check layout order
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#order-of-layout

check state variable underscore prefix
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables

check state variable name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#local-and-state-variable-names

check function Underscore Prefix
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#underscore-prefix-for-non-external-functions-and-variables

check function name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#function-names

check function parameter name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#function-argument-names

check variable name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#local-and-state-variable-names

checkContractOrder
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#order-of-layout

checkFunctionOrder
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#order-of-functions

check contract name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#contract-and-library-names

check struct name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#struct-names

check event name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#event-names

check modifire name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#modifier-names

check enum name
https://docs.soliditylang.org/en/v0.8.27/style-guide.html#enums

Gas Optimizition :

namedReturnParameter
https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-6q8ae

useCalldataInsteadMemory
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404 9) Calldata vs Memory:

cacheVariable
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404 4) Storage — Cold Access vs Warm Access:

useCustomError instead of require
https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-a0fm0

incAndDecOneOperation
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404 15) Incrementing/Decrementing By 1:

checkBinaryOperation
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404
Less/Greater Than vs Less/Greater Than or Equal To

indexedEvents
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404 18) Indexed Events:

cacheLengthInForStatement
https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404 8) Array Length Caching:

useERC1155
https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8v8t9

Security Rules :

checkReentrancy
https://medium.com/chainwall-io/reentrancy-attack-in-smart-contracts-4837ed0f9d73

specify state variable visibility

specifyFunctionVisibility

avoidUseTxOrigin
https://medium.com/coinmonks/smart-contract-security-tx-origin-authorization-attack-vectors-027730ae601d

avoidUseBlockTimestamp
https://medium.com/@solidity101/block-timestamp-manipulation-2f5e86b1594f

1. Use Block Number 📌

checkReturnedValue
https://sm4rty.medium.com/unchecked-call-return-value-solidity-security-1-fe794a7cdb6f

dontUseAbbreviations
