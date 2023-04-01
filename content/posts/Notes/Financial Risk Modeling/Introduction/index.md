---
title: "Introduction to Financial Risk"
date: 2022-01-18T08:08:00+05:30
description: 
menu:
  sidebar:
    name: Intro to Fin. Risk
    identifier: frm-intro
    parent: frm
    weight: 10
hero: images/forest.jpg
tags: ["Finance","FRM"]
categories: ["Finance"]
math: true
---

## Defining Risk
Risk is the probability of a loss.

## Financially Risky Decision
Some examples of risky decisions in finance:
- **Investment Options:** Where to invest in a financial instrument?
- **Debt/Equity Balances:** How much to invest in a financial instrument?

## Financial Risk Sources

Sources of these risk are mostly macro-economic sources like:
- Business cycles leading to changing interest rates
- Govt. Policies (Demonetization)
- Technological Changes (Crypto, FinTech)
- Wars & Natural Calamities

## Risk Management Steps

1. Identify the risk
2. Assessing & Measuring the risk
3. Monitoring & Mitigate the risk
    -  Using Cash/Savings
    -  Derivatives (covered in DRM)
    -  Share/Transfer(partially) risk through (re)insurance

## Types of Risk

### 1. Market Risk
Risk associated with relevant markets for the investments a company holds.

- **Equity/Commodity**
- **Exchange Rate:** If you are invested in foreign currencies
- **Interest Rate:** If you are invested in bonds

### 2. Liquidity Risk
The risk of your assets not being able to be sold.

### 3. Credit Risk
Risk of a debt being defaulted on by your creditors

### 4. Operational Risks
Risk associated with any of your operations:
- ATMs & Banks → Thefts
- Online Banking → Frauds

## Measures of Risk

- **Standard Deviation (Both upside/downside risk):** Avg. Dispersion around the mean.
- **Quantile (*Downside Risk*)**

## Properties of a good loss measure (Artzner)

- **Monotonicity:** A portfolio generating overall worse returns should be riskier.
$$[L(P)>L(Q)\Rightarrow R(P)>R(Q)]$$
- **Translation Invariant:** Adding cash to your portfolio should decrease risk.
$$[R(P + Cash)] < R(P) + Cash$$
- **Homogeneity:** The riskiness of a factor increases by a same factor as that of the principle.
$$[R(kP)=kR(P)]$$
- **Sub-Additivity:** This is called diversification effect.
$$[R(P+Q)<R(P)+R(Q)]$$