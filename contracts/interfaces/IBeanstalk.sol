pragma solidity ^0.8.10;

interface IBeanstalk {
  function approvePods(
    address spender,
    uint256 amount
  )
    external;

  function transferPlot(
    address sender,
    address recipient,
    uint256 id,
    uint256 start,
    uint256 end
  )
    external;

  function harvestableIndex()
    external
    view
    returns (uint256);
}
