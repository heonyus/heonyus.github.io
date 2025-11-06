---
layout: post
title: "Concept Bottleneck Models(2020)"
date: 2025-11-04
description: "Concept Bottleneck Models"
tags:
  - XAI
---
# Introduction

저자들은 high-level concepts 단위로 model과 interaction하고 싶다는 실무적인 요구에서 해당 논문을 작성하기 시작했습니다.
기존의 classification methods에서는 input($x$)이 해당 model을 통과했을떄 output(label; $y$)을 바로 예측하는 end-to-end architecture를 사용합니다.
이렇게 되면 $x \to y$로 바로 학습되어 사람이 다루는 실질적인 concept를 직접 조작하고 개입하는 것이 어려워집니다.
그래서 저자들은 Concept Bottleneck Model을 제안하여 사람이 다루는 실질적인 concept를 직접 조작하고 개입하는 것을 가능하게 합니다.

## Core Idea

training시 제공되는 concept vector $c$를 bottleneck으로 먼저 predict하고 해당 concept vector를 이용해서 output label $y$를 예측하는 구조를 사용합니다. (**concept bottleneck model; CBM**)
train data shape은 ($x$, $c$, $y$)이고 test 단에서는 $x$로부터 predict된 concept vector $\hat{c}$를 만들고 이를 이용해 $\hat{y}$를 산출합니다.

<img src="https://i.imgur.com/6Eq7ZsE.png" alt="Figure 1" width="400" referrerpolicy="no-referrer">

해당 structure은 concept value를 편집해 최종적인 output을 바꾸는 개입(test-time intervention)을 가능하게 합니다.

test-time intervention은 후술!

# Method
## Problem Setup & Bottleneck

train data는 $(x^i, c^i, y^i)$ 이며 $x^i \in \mathbb{R}^d$, concept vector $c^i \in \mathbb{R}^k$, target $y^i \in \mathbb{R}$ 입니다.
model은 두 함수의 합성으로 정의됩니다.

$$
\hat{y}=f(g(x)), \qquad g: \mathbb{R}^d \to \mathbb{R}^k(x \to c), \qquad f: \mathbb{R}^k \to \mathbb{R}(c \to y)
$$

핵심은 prediction이 전적으로 $c$ bottleneck을 경유한다는 점입니다.
$g$는 component-wise(성분별)로 사람이 정의한 concept $c$에 align되도록 training됩니다.
task accuracy는 $f(g(x))$의 output을 얼마나 잘 예측했는지 그리고 concept accuracy는 $g(x)$의 $c$를 얼마나 잘 예측(concept별 평균)했는지 측정합니다.

## Loss Functions and Training Schemes

concept loss $\mathcal{L}_{c_j}$, label loss $\mathcal{L}_{y_i}$를 두고 다음 세가지 학습방