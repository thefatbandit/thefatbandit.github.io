---
title: "Extreme Value Theory (EVT)"
date: 2022-01-24T08:00:00+05:30
description: Checking the validity of a VaR model
menu:
  sidebar:
    name: Extreme Value Theory
    identifier: frm-evt
    parent: frm
    weight: 14
hero: images/evt.jpg
tags: ["Finance","FRM"]
categories: ["Finance"]
math: true
---

Real-life data has fatter tails, that is a very high probability of shorter losses.

In EVT, we fit the distribution to only the tail of the data. It’s also called the semi-parametric method. Applicable ***only at the tails*** and for ***random variables >0***

{{< alert type="warning" >}}
💡 so we multiply the -ve returns with (-1) and fit it.
{{< /alert >}}

# Method

We have to fit a model to the tail of the dataset beyond a cutoff

1. Take the lowest 90% of the data.
2. Then find the 5% 


Let’s have a CDF for the losses

{{< img src="/posts/Notes/Financial Risk Modeling/EVT/images/cdf.jpg"float="left">}}

{{< vs 2>}}
So we now choose a value $u$, the values to the right of which, we fit the distribution to.

$$
P(u<L<u+y)=F(u+y)-F(u)\\
P(L>u)=1-F(u)
$$

where $y>0$.

{{< vs 4>}}
Now let y be a function of u:

$$
F_u(y)=P(u<L<u+y|L>u)\\
\Rightarrow F_u(y)=\frac{F(u+y)-F(u)}{1-F(u)}
$$

As $u \to \infty$

$$
F_u(y) \to G_{\xi, \beta}(y)=1-[1+\xi\cdot \frac{y}{\beta}]^{-1/\xi}
$$

Where $G$ is the ***Generalized Pareto Distribution***

In a GPD:

- $\xi$: Is the ***shape parameter*** & defines the fatness of the tails
- $\beta$: On the other hand is the ***scale parameter***

So the pdf for G is:

$$
g_{\xi, \beta}=\frac{1}{\beta}(1+\xi\cdot \frac{y}{\beta})^{-1/\xi -1}
$$

## Finding $\xi$ & Beta

$\xi\ \epsilon\ [0.1,0.3]$ 

1. Sort the returns in ascending order.
2. Take a return value $u$ such that cutoff %(say 10) of the data lies above it.
3. Take the Maximum Likelihood Function

### Maximum Likelihood Function

$$
\text{Max. Likelihood Function}:\ \pi[\frac{1}{\beta}(1+ \xi\cdot \frac{R_i-u}{\beta})^{-\frac{1}{\xi}-1}]
$$

Maximize $\sum \ln(l)$ w.r.t. $(\xi, \beta)$

# Finding VaR after GPD estimation

{{< img src="/posts/Notes/Financial Risk Modeling/EVT/images/var_gdp_est.jpg"float="right">}}

The VaR satisfies the following condition:

$$P(L>VaR)=[1-F(u)][1-G_{\xi, \beta}(VaR-u)]$$
$$1-CL=\frac{n_u}{n}[1+\xi\cdot \frac{VaR-u}{\beta}]^{-1/\xi}$$

Where:

- $n_u$: No. of datapoints above cutoff
- $n$: Total no. of datapoints

Thus VaR becomes:

$$VaR= u + \frac{\beta}{\xi}[(\frac{n}{n_u}(1-CL)^{-\xi})-1]$$

Similarly conditional VaR: 

$$CVaR=\frac{VaR+\beta+\xi u}{1-\xi}$$

## Choice of u

- $n$ should be large ~ 1000 data points
    - Approx 4 years of daily data
- At least 10%/100-datapoints (whichever is lower) of the total data should have -ve returns
- u should contain more than (C%) of data points where (1-C)% is the confidence level

# Time Aggregation of VaR

$$
\text{(T-day EVT VaR)} = T^{\xi}\cdot \text{(Daily EVT VaR)}
$$

Now:

- Daily EVT VaR > Daily ND VaR
- $\xi$ < 0.5

{{< alert type="warning" >}}
💡 So for values >10, the T-Day VaR is almost the same for EVT & ND.
{{< /alert >}}
