---
title: "Value At Risk (VaR)"
date: 2022-01-18T09:00:00+05:30
description: Explaining what VaR is & its calculation for various financial instruments
menu:
  sidebar:
    name: VaR
    identifier: frm-var
    parent: frm
    weight: 12
hero: images/dice.jpg
tags: ["Finance","FRM"]
categories: ["Finance"]
math: true
---

It’s a statistical measure of potential loss. This is the amount we should be prepared to cover for.

VaR is the worst loss, over a target horizon, such that there is a low pre-specified probability that the actual loss will be higher.

$$
P(l>VaR)\leq 1-C
$$

where $P(l\leq VaR)= C$

## Discrete Example of calculating VaR
<!-- To Generate Tables: https://www.tablesgenerator.com/html_tables# -->
<table align="center" class="tg">
<thead>
  <tr>
    <th class="tg-ibgh">Gains</th>
    <th class="tg-ibgh">Prob</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-sjd2">10 Cr</td>
    <td class="tg-sjd2">98%</td>
  </tr>
  <tr>
    <td class="tg-2bvr">-2 Cr</td>
    <td class="tg-2bvr">1.5%</td>
  </tr>
  <tr>
    <td class="tg-sjd2">-5 Cr</td>
    <td class="tg-sjd2">0.5%</td>
  </tr>
</tbody>
</table>
{{< vs 4>}}
$\text{Expected Gain}\ E(G) = (0.98\ast10) - (0.015\ast2) - (0.005\ast5)$

<u>**Absolute VaR:**</u> The min. loss which has a X% prob. of getting a higher loss than OR (1-X)% of getting a lower loss

<u>**Relative VaR (*to the expected value*):**</u> Is the distance between the Expected Gains & Absolute VaR

Here for ***99% VaR***:

- <u>Absolute VaR</u>= 2 Cr (1% CDF is contained withing this loss)
- <u>Relative VaR</u>= 11.745 Cr

## Continuous Example of VaR

1. A uniform distribution between the gains [-30,70].

{{< img src="/posts/Notes/Financial Risk Modeling/VAR/images/cont.jpg" height="400" width="600" align="center">}}
    
{{< alert type="warning" >}} 💡 $z=\frac{x-\mu}{\sigma}$ {{< /alert >}}


2. Normal Distribution X~[25,100], 99.9 VaR
- Expected Gains= 25

For VaR calculations:

$$
P(x>k)=P(\frac{x-25}{30}>\frac{K-25}{30})=99.9\%\\
\implies P(z>\frac{K-25}{30})=0.999
$$

Now the value corresponding to 0.001 (.1% area to the left) is -3.1 as inferred by the z-table.

$$
\therefore z>-3.1\\
\implies \frac{K-25}{30}>-3.1\\
\implies K=-68
$$

- <u>**Absolute VaR**</u>= -68
- <u>**Relative VaR**</u>= 25 - (-68) = 93

## VaR for a Stock

Process:

- Mark to market our current exposure $[W_0]$
- Set the time horizon $[1\ day]$
- Get $\sigma$ of the underlying risk factor $[Returns]$
    
{{< alert type="warning" >}}
💡 **Jarque-Bera Test of Normality**

$JB=[\frac{Skew^2}{6}+\frac{(kurt-3)^2}{24}]=\chi^2_{2DoF}$
   
where:
1. $\sigma=\sqrt{\frac{\sum(x-\bar{x})^2}{n-1}}$ for a ***sample with population “n”***

2. $Skew=\frac{1}{N-1}\sum \frac{(x_i-\bar{x})^3}{\sigma^3}$ AND $Kurt=\frac{1}{N-1}\sum \frac{(x_i-\bar{x})^4}{\sigma^4}$ 

For a distribution to be normal
$JB>\chi^2_{crit}$
 {{< /alert >}}
    
- Assume a distribution of the risk factor
- Set a CL
- Report the worst loss

# VaR in terms of Returns

- **$R^\ast$:** Is the worst return for VaR
- **VaR (Abs):** $W_0 - W^\ast = W_0 - W_0(1 + R^\ast)= -W_0\cdot R^\ast = -W_0(\bar{R}+Z^\ast\sigma)$
    
    Here $W_0(1+R^\ast)$ is the ***Worst Asset Value Tomorrow***
    
- **VaR (Rel):** $W_0(1+\bar{R})-W^\ast=W_0[\bar{R}-R^\ast]=W_0[-Z^\ast\sigma]$
    
    Here $W_0(1+\bar{R})$ is the ***Tomorrow’s Expected Value***
    

# Time Aggregation of Returns

Let $R_i=$ Daily Returns

1. Assuming the markets to be efficient i.e.:
    - Prices follow Random Walk
    - Returns are uncorrelated over successive time intervals

Therefore $E(R_{annual})=\sum E(R_i)$

Now $Var(R_{annual})=Var(\sum R_i)$ 

{{< alert type="warning" >}}
💡 $Var(X_1+X_2)= Var(X_1) + Var(X_2) + CoVar(X_1,X_2)$
{{< /alert >}}

2. Assuming the Daily Returns to be Identically Distributed, 

Therefore, ***if the Daily Returns follow a Normal*** ~ $Dist(\mu, \sigma^2)$

Then for the returns for a time window of T days:

$$
R_{(T-Days)}\approx Dist(T\mu, T\sigma^2)
$$

## Empirical VaR (Non-Parametric VaR)

- Sort the gains/returns including the signs.
- Take the gain/returns that have 5% of data above them.
- This value is your sort of like your ***5% median*** types & is your ***95% VaR***

{{< alert type="warning" >}}
💡 Non-Parametric VaR doesn’t assume any distribution for your data.
{{< /alert >}}

