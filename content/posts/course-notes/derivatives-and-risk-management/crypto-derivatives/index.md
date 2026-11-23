---
recent: false
title: "Cryptocurrency Derivatives Pricing"
date: 2022-04-16T09:00:00+05:30
description: Pricing Bitcoin futures with the cost-of-carry model, and the problem of finding a risk-free rate for Bitcoin
menu:
  sidebar:
    name: Crypto Derivatives
    identifier: drm-crypto
    parent: drm
    weight: 26
hero: images/cover.jpg
tags: ["Finance","DRM"]
categories: ["Finance"]
math: true
---

## Bitcoin Futures Pricing

- They offer cash settlement instead of physical delivery of Bitcoin (Chicago Mercantile Exchange, CME).
- The cost-of-carry model is used to price the futures.

$$
BTC_{Futures}=BTC_{Spot}\cdot [1+r_f\cdot(\frac{x}{365})]
$$

Where:

- $x$: Number of days to expiry

### Risk-Free Rate $(r_f)$ for Bitcoin

#### Problems

- Traditional currencies have government bonds associated with them; crypto has no such reliable authority.
- Passively holding BTC does not provide any coupon/dividend.

#### Possible Solutions

- We can use the BTC lending rates offered by major crypto exchanges like Binance and Celsius, which had negligible defaults. *(Written in April 2022. Celsius froze withdrawals and filed for bankruptcy that July, which shows the limits of this approach.)*
- We can use the regulated derivatives market (provided by CME) to approximate $r_f$.

---

<small>Cover photo by Shutter Speed on [Unsplash](https://unsplash.com/photos/rEoBwI7hNCU).</small>
