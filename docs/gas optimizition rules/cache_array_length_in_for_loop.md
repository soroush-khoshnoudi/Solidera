### Cache Array Length in For Loop

#### Description:

Store the length of the array in a local variable before iterating over it, to avoid recalculating the length in every iteration.

#### Incorrect Code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract withoutLengthCaching {
    uint256[] private _arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Function Execution Cost = 26627
    function getVal() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < _arr.length; i++) {
            sum += _arr[i];
        }
        return sum;
    }
}
```

#### Correct Code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract withLengthCaching {
    uint256[] private _arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Function Execution Cost = 26610
    function getVal() public view returns (uint256) {
        uint256[] memory arr = _arr;
        uint256 length = arr.length;
        uint256 sum = 0;
        for (uint256 i = 0; i < length; i++) {
            sum += arr[i];
        }
        return sum;
    }
}
```

#### Source:

[Array Length Caching - Coinsbench](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404)
