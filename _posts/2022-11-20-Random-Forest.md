---
layout: post
title: "Random Forests (2001)"
date: 2022-11-20
tags: [Machine Learning, Ensemble Learning, Decision Tree, Statistics, Breiman]
---

# [논문리뷰] Random Forests (2001)

> Machine Learning, 45(1), 5–32. [PDF](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf)  
> Leo Breiman, University of California, Berkeley  
> Published: January 2001


## Introduction

1990년대 후반은 **앙상블 학습(ensemble learning)** 의 시대였다.<br>
Bagging과 Boosting의 성공은 단일 결정 트리의 한계를 넘어서는 새로운 패러다임을 제시했다.  

### Background
<br>

#### Decision Tree
- Decision Tree: 데이터를 여러 질문(조건문) 으로 나누어가며 최종적으로 예측값(class 또는 수치) 을 출력하는 트리 구조의 모델

```text
[ROOT]
 ├── x1 < 0.5 ? 
 │     ├── Yes → Class A
 │     └── No  → Class B
```

- 입력 특성(feature) 을 기준으로 데이터를 반복적으로 분할(split)하고 각 leaf 노드에서 최종 예측을 수행

결정 트리는 훈련 데이터 $(x_i, y_i)$를 입력 공간의 여러 영역 $R_m$으로 분할하고, 각 영역마다 고정된 예측값 $c_m$을 할당하는 함수이다.

$$
\hat{f}(x) = \sum_{m=1}^M c_m \cdot I(x \in R_m)
$$
- $R_m$: m번째 분할 영역 (예: “$x_1 < 3.2$ 이고 $x_2 \geq 0.5$”)
- $c_m$: 해당 영역의 평균 응답값(회귀) 또는 최빈 클래스(분류)
- $I(\cdot)$: Indicator 함수 (조건이 참이면 1, 거짓이면 0)

즉, 트리 구조는 여러 if–then–else 규칙들의 집합으로 볼 수 있다.

#### Bagging & Boosting

- **Bagging**: 데이터 샘플을 무작위로 뽑아 여러 트리를 학습 → 평균화 

<div align="center">

$$
\text{(regression)}\quad \hat{f}_{\text{bag}}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}_b(x)
$$

$$
\text{(classification)}\quad \hat{f}_{\text{bag}}(x) = \mathrm{Mode}\left\{ \hat{f}_1(x), \ldots, \hat{f}_B(x) \right\}
$$

</div>
- **Boosting**: 이전 오차(분류가 틀린 샘플)에 더 많은 가중치를 두고, 여러 약한 분류기(트리)를 순차적으로 학습하여 성능을 점진적으로 개선하는 방법

  - 최종 예측 함수:  

    $$
    F_M(x) = \sum_{m=1}^M \alpha_m h_m(x)
    $$

    - $h_m(x)$: m번째 약한 분류기(예: 작은 결정트리)
    - $\alpha_m$: m번째 분류기의 가중치 (오분류율에 따라 조정)
    - $M$: 약한 분류기 개수

  - 가중치 계산(Adaboost 기준):  
    $$
    \alpha_m = \frac{1}{2} \ln\left(\frac{1-\epsilon_m}{\epsilon_m}\right)
    $$
    - $\epsilon_m$: m번째 분류기의 오분류율

  - 요약:  
    1. 이전 단계에서 잘못 분류된 샘플에 더 많은 가중치를 부여  
    2. 약한 분류기를 순차적으로 추가  
    3. 각 분류기의 성능에 따라 가중치를 조정하여 최종 예측을 만듦

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/hu06JLX.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

하지만 두 방법 모두 한계가 있었다.


| 문제점 | 설명 |
|--------|------|
| Bagging | 트리 간 **상관관계(correlation)** 가 높아 오차 감소가 제한적 |
| Boosting | **노이즈와 이상치(outlier)** 에 민감, 오버피팅 가능 |

Breiman은 이 문제를 해결하기 위해 **Random Forest (RF)** 를 제안했다.  
핵심은 **트리 생성 과정에 ‘무작위성(randomness)’을 주입하여 상관을 줄이고, 평균화로 강건성을 확보**하는 것이다.

> “Random forests are a combination of tree predictors,  
> each constructed using a random vector sampled independently.” — *Breiman (2001)*

## Method
<br>

### 1️⃣ 정의 (Definition)

랜덤 포레스트는 **서로 다른 랜덤 벡터 $\Theta_k$** 에 의해 생성된  
트리 집합 $\{h(x, \Theta_k)\}$ 의 앙상블이다.

