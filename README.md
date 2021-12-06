# Beanstalk Pods AMM
Instant liquidity for buying and selling [Beanstalk Pods](https://bean.money/).

Read more about [Beanstalk](https://bean.money/docs/beanstalk.pdf)

An SPC Hackathon project (🥇 Deep Tech Category Winner)

![alt text](https://github.com/jw122/bean-pods/blob/main/public/screenshot-ui.png)

## Demo
[View on YouTube](https://youtu.be/HkYmaVIzVUs)


## Team
[Ken](https://twitter.com/kenadia)
[Aki](https://twitter.com/heyitaki)
[Sam](https://twitter.com/samclearman)
[Cat](https://twitter.com/0xcatwu)
[Emma](https://twitter.com/emmaytang)
[Greg](https://twitter.com/gkossakowski)
[Raymond](https://twitter.com/raymondzhong)
[Julia](https://twitter.com/thejuliawu)

## Overview
By [Ken](https://github.com/Kenadia)
### Goal

Create a market offering instant liquidity for buying and selling Beanstalk Pods.

### Background
A Beanstalk Pod is a claim to one future Bean (the Beanstalk stablecoin). Pods are redeemed FIFO and do not have a specified maturity date. A sequence of Pods owned by the same address is called a “plot.” Pods are not fungible since a pod is more valuable the closer it is to the front of the queue.

### Why
Beanstalk provides an innovative model for an algorithmic stablecoin, whereby new Beans (the stablecoin) enter the supply via a queue of Pods. The success of the protocol depends on Bean holders being willing to “sow” their beans, which means burning them in exchange for new Pods minted at the end of the queue.

Currently, the Pod queue exceeds the Bean supply in a ratio of almost 8:1, representing an estimated waiting time of about 9 months between “sowing” and “harvesting.” Creating a liquid market for Pods is likely to support the health of the protocol by reducing the lock-up costs borne by individual users and making the market dynamics more efficient.

### Solution
Create an ERC-20 wrapper which takes into account the “maturity” of the underlying pod when wrapping and unwrapping. The different maturities are reduced to a standard unit called a “slot” (see “Key assumption” below). Create a Uniswap pool for the wPOD (wrapped Pod) token. This allows the market to put a price on these “slots.”

### Key assumption
In order to wrap Pods in a fungible token, we use a unit called a slot which represents the cost of waiting one spot in the queue for one Pod. For example, when wrapping a plot of 10 Pods whose places in the queue are #100–#109, this plot would bear a cost of 1045 slots. We make the simplifying assumption that all slots are equal in value.
