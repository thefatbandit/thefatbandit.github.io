---
recent: false
title: "Portfolio VaR"
date: 2022-02-01T09:00:00+05:30
description: VaR for a portfolio of assets, with marginal, incremental and component VaR, and the diagonal and beta models
menu:
  sidebar:
    name: Portfolio VaR
    identifier: frm-portfolio-var
    parent: frm
    weight: 18
hero: images/cover.jpg
tags: ["Finance","FRM"]
categories: ["Finance"]
math: true
---

Each component asset of a portfolio is called a Risk Factor. The corresponding asset weight is our linear exposure.

## Undiversified VaR

It's the summation of the VaRs of all the individual assets in a portfolio.

$$
\text{Undiversified VaR} = \sum VaR_i
$$

Now for the portfolio standard deviation ($\sigma_p$):

$$
\sigma_p < \sum_{i=1}^{N}\sigma_i\\
\sigma_p^2 = \sum_{i=1}^{N}\sigma_i^2 + \sum \sum_{i<j} 2cov(r_i,r_j)
$$

For a portfolio:

$$
R_P=w^TR
$$

where:

- $R[N*1]$: Vector of expected returns (based on past returns/prediction)
- $w[N*1]$: Vector of asset weights in the portfolio

Now for the Portfolio Standard Deviation ($\sigma_p$)

$$
\sigma_p^2=w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\sigma_{12}\\
\implies \sigma_p^2=w^T\Sigma w
$$

$$
\begin{bmatrix}
w_1 & w_2
\end{bmatrix} \begin{bmatrix}
\sigma_{1}^2 & \sigma_{12}\\
\sigma_{12} & \sigma_{2}^2
\end{bmatrix} \begin{bmatrix}
w_1\\
w_2
\end{bmatrix}
$$

Where:

- $\Sigma[N*N]$: Variance-covariance matrix

But this risk is in terms of the weights. To convert it into monetary risk, we multiply both sides by the square of the total wealth invested in the portfolio ($W$):

$$
W^2\sigma_p^2=a^T\Sigma a
$$

Where:

- $a_i$: Wealth invested in asset $i$. ($w_i=\frac{a_i}{W}$)

Assuming ***portfolio returns follow a Normal distribution***:

$$
VaR=WZ\sigma_p=Z\sqrt{a^T\Sigma a} = WZ\sqrt{w^T\Sigma w}
$$

Where:

- $Z$: z-value corresponding to the Confidence Level (CL)

> ❓ Which position should be altered to modify $VaR_P$ most effectively?

## Marginal VaR (MVaR)

It measures the effect of changing the asset weights/amount invested on the $VaR_P$.

$$
MVaR=\frac{\partial\ VaR_P}{\partial \ a_i}
$$

For a 2 asset portfolio:

$$
\sigma_{p}^2 = w^T\Sigma w\\
\therefore \frac{\partial\ \sigma_{p}^2}{\partial w_1} = 2w_1\sigma_{1}^2 + 2w_2\sigma_{12}\\
\frac{\partial\ \sigma_{p}^2}{\partial w_2} = 2w_2\sigma_{2}^2 + 2w_1\sigma_{12}
$$

$$
\begin{Bmatrix}
\frac{\partial}{\partial w_1}\sigma_p^2\\
\frac{\partial}{\partial w_2}\sigma_p^2
\end{Bmatrix} = 2\begin{bmatrix}
\sigma_1^2 & \sigma_{12}\\
\sigma_{12} & \sigma_2^2
\end{bmatrix} \begin{Bmatrix}
w_1\\ w_2
\end{Bmatrix}
$$

From the above, we can infer that:

$$
\frac{\partial\ \sigma_p^2}{\partial\ w}=2\Sigma w\\
\implies 2\sigma_p(\frac{\partial\ \sigma_p}{\partial\ w}) = 2\Sigma w
$$

Thus the change in $\sigma_p$ w.r.t. the weights is:

$$
\frac{\partial\ \sigma_p}{\partial\ w}=\frac{\Sigma w}{\sqrt{w^T\Sigma w}}=\frac{W\Sigma w}{\sqrt{(Ww)^T\Sigma (Ww)}}=\frac{\Sigma a}{\sqrt{a^T\Sigma a}}
$$

Therefore the change in portfolio VaR is:

$$
\frac{\partial\ }{\partial\ a}VaR_P = \frac{\partial\ }{\partial\ a}WZ\sigma_P=WZ\frac{\partial\ \sigma_p}{\partial\ a}\\
\implies \frac{\partial\ }{\partial\ a}VaR_P = Z\frac{\Sigma a}{\sqrt{a^T\Sigma a}} = Z\frac{\Sigma w}{\sqrt{w^T\Sigma w}}
$$

## Incremental VaR

When we change the internal asset allocations of a portfolio ($\Delta P$).

Using Taylor series expansion:

