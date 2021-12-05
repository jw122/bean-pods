pragma solidity ^0.8.10;

library MinHeap {

  uint256 constant ROOT_INDEX = 1;

  /**
   * @notice Add a value.
   */
  function add(
    uint256[] storage self,
    uint256 value
  )
    internal
  {
    self.push(value);
    heapifyUp(self, self.length - 1, value);
  }

  /**
   * @notice Return and remove min value. Reverts if heap is empty.
   */
  function popMin(
    uint256[] storage self
  )
    internal
    returns (uint256)
  {
    uint256 min = self[ROOT_INDEX];
    uint256 last = self[self.length - 1];
    self.pop();
    self[ROOT_INDEX] = last;
    heapifyDown(self, ROOT_INDEX, last);
    return min;
  }

  /**
   * @notice Return min value. Reverts if heap is empty.
   */
  function peekMin(
    uint256[] storage self
  )
    internal
    view
    returns (uint256)
  {
    return self[ROOT_INDEX];
  }

  function heapifyUp(
    uint256[] storage self,
    uint256 index,
    uint256 value
  )
    private
  {
    uint256 parentIndex = index / 2;
    if (parentIndex == 0) {
      return;
    }
    uint256 parentValue = self[parentIndex];
    if (parentValue <= value) {
      return;
    }

    // Swap value with its parent and recurse upwards.
    // TODO: Replace recursive implementation with for-loop implementation.
    self[index] = parentValue;
    self[parentIndex] = value;
    heapifyUp(self, parentIndex, value);
  }

  function heapifyDown(
    uint256[] storage self,
    uint256 index,
    uint256 value
  )
    private
  {
    uint256 length = self.length;
    uint256 leftChildIndex = index * 2;
    if (leftChildIndex >= length) {
      return;
    }
    uint256 minChildIndex = leftChildIndex;
    uint256 minChildValue = self[leftChildIndex];

    // Use right child if it exists and is smaller.
    uint256 rightChildIndex = leftChildIndex + 1;
    if (rightChildIndex < length) {
      uint256 rightChildValue = self[rightChildIndex];
      if (rightChildValue < minChildValue) {
        minChildIndex = rightChildIndex;
        minChildValue = rightChildValue;
      }
    }

    if (minChildValue >= value) {
      return;
    }

    // Swap value with its min child and recurse downwards.
    // TODO: Replace recursive implementation with for-loop implementation.
    self[index] = minChildValue;
    self[minChildIndex] = value;
    heapifyDown(self, minChildIndex, value);
  }
}
