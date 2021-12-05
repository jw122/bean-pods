pragma solidity ^0.8.10;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IBeanstalk } from "./interfaces/IBeanstalk.sol";
import { IUniswapV2Pair } from "./interfaces/IUniswapV2Pair.sol";

contract WPOD is
  ERC20,
  Ownable // TODO: Only need this for demo purposes.
{
  // ============ Constants ============

  string internal constant NAME = "Wrapped Beanstalk Pod";
  string internal constant SYMBOL = "wPOD";

  IBeanstalk public immutable BEANSTALK;
  IUniswapV2Pair public immutable BEAN_ETH_AMM;

  // TODO: Can we calculate the AMM pool address in advance? Should we?
  //       For demo purposes, can set this via an admin function...
  IUniswapV2Pair public WPOD_ETH_AMM; // TODO: Make immutable.

  // ============ Storage ============

  uint256 internal _CACHED_HARVESTABLE_;
  uint256 internal _TOTAL_PODS_;
  uint256 internal _TOTAL_HARVESTABLE_PODS_;
  uint256 internal _TOTAL_SLOTS_;

  // ============ Constructor ============

  constructor(
    IBeanstalk beanstalk,
    IUniswapV2Pair beanEthAmm,
    IUniswapV2Pair wpodEthAmm
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

  // ============ Demo Functions ============

  function setWpodEthAmm(
    IUniswapV2Pair wpodEthAmm
  )
    external
    onlyOwner
  {
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
    // Refresh the total slot count.
    uint256 harvestable = updateTotalSlots();

    // Transfer the plot (or sub-plot) from the user.
    BEANSTALK.transferPlot(msg.sender, address(this), plotId, start, end);

    // Calculate slot cost for the plot.
    // TODO: Use TWAP instead of price snapshot here
    (uint256 r0, uint256 r1,) = BEAN_ETH_AMM.getReserves(); 
    uint256 beanPrice = r0 / r1; // TODO: Ensure $BEAN is token1, or switch numerator and denominator
    (r0, r1,) = WPOD_ETH_AMM.getReserves(); 
    uint256 wpodPrice = r0 / r1; // TODO: Ensure $WPOD is token1, or switch numerator and denominator
    uint256 slotCost = ((_TOTAL_PODS_ - harvestable) * beanPrice - this.totalSupply() * wpodPrice) / _TOTAL_SLOTS_;

    // Calculate net value of the plot.
    uint256 numSlots = ((end ** 2) + end) / 2 - ((start - 1) ** 2 + start - 1) / 2 - harvestable * (end - start);
    uint256 netValue = (end - start + 1) * beanPrice - numSlots * slotCost;

    // Mint an ERC-20 balance to the sender.
    this.transfer(msg.sender, netValue / wpodPrice);
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
    // Refresh the total slot count.
    uint256 harvestable = updateTotalSlots();

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
    returns (uint256)
  {
    uint256 harvestable = BEANSTALK.harvestableIndex();
    uint256 cachedHarvestable = _CACHED_HARVESTABLE_;
    if (harvestable == cachedHarvestable) {
      return cachedHarvestable;
    }

    // TODO: Iterate over plots in order.
    //       Reduce total slots.

    _CACHED_HARVESTABLE_ = harvestable;
    return harvestable;
  }
}
