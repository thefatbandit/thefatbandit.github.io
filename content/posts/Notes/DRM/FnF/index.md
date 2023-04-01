---
title: "Forwards and Future Contracts"
date: 2022-01-14T08:00:00+05:30
description: 
menu:
  sidebar:
    name: Forwards & Futures
    identifier: drm-fnf
    parent: drm
    weight: 12
hero: images/FnF.jpg
tags: ["Finance","DRM"]
categories: ["Finance"]
math: true
---
[Futures Data.xlsx](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4675cb68-d5d9-4c01-a885-21192f4a5c2d/Futures_Data.xlsx)

## Forward Contract

### Contract Farming

Contract farming can be defined as **agricultural production carried out according to an agreement between a buyer and farmers**, which establishes conditions for the production and marketing of a farm product or products. Typically, the farmer agrees to provide agreed quantities of a specific agricultural product.

#### Why is the farmer entering into the contract?

The farmer fears drop in prices they fix a price to ensure certain profits.

#### Why is the company entering into the contract?

The company fears a lack of supply & rising prices so fixes on a somewhat fixed price.

### Nomenclature

- $F_{0_T}$: The fixed price set in the contract at the end of the maturity period $T$.
- $Spot_T$: The market price at the end of maturity period $T$.

{{< alert type="warning" >}}
💡 Gain of one party = Loss of the other party
It’s a ***zero-sum gain*** where in aggregate, the parties are at no loss.
{{< /alert >}}

### Long Vs. Short Forward Position

{{< split 6 6 >}}

#### Asset Ownership

**Long Forward Position:** The party that owns the assets

**Short Forward Position:** The party that is “short” on the assets

---

#### Forwards Contract

**Long Forward Position:** The party that buys the underlying goods

**Short Forward Position:** The party delivering the underlying goods.

{{< /split >}}
#### Exercise

A party ___________ on an underlying asset fears _______ price. It will mitigate the risk by taking a _______ position in forwards/futures market.

<details><summary><b><i><u>Solution</u></i></b></summary>
{{< alert type="secondary" >}} 
- Long, Price Dec., Short
- Short, Price Inc., Long
{{< /alert >}}
</details>

### Counter-party/ Default Risk

The party which is incurring loss, has a propensity to default.

## Futures Contract

Sell/Deliver the goods through an ***exchange traded*** contract. There is no counter-party risk. These are standardised contracts.

Some features of futures contract:

1. There is a fixed delivery location.
2. The product has certain quality requirements (with a degree of tolerance).
3. The ***commodity supplier*** approaches the exchange taking a ***short futures position*** at a certain price to be delivered within a maturity date.
4. The ***commodity buyer*** approaches the exchange taking a ***long futures position*** at a certain price to be delivered within.
5. Once an agreement on the trade is made between buyer & supplier. Then ***novation*** of contracts occurs.
    
{{< alert type="warning" >}}
💡Novation is **the replacement of one of the parties in an agreement between two parties**, with the agreement of all three parties involved. To novate is to replace an old obligation with a new one.
{{< /alert >}}
    
6. So the exchange now takes care of counter-party risk

#### Indian Commodity Exchanges

- MCX
- NCDEX

## How is the risk mitigated?

The exchange contracts have a ***margin*** (an amount the buyer/seller has to pay before the contract)

## Margins

1. **Initial Margin:** The percent of a purchase price that must be paid with cash when using a margin account. ***Paid by both parties***. Kind of like caution money.
2. **Mark-to-Market (MTM) Margin:** It’s the difference between our initial price and the settling price each day. It may be ***+ve*** in which case ***we receive the margin***. If the margin is ***-ve***, ***we pay the margin***.

### Stock Futures

{{< img src="images/stock_future.jpg" align="center">}}

- **Close Price:** The weighted average price of the stocks traded in the last 30 mins of spot market.
- **Settle Price:** The weighted average price of the stocks traded in the last 30 mins of futures market.
- **Lot Size:** The no. of stocks that will be bought on the expiry date. It’s a measure of the liquidity of the stock’s futures contract.
- **Open:** The decided price of the 1st contract
- **Open Interest (*applicable on derivative contracts only*):**  OI is the total number of outstanding derivative contracts that have not been settled. Consider only 1 of long/short futures positions.
- **Change in Open Interest**
    
{{< alert type="warning" >}}
💡 Open Interest is always +ve. but Change in OI can be -ve
{{< /alert >}}  

### Open Interest Calculations

**Eg.-** 

| Time | Long Futures Position | Lot Amount | Short Futures Position | Lot Amount | Open Interest |
| --- | --- | --- | --- | --- | --- |
| 9:30 | A | 25   | X | 25 | 25 |
| 10:00 | C | 75  25 | D | 75  50 | 100 |
| 12:00 | E | 100 | F | 100 | 200 |
| 12:20 | L | 50 | C | 50 | 200 |
| 12:20 | M | 25 | N | 25 | 225 |
| 2:25 | D | 25 | A | 25 | 200 |

#### Open Interest Trends

- When ***2 new parties*** enter into a futures contract, ***open interest increases***.
- When ***only 1 existing contract party*** enters into a contract with a new party, ***open interest remains the same***.
- When ***2 existing contract parties square off*** each other’s contract, the ***open interest decreases***.

### What Happens if we don’t meet a margin call?

Your broker will pay your margin. They will do so through closing your other open positions. And if the broker themselves are not able pay it, the exchange uses their ***settlement guarantee fund*** it has to square off the margin call.

## Practice

{{< img src="images/prac.jpg" >}}

<details><summary><b><i><u>Solution</u></i></b></summary>
{{< alert type="secondary" >}} 
Being in a short position, we’ll incur losses if the prices increase.
But to maintain our maintenance margin, the max. loss we can incur before a margin call is 1000$ (Initial-Maintenance Margin). 
For 5000 ounces, this amounts to 0.2$ max rise per ounce.
{{< /alert >}}
</details>