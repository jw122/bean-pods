pragma solidity ^0.8.10;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IBeanstalk } from "./interfaces/IBeanstalk.sol";
import { IUniswap } from "./interfaces/IUniswap.sol";

contract WPOD is
  ERC20
{
  // ============ Constants ============

  string internal constant NAME = "Wrapped Beanstalk Pod";
  string internal constant SYMBOL = "wPOD";

  IBeanstalk public immutable BEANSTALK;
  IUniswap public immutable BEAN_ETH_AMM;

  // TODO: Can we calculate the AMM pool address in advance? Should we?
  //       For demo purposes, can set this via an admin function...
  IUniswap public immutable WPOD_ETH_AMM;

  // ============ Storage ============

  uint256 internal _CACHED_HARVESTED_COUNT_;
  uint256 internal _TOTAL_PODS_;
  uint256 internal _TOTAL_HARVETABLE_PODS_;
  uint256 internal _TOTAL_SLOTS_;

  // ============ Constructor ============

  constructor(
    IBeanstalk beanstalk,
    IUniswap beanEthAmm,
    IUniswap wpodEthAmm
  )
    ERC20(
      NAME,
      SYMBOL
    )
  {
    BEANSTALK = beanstalk;
    BEAN_ETH_AMM = beanEthAmm;
    WPOD_ETH_AMM = wpodEthAmm;
  }

  // ============ External Functions ============

  /**
   * @notice Mint wPOD by wrapping a Beanstalk plot.
   *
   * @return The amount of wPOD received.
   */
  function wrap(
    uint256 plotId,
    uint256 start,
    uint256 end
  )
    external
    returns (uint256)
  {
    updateTotalSlots();
    // TODO: Call BEANSTALK.transferPlot().
    // TODO: Calculate slot cost for the plot.
    // TODO: Calculate net value of the plot.
    // TODO: Calculate net value of existing wrapped plots.
    // TODO: Mint an ERC-20 balance to the sender.
  }

  /**
   * @notice Burn wPOD and receive one or more Beanstalk plots.
   *
   * @return The amount of wPOD burned.
   */
  function unwrap(
    // TODO
  )
    external
    returns (uint256)
  {
    updateTotalSlots();
    // TODO: Calculate slot cost for the requested plot(s).
    // TODO: Calculate net value of the requested plot(s).
    // TODO: Calculate net value of existing wrapped plots.
    // TODO: Burn required ERC-20 balance from the sender.
    // TODO: Call BEANSTALK.transferPlot().
  }

  // ============ Public Functions ============

  function decimals()
    public
    pure
    override
    returns (uint8)
  {
    return 6;
  }

  // ============ Internal Functions ============

  function updateTotalSlots()
    internal
  {
    uint256 harvested = 0; // TODO: call beanstalk
    uint256 cachedHarvested = _CACHED_HARVESTED_COUNT_;
    if (harvested == cachedHarvested) {
      return;
    }

    // TODO: Iterate over plots in order.
    //       Reduce total slots.

    _CACHED_HARVESTED_COUNT_ = harvested;
  }
}