$$
VaR_{P+\Delta P} = VaR_{P} + \frac{\partial\ VaR_P}{\partial a}\Delta P +\ \text{(Higher order ignored terms)}\\
\implies VaR_{P+\Delta P} - VaR_{P} = (\frac{\partial\ VaR_P}{\partial a})^T\cdot \Delta P
$$

**Assumption:** $\Delta P \ll P$

### Changing Portfolio VaR

1. Reducing $VaR_P$ → Reduce the position whose marginal VaR is the highest
2. Increasing $VaR_P$ → Depends on a variety of conditions

## Component VaR (Comp. VaR)

Helps to decompose the total portfolio risk ($VaR_P$) into the contribution of each component asset/risk factor.

$$
\text{Comp. VaR} = MVaR_P\cdot a_i\\
= \frac{\partial\ VaR _P}{\partial\ a_i}\cdot a_i
$$

The sum of all the component VaRs should be equal to the overall portfolio VaR:

$$
\sum \text{Comp. VaR} = VaR_P
$$

## Problems with Portfolio VaR Calculations

We'll have to calculate the variance-covariance matrix (total $\frac{N^2-N}{2}+N$ terms)

$$
\Sigma = \begin{bmatrix} \sigma_1^2 & \sigma_1\sigma_2 & \sigma_1\sigma_3\ ... \\
\sigma_2\sigma_1 & \sigma_2^2 & \ ...\\
... & ... & ...\\
... & ... & \sigma_n^2
\end{bmatrix}
$$

So we try to club all the individual asset risk factors into a smaller set without losing significant information about the risk trends.

### Diagonal Model

$$
\sigma_p^2=\beta_p^2\sigma_m^2 + w^\intercal D_e w
$$

#### Derivation

We initially find the variance-covariance matrix of the individual assets. We then follow the capital asset pricing model.

> 💡 **Capital Asset Pricing Model (CAPM)**<br>
> $R_i=r_f+\beta_i(R_m-r_f) + e_i$<br>
> Where:<br>
> $\beta$: Systematic Risk (Exposure of the $i^{th}$ asset to the market factor)

We assume that:

1. $E(e_i)=0$ (Sum of all errors is 0)
2. $E[(R_m-r_f),e_i]=0$ (Returns & error are uncorrelated)
3. $E(e_i,e_j)=0$ (errors within the assets are uncorrelated)

Taking the variance on both sides of CAPM:

$$
\sigma^2(R_i-r_f)=\beta_i^2\sigma_m^2 + \sigma_{e_i}^2+2\beta_i cov[(R_m-r_f),e_i]
$$

Since $E[(R_m-r_f),e_i]=0$, each of the variances in our variance-covariance matrix ($\Sigma$) can be computed this way:

$$
\sigma^2(R_i-r_f)=\beta_i^2\sigma_m^2 + \sigma_{e_i}^2
$$

For the covariances:

$$
cov[(R_i-r_f),(R_j-r_f)]=cov[\{\beta_i(R_m-r_f) + e_i\},\{\beta_j(R_m-r_f) + e_j\}]\\
\sigma_{ij}=\beta_i\beta_j\sigma_m^2
$$

$$
\begin{bmatrix} \sigma_1^2 & \sigma_1\sigma_2 & \sigma_1\sigma_3 &\ ...\\
\sigma_2\sigma_1 & \sigma_2^2 & \ ...&\ ...\\
... & ... & ... &\ ...\\
... & ... &\ ...&\sigma_n^2
\end{bmatrix} = \begin{bmatrix}
\beta_1^2 & \beta_1\beta_2 & \beta_1\beta_3&\ ... \\
\beta_2\beta_1 & \beta_2^2 & \ ...&\ ...\\
... & ... & ...&\ ...\\
... & ... &\ ... & \beta_n^2
\end{bmatrix}\sigma_m^2 + \begin{bmatrix}
\sigma_{e_1}^2 & & \\
& \sigma_{e_2}^2 & \\
& & \ddots \\
& & & \sigma_{e_n}^2
\end{bmatrix}
$$

This implies that:

$$
\Sigma=\beta\beta^\intercal\sigma_m^2 + D_e
$$

Now we know that $\sigma_p^2=w^\intercal\Sigma w$

$$
\sigma_p^2=(w^\intercal\beta)\cdot(\beta^\intercal w)\sigma_m^2 + w^\intercal D_ew
$$

Since the portfolio beta is written as $\beta_p=w^\intercal\beta$,

$$
\sigma_p^2=\beta_p^2\sigma_m^2 + w^\intercal D_e w
$$

### $\beta$ Model

For larger portfolios, the 2nd term starts diminishing due to the smaller weights in a diversified portfolio. This leads to the statement that ***"non-systematic risk can be diversified away"***

$$
\sigma_p^2\simeq \beta_p^2\sigma_m^2
$$

### VaR for the $\beta$ model

$$
VaR_p=W_0Z(w^\intercal\beta)\sigma_m
$$

---

<small>Cover photo by Tyler Prahm on [Unsplash](https://unsplash.com/photos/lmV3gJSAgbo).</small>
