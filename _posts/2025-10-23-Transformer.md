---
layout: post
title: "Attention is all you need (2017)"
date: 2025-10-23
category: Deep Learning
tags: [Deep Learning, Transformer]
---


# 1. Introduction
기존의 recurrent 모델들(LSTM, GRU)은 현재 시점($t$)의 hidden state($h_t$)가 이전 시점($t-1$)의 hidden state($h_{t-1}$)와 현재 위치의 input token($x_t$)에 의존한다. 앞 단계 연산이 끝나야 다음 단계를 할 수 있기 때문에 당연히 병렬화가 안된다. 입력되는 sequence token의 길이가 늘어나면 늘어날 수록 계산 순서 단계가 늘어나서 속도가 저하된다. 그리고 길어진 sequence 때문에 중간 단계(각 지점의 $h_t$)와 기울기를 다 저장 해야하기에 memory도 많이 먹고 memory가 꽉 차면 batch size 키우기 어려워서 학습 효율이 더욱 안좋아진다.

# 2. Background
이전 연구인 ConvS2S, ByteNet 등에서 convolution을 사용해 병렬 연산(layer 내부 위치들 간에서만만)을 했는데 convolution은 한 layer에서 주변에 kernel 크기$k$ 만큼만 볼 수 있기에 두 token 사이의 거리를 연산하기 위해서 거리가 멀다면 여러 layer를 차례로 거치며 계산해야한다.

<div align="center">
  <img src="https://i.imgur.com/wJoEYwq.png" alt="Background_1" style="width:50%; min-width:240px; max-width:100%;">
</div>

하지만 Transformer의 self attention mechanism에서는 한 layer에서 모든 token들이 서로 직접 참고하기 때문에 두 token 사이의 필요한 연산(연속된 layer)의 수가 1 즉, 상수가 된다.

<div align="center">
  <img src="https://i.imgur.com/YMZBpOW.png" alt="Background_2" style="width:50%; min-width:240px; max-width:100%;">
</div>

# 3. Model Architecture

<div align="center">
  <img src="https://i.imgur.com/hk7EBo5.png" alt="Model_Architecture_1" style="width:30%;">
</div>

## 3.1 Encoder and Decoder Stacks

<div align="center">
  <img src="https://i.imgur.com/ZFdKMyV.png" alt="Model_Architecture_1" style="width:20%;">
</div>

- **Encoder**
  - encoder는 $N=6$인 동일한 layer stack으로 구성된다. 각 layer는 두 개의 sub layer를 가진다. 첫번째로는 **multi head self attention mechanism** 그리고 두번째는 **position-wise fully connected feed-forward network**이다. 이 두 sub layer에 대해서 **residual connection**을 적용하고 그 뒤에 **layer normalization**을 적용한다.
  - 즉, $LayerNorm(x + Sublayer(x))$ 그리고 본 논문에서는 residual connection($x + Sublayer(x)$)을 이용하기 위해 두 tensor의 차원을 512로 맞춰준다.

<div align="center">
  <img src="https://i.imgur.com/UmXYniO.png" alt="Model_Architecture_1" style="width:20%;">
</div>


- **Decoder**
  - decoder 또한 $N=6$인 동일한 layer stack으로 구성된다. decoder는 각 encoder layer의 두 개의 sub layer 외에도 encoder stack의 output에 대해 multi head attention mechanism을 수행하는 세 번째 sub layer를 삽입한다.
  - decoder stack에서 self attention sub layer를 수정해 특정 위치($i$)가 후속 위치를 참조하지 못하게 해야하기에 masking을 진행한다. 이 **masking**은 특정위치($i$)에 대한 예측이 $i$보다 작은 위치의 알려진 output에만 의존할 수 있도록 한다.

## 3.2 Attention

<div align="center">
  <img src="https://i.imgur.com/XyFLDBR.png" alt="Model_Architecture_1" style="width:50%;">
</div>