$$
H(x) = \text{majority\_vote}\{h(x, \Theta_1), h(x, \Theta_2), \dots, h(x, \Theta_K)\}
$$

각 트리는 **훈련 샘플 부트스트래핑 + 무작위 feature 선택**으로 학습된다.  
트리 수가 충분히 많으면, 예측 확률이 안정화되어 오버피팅이 발생하지 않는다.

---

### 2️⃣ 일반화 오차 수렴 (Convergence)

랜덤 포레스트의 일반화 오차는 다음과 같다:

$$
PE^* = P_{X,Y}\big(P_\Theta(h(X,\Theta)=Y) - \max_{j \neq Y} P_\Theta(h(X,\Theta)=j) < 0 \big)
$$

이는 **강한 대수의 법칙(Strong Law of Large Numbers)** 에 의해  
트리 수 $K \to \infty$ 일 때 수렴한다.  
즉, 트리를 무한히 추가해도 **overfitting이 일어나지 않는다.**

---

### 3️⃣ Strength–Correlation 이론

Breiman은 RF의 정확도(Generalization Error)가  
트리의 **강도(strength)** 와 **상관(correlation)** 의 함수임을 수학적으로 증명했다.

$$
PE^* \le \frac{\rho (1 - s^2)}{s^2}
$$

| 항목 | 의미 |
|------|------|
| $s$ | 각 트리의 평균적인 분류 정확도 (Strength) |
| $\rho$ | 트리 간 예측 상관관계 (Correlation) |

즉,  
- 트리의 **강도(s)** 는 높을수록 좋고,  
- 트리 간 **상관(ρ)** 은 낮을수록 좋다.

> **Rule of Thumb**  
> 낮은 ρ / 높은 s → 낮은 일반화 오차

---

### 4️⃣ Out-of-Bag (OOB) 추정

OOB는 RF의 핵심 내부 평가 메커니즘이다.  
트리 학습 시 사용되지 않은 샘플(약 1/3)을 이용해  
별도의 검증 없이 일반화 오차를 추정할 수 있다.

- **OOB Error ≈ Test Error**
- **OOB Strength, OOB Correlation** 도 내부적으로 계산 가능

이로써 RF는 별도의 validation set 없이도 학습 중에 자기 평가(self-evaluation)가 가능하다.

---

### 5️⃣ Random Feature Selection

각 노드에서 $M$개의 feature 중 무작위로 $F$개를 뽑아 split 후보로 사용한다.  
이를 **Forest-RI (Random Input)** 라 한다.

$$
F = 1 \text{ 또는 } F = \lfloor \log_2 M + 1 \rfloor
$$

또 다른 변형인 **Forest-RC (Random Combination)** 은  
랜덤 선형 결합으로 feature를 생성한다.

$$
z = \sum_{i=1}^{L} w_i x_i, \quad w_i \sim U[-1,1]
$$

이 방식은 feature 수가 적은 문제에서 유효하며,  
AdaBoost보다 **빠르고**, **노이즈에 강하며**, **병렬화가 쉬운** 장점을 가진다.

---

## 📊 Experiment & Result

### 1️⃣ 실험 구성

- **데이터셋:** 13개 UCI + 3개 대규모 데이터 + 4개 Synthetic  
- **비교 대상:** AdaBoost (50 trees) vs Random Forest (100 trees)  
- **지표:** Test Error, OOB Error  
- **모델:** Forest-RI / Forest-RC / Adaboost

---

### 2️⃣ 주요 결과 요약

| Dataset | AdaBoost | Forest-RI | Forest-RC |
|:--|:--:|:--:|:--:|
| Breast Cancer | 3.2 | 2.9 | 3.1 |
| Diabetes | 26.6 | 24.2 | 23.0 |
| Sonar | 15.6 | 15.9 | 13.6 |
| Vowel | 4.1 | 3.4 | 3.3 |
| Image | 1.6 | 2.1 | 1.6 |
| Letters | 3.4 | 3.5 | 3.4 |
| Zip-code | 6.2 | 6.3 | 6.2 |

> 대부분의 데이터셋에서 Random Forest가 AdaBoost와 비슷하거나 더 낮은 오차율을 기록했다.

---

### 3️⃣ Strength–Correlation 관계 분석

Breiman은 각 노드 분할에 사용할 feature 수 $F$를 1~50까지 변화시켜  
strength, correlation, test error의 변화를 측정했다.

#### 📈 Figure 1. Sonar 데이터셋

