---
recent: false
title: "Introduction"
date: 2022-01-12T09:00:00+05:30
description: Risk as volatility, continuous compounding, log returns, annualised standard deviation, and hedgers versus speculators
menu:
  sidebar:
    name: Introduction
    identifier: drm-intro
    parent: drm
    weight: 10
hero: images/cover.jpg
tags: ["Finance","DRM"]
categories: ["Finance"]
math: true
---

## Risk

Risk is based on the volatility of a financial instrument.

> 💡 In risk, we are not considering the real value of the money but the actual amount of money held.<br>
> **E.g.** If we hold ₹100/- today, we'll still have ₹100/- down the line, even though the real value of that ₹100/- may be lower due to inflation. We'll still say this is risk free.

- ***Standard Deviation*** is a measure of risk. It is also known as volatility.

## Continuous Compounding of Interest Rate

$$
P(t) = P_0\cdot e^{rt}
$$

Where:

- $P(t)$ = Value after time $t$
- $P_0$ = Initial Investment
- $r$ = Nominal Return Rate
- $t$ = Time Period

Since we're compounding more frequently with a continuously compounded rate, its return rate should be lower than the discrete annual return rate, so that we get the same investment amount at the end of the year:

$$
e^{R_c}=(1+\frac{R_m}{m})^m\\
\Rightarrow R_c = m\cdot \ln(1+\frac{R_m}{m})\\
\Rightarrow R_m=m\cdot (e^{\frac{R_c}{m}}-1)
$$

## Derivative Returns

$$
Return\ (r) = \ln(\frac{P_1}{P_0}) = \ln(\frac{FV}{PV})
$$

Where:

- $P_1 = FV$ = Future Value
- $P_0 = PV$ = Present Value

## Standard Deviation of a Sample

$$
\sigma^{2}_{n} = \frac{\sum(R_i-\bar{R})^2}{n-1}\\
\sigma_n = \sqrt{\sigma_n^2}\\
where\ R_i=\ln(\frac{P_t}{P_{t-1}})
$$

For the annualised standard deviation:

$$
\sigma_{n_{(annualized)}} = \sigma_n \cdot \sqrt{252}
$$

Where:

- 252 is the number of days the asset is traded in a year (NSE is open about 252 days).

## Hedgers & Speculators

### Hedgers

The parties actually exposed to price risk, who enter into a derivative contract to protect themselves against that risk.

### Speculators

They are not exposed to the price risk of the underlying asset, but still enter into a derivative contract to make a profit.

> 💡 Derivative contracts are usually of the **Hedger ↔ Speculator** format.<br>
> **Hedger ↔ Hedger** contracts are next to impossible.

---

<small>Cover photo by Andy Kennedy on [Unsplash](https://unsplash.com/photos/yoWhcUooqxM).</small>