Attention은 "Query, Key, Value" 세 vector 집합을 input으로 받아 query마다 key와의 유사도(compatibility)에 따라 value들의 가중합을 계산해 출력으로 만드는 연산이다.
- Query(Q): “내가 지금 알고 싶은 것/찾는 조건”을 담은 질문 vector (현재 위치의 관심사; decoder에서 다음 token을 예측할 때의 context vector).$(Q=XW_Q)​$
- Key(K): “내가 가진 정보의 색인(tag)” vector (각 위치가 어떤 질문에 잘 맞는지 나타내는 신호' **검색 index**).$(K=XW_K​)$
- Value(V): “실제 내용물” vector (가져올 컨텐츠 자체; 출력으로 사용되는 내용).$(V=XW_V​)$
  - 여기서 $W_Q, W_K, W_V$는 학습되는 행렬(parameter), projection(선형변환환)
  - $X$는 tocken 별 hidden state

> 한 위치 $i$의 출력 $y_i$를 만들 때:

1. $i$의 질문$(Q_i)$와 모든 위치 $j$의 색인$(K_j)$를 비교해 유사도(호환도, compatibility)를 구함
   $$s_{ij} = \frac{Q_i \cdot K_j}{\sqrt{d_k}}$$
2. softmax로 가중치 $\alpha_{ij}$를 만들고
3. 그 가중치로 내용물$(V_j)$들을 **가중합**
   $$y_i = \sum_j \alpha_{ij} V_j$$

즉, 한 토큰$(i)$이 “내가 지금 필요한 정보는 이런 거야$(Q_i)$”라고 묻고, 모든 토큰$j$의 key와 대조해 “누가 내 질문에 잘 맞지?”를 점수 매긴 다음 맞는 애들의 내용$(V)$을 골고루 섞어온 게 $y_i$ 라는 뜻.

### 3.2.1 Scaled Dot-Product Attention

<div align="center">
  <img src="https://i.imgur.com/gUM0I6r.png" alt="Model_Architecture_1" style="width:30%;">
</div>

input은 차원 $d_k$의 query, key 그리고 차원 $d_v$ value로 구성된다. query와 모든 key의 내적을 계산하고 각각을 $\sqrt{d_k}​​$로 나눈 다음 softmax 함수를 적용해 값에 대한 가중치를 구한다.
여러 query를 한 번에 묶은 $Q$와, 모든 key/value를 묶은 $K, V$를 사용해 $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$를 **행렬연산으로 한 번에** 계산한다.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}} + \text{mask}\right) V
$$

각 쿼리와 모든 키의 내적을 한 번에 계산해 유사도 행렬을 만든다.

1. **유사도 계산(MatMul)**  $Q · Kᵀ$

   $$S = QK^\top$$

   (Query와 Key 행렬 곱, 크기: $T_q \times T_k$)

2. **스케일링(Scale)**  $ 1 / \sqrt{d_k}$  

    $$S' = S / \sqrt{d_k}$$

   (차원 $d_k$가 클수록 값이 커지므로, 이를 나눠서 안정화)

3. **마스킹(옵션)**  
   - **Causal Mask**: 디코더의 미래 토큰을 $-\infty$로 막아 정보 누설 방지  
   - **Padding Mask**: 패딩 위치도 $-\infty$ 처리

4. **정규화(Softmax)**  

   $$A = \mathrm{softmax}(S' + \text{mask})$$  

   (각 쿼리에 대해 Key별 가중치 분포, 행 합 1)

5. **값 합치기(Weighted sum)**  

   $$Y = AV$$  

  (가중치 $A$로 Value들 섞어서 최종 출력)

### 3.2.2 Multi-Head Attention

<div align="center">
  <img src="https://i.imgur.com/SfobXce.png" alt="Model_Architecture_1" style="width:30%;">
</div>

Scaled Dot-Product Attention을 하나의 head로 놓고 여러개의 head를 concat해 최종 output으로 만든다. 이때 논문에서는 여러개의 head(다른 시선; lends)를 만들기 위해 동일한 input을 서로 다른 방식으로 변환하기 위해 projection(선형변환) 했다고 한다.

$$
\begin{align*}
\text{MultiHead}(Q, K, V) &= \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O \\
\text{where, head}_i &= \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)
\end{align*}
$$

본 논문에서는 $h=8$의 병렬 attention layer(head)를 사용했다. <br>
여기서 주목해야할 점은 전체 모델의 차원은 $d_model=512$이고 head의 개수는 $8$개이므로 각 head가 $64$차원에서 계산을 한다는 것이다.

$$
d_k = d_v = \frac{d_{\text{model}}}{h} = \frac{512}{8} = 64
$$

멀티헤드는 “헤드 수를 늘리면서도” 각 헤드의 차원을 줄여 **총 계산량(시간, 메모리)이 싱글헤드와 비슷하게 유지되도록 설계**한 것, 이는 표현력은 더 풍부해지고 계산비용은 거의 그대로 된다는 이야기.

## 3.3 Position-wise Feed-Forward Networks
transformer의 각 encode와 decoder 층에는 위치별로 독립적으로 적용되는 fully connected feed forward network(FFN)가 포함되어 있다. 이 FFN은 두 개의 선형 변환 사이에 ReLU 활성화함수가 들어간 구조이다.
$$
\operatorname{FFN}(x) = \max(0, xW_1 + b_1) W_2 + b_2
$$

| 단계          | 연산                       | 차원 변화      | 의미          |
| ----------- | ------------------------ | ---------- | ----------- |
| ① 첫 번째 선형변환 | $xW_1 + b_1$             | $512 → 2048$ | 특성 확장       |
| ② $ReLU$      | 비선형 활성화                  | $2048$       | 비선형 조합      |
| ③ 두 번째 선형변환 | $(\text{ReLU})W_2 + b_2$ | $2048 → 512$ | 다시 원래 차원 복귀 |