![figure1](https://raw.githubusercontent.com/jeheon-tech/blog-assets/main/randomforest2001_fig1.png)

- $F > 4$ 이후 strength는 거의 일정  
- correlation은 증가  
- test error는 U-자 형태로 증가 → 최적 $F$는 4~8

#### 📉 Figure 2. Breast Cancer 데이터셋

![figure2](https://raw.githubusercontent.com/jeheon-tech/blog-assets/main/randomforest2001_fig2.png)

- correlation은 완만히 증가  
- strength는 거의 일정  
- 최소 error는 $F=1$ 근처에서 발생

#### 🌍 Figure 3. Satellite 데이터셋

![figure3](https://raw.githubusercontent.com/jeheon-tech/blog-assets/main/randomforest2001_fig3.png)

- 대규모 데이터에서는 strength가 지속적으로 증가  
- correlation은 빠르게 포화  
- 결과적으로 error는 미세하게 감소

> **결론:** 작은 데이터셋은 “낮은 F → 저상관”, 큰 데이터셋은 “높은 F → 높은 strength”가 유리하다.

---

### 4️⃣ Noise Robustness 실험

5%의 라벨 노이즈를 추가했을 때, Adaboost는 성능이 급격히 저하된 반면  
Random Forest는 거의 영향을 받지 않았다.

| Dataset | AdaBoost ΔError | Random Forest ΔError |
|:--|--:|--:|
| Breast Cancer | +43.2% | +1.8% |
| Ionosphere | +27.7% | +3.8% |
| Votes | +48.9% | +6.3% |

---

### 5️⃣ Variable Importance 시각화

#### 🩸 Figure 4. Diabetes 데이터셋 (F=1)
![figure4](https://raw.githubusercontent.com/jeheon-tech/blog-assets/main/randomforest2001_fig4.png)
- 변수 2, 6, 8번이 가장 중요하게 나타남

#### 🧬 Figure 6. Votes 데이터셋 (정당 분류)
![figure6](https://raw.githubusercontent.com/jeheon-tech/blog-assets/main/randomforest2001_fig6.png)
- 변수 4번(핵심 이슈)의 중요도가 압도적  
- 단일 변수만으로도 전체 모델 수준의 분류 정확도 달성

---

## 📈 Regression Extension

Breiman은 RF를 회귀로 확장하며 다음 결과를 제시했다:

$$
PE^*_{forest} \le \rho \, PE^*_{tree}
$$

즉, **트리 간 잔차(residual) 상관이 낮을수록 오차가 작아진다.**  
실험 결과, Bagging 대비 약 10~20%의 오차 감소를 보였다.

| Dataset | Bagging | Random Forest |
|:--|:--:|:--:|
| Boston Housing | 11.4 | **10.2** |
| Ozone | 17.8 | **16.3** |
| Friedman #1 | 6.3 | **5.7** |
| Abalone | 4.9 | **4.6** |

---

## 🧠 Discussion & Conclusion

랜덤 포레스트는 단순한 트리 집합을 넘어  
**Bias–Variance trade-off를 자동으로 최적화하는 구조**를 갖는다.

| 특성 | 설명 |
|------|------|
| 🎯 정확도 | AdaBoost와 유사하거나 더 높음 |
| 🧱 견고성 | 노이즈, 이상치에 강함 |
| ⚙️ 효율성 | 병렬화 및 대규모 데이터 처리에 적합 |
| 🔍 해석성 | Feature Importance 및 OOB로 내부 검증 가능 |

Breiman은 논문 말미에 다음과 같은 흥미로운 가설을 남겼다.

> “In later stages, AdaBoost may be emulating a random forest.”  
> — 즉, Adaboost는 본질적으로 랜덤 포레스트의 확률적 형태일 수 있다는 것이다.

---

> “Randomness reduces correlation.  
> Strength increases bias reduction.  
> Together they make forests powerful.”  
> — *Leo Breiman (2001)*

---

## 🔗 References

- Breiman, L. (2001). *Random Forests*. Machine Learning, 45(1), 5–32.  
- Breiman, L. (1996). *Bagging Predictors*. Machine Learning, 26(2), 123–140.  
- Freund, Y. & Schapire, R. (1996). *Experiments with a new boosting algorithm*.  
- Dietterich, T. (1998). *An Experimental Comparison of Three Methods for Constructing Ensembles of Decision Trees*.  
- Ho, T.K. (1998). *The Random Subspace Method for Constructing Decision Forests*. IEEE PAMI.

---

#️⃣ #RandomForest #EnsembleLearning #MachineLearning #LeoBreiman #DecisionTree
