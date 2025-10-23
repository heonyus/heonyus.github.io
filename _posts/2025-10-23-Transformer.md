---
layout: post
title: "Attention is all you need (2017)"
date: 2025-10-23
category: Deep Learning
tags: [Deep Learning, Transformer]
---

# Attention is all you need

## 1. Introduction
기존의 recurrent 모델들(LSTM, GRU)은 현재 시점($t$)의 hidden state($h_t$)가 이전 시점($t-1$)의 hidden state($h_{t-1}$)와 현재 위치의 input token($x_t$)에 의존한다. 앞 단계 연산이 끝나야 다음 단계를 할 수 있기 때문에 당연히 병렬화가 안된다. 입력되는 sequence token의 길이가 늘어나면 늘어날 수록 계산 순서 단계가 늘어나서 속도가 저하된다. 그리고 길어진 sequence 때문에 중간 단계(각 지점의 $h_t$)와 기울기를 다 저장 해야하기에 memory도 많이 먹고 memory가 꽉 차면 batch size 키우기 어려워서 학습 효율이 더욱 안좋아진다.

## 2. Background
이전 연구인 ConvS2S, ByteNet 등에서 convolution을 사용해 병렬 연산(layer 내부 위치들 간에서만만)을 했는데 convolution은 한 layer에서 주변에 kernel 크기$k$ 만큼만 볼 수 있기에 두 token 사이의 거리를 연산하기 위해서 거리가 멀다면 여러 layer를 차례로 거치며 계산해야한다.

<div align="center">
  <img src="https://i.imgur.com/wJoEYwq.png" alt="Background_1" style="width:50%; min-width:240px; max-width:100%;">
</div>

하지만 Transformer의 self attention mechanism에서는 한 layer에서 모든 token들이 서로 직접 참고하기 때문에 두 token 사이의 필요한 연산(연속된 layer)의 수가 1 즉, 상수가 된다.

<div align="center">
  <img src="https://i.imgur.com/YMZBpOW.png" alt="Background_2" style="width:50%; min-width:240px; max-width:100%;">
</div>

## 3. Model Architecture

<div align="center">
  <img src="https://i.imgur.com/hk7EBo5.png" alt="Model_Architecture_1" style="width:30%;">
</div>

### 3.1 Encoder and Decoder Stacks

<div align="center">
  <img src="https://i.imgur.com/ZFdKMyV.png" alt="Model_Architecture_1" style="width:20%;">
</div>

- Encoder
  - encoder는 $N=6$인 동일한 layer stack으로 구성된다. 각 layer는 두 개의 sub layer를 가진다. 첫번째로는 **multi head self attention mechanism** 그리고 두번째는 **position-wise fully connected feed-forward network**이다. 이 두 sub layer에 대해서 **residual connection**을 적용하고 그 뒤에 **layer normalization**을 적용한다.
  - 즉, $LayerNorm(x + Sublayer(x))$ 그리고 본 논문에서는 residual connection($x + Sublayer(x)$)을 이용하기 위해 두 tensor의 차원을 512로 맞춰준다.

<div align="center">
  <img src="https://i.imgur.com/UmXYniO.png" alt="Model_Architecture_1" style="width:20%;">
</div>

- Decoder
  - decoder는 $N=6$인 동일한 layer stack으로 구성된다. min-width:240px; max-width:100%;">
</div>

- Decoder
  - decoder 또한 $N=6$인 동일한 layer stack으로 구성된다. decoder는 각 encoder layer의 두 개의 sub layer 외에도 encoder stack의 output에 대해 multi head attention mechanism을 수행하는 세 번째 sub layer를 삽입한다.