## Correlated Returns Over Time

In these we assume that

$$
R_t=\rho R_{t-1} + \epsilon_t
$$

Then for some returns

$$
R_2=\rho R_{1} + \epsilon_2\\
|||^{ly}\ R_3=\rho R_{2} + \epsilon_3\\
\Rightarrow R_3 = \rho^2 R_{1} + \rho\epsilon_2 + \epsilon_3\\
|||^{ly}\ R_4 = \rho^3 R_1 + f_4(\epsilon)
$$

So for the variance of these returns, i.e. $V(R_1+R_2+R_3+R_4)=V(\sum_{i=1}^{4}R_i)$

$$
V(\sum_{i=1}^{T}R_i) = \sigma^2[T + 2(T-1)\rho + 2(T-2)\rho^2 + 2(T-3)\rho^3\ ...\ 2\rho^{T-1} ]
$$

Since $\rho<1$, we need not calculate beyond a few terms here since the terms start diminishing quickly.

# Conditional VaR (Expected Shortfall)

VaR asks how bad things can get (with a 95% confidence). Conditional VaR ***answers the questions “What is the expected loss if things get bad?”*** i.e.

$$
CVaR=R^{**}=E(R|R<R^*)
$$

## Worked Example

{{< split 6 6>}}

<table align="center" class="tg">
<thead>
  <tr>
    <th class="tg-ibgh">Value</th>
    <th class="tg-ibgh">P(Value)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-sjd2">-20</td>
    <td class="tg-sjd2">0.0004</td>
  </tr>
  <tr>
    <td class="tg-2bvr">-11</td>
    <td class="tg-2bvr">0.014</td>
  </tr>
  <tr>
    <td class="tg-sjd2">-11</td>
    <td class="tg-sjd2">0.014</td>
  </tr>
  <tr>
    <td class="tg-baqh">-2</td>
    <td class="tg-baqh">0.49</td>
  </tr>
</tbody>
</table>

---
{{< vs 2>}}
So now the 97.5% VaR = 11 Cr

So for 97.5% CVaR

$$CVaR = \frac{20 \ast 0.004 + 11 \ast (0.025-0.004)}{0.025}\ = 12.44$$

{{< /split >}}

## CVaR for a Normal Distribution
{{< split 6 6>}}

Since $CVar=E(R|R<R^*)$, using bayes theorem where $[R\sim N(\mu,\sigma)]$:

$$CVaR=\frac{\int_{-\infty}^{R^\ast}rP(r)dr}{P(R<R^\ast)}$$

---

Thus our conditional return value would be where $[Z\sim N(0,1)]$:

$$CZ=\frac{\int_{-\infty}^{Z^\ast}zP(z)dz}{F(Z<Z^\ast)}$$

{{< /split >}}

{{< vs 4 >}}
If CL=95%, then $F(Z<Z^*)=1-CL$

$$CZ=\frac{\int_{-\infty}^{Z^*}zP(z)dz}{1-CL}$$

{{< vs 4 >}}
{{< split 6 6>}}

Z being a normal distribution:

$$P(z)=\frac{1}{\sqrt{2\pi}}e^{-\frac{z^2}{2}}$$

---

Solving for this value of $P(Z)$ {Hint: Use $-z^2/2=y$}

$$CZ = \frac{-\frac{1}{\sqrt{2\pi}}e^{-\frac{z^2}{2}}|_{-\infty}^{Z^\ast}}{1-CL}\\
\implies CZ=\frac{-\frac{1}{\sqrt{2\pi}}e^{-\frac{(Z^\ast)^2}{2}}}{1-CL}$$

{{< /split >}}

{{< alert type="warning" >}}
💡 CVaR always follows the sub-additivity property.
But if the $R\sim N$, then all $\sigma$, $VaR$, $CVaR$ hold true
{{< /alert >}}

# Precision VaR (P% Confidence)

## 1. Bootstrapping VaR

For a dataset with 5000 data values:

1. Sample (with replacing)
2. Get mean, variance & C% VaR
3. Repeat steps 1-2 some (say 10K) times

We now get a sample of VaR (10K datapoints).

- Make a distribution of these VaR

### 2. Mean for Bootstrapped Dataset

The mean of the bootstrapped Dataset $(\bar{\bar{x}})$, is assumed to follow the normal distribution here

$$
\bar{x}\sim N(\bar{\bar{x}},\frac{s}{\sqrt{n}})
$$

### 3. Standard Deviation for Bootstrapped Dataset

In a bootstrapped dataset, the standard distribution $(s)$ follows:

$$ \frac{(T-1)s^2}{\sigma^2}\sim \chi^2 $$

As $T\to \infty$

$$
s^2 \sim N(\sigma^2,\sigma^2\sqrt{\frac{2}{T-1}})\\
\Rightarrow s \sim N(\sigma,\frac{\sigma}{\sqrt{2T}})
$$

The returns & standard deviation of the bootstrapped dataset will be:

$$
\bar{r} \sim N(\bar{r}, \frac{s}{\sqrt{T}})\\
s \sim N(s, \frac{s}{\sqrt{2T}})
$$

Now the VaR is $W_0Z\sigma$

Now the Z here is from the C% confidence value that comes from our input $(Z_c)$. 

So now the VaR is:

$$
VaR=W_0Z_c\sigma\\
\Rightarrow VaR = W_0Z_c(s\ \pm\ Z_p\frac{s}{\sqrt{2T}})
$$

Where:

- $W_0$: The initial cost
- $Z_c$: The Z-Score corresponding to %VaR
- $s$: Standard Deviation of the Dataset
- $Z_p$: The Z-Score corresponding to confidence Score