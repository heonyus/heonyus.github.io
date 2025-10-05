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

  - **회귀(Regression)**:  
    $$
    \hat{f}_{\text{bag}}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}_b(x)
    $$

  - **분류(Classification)**:  
    $$
    \hat{f}_{\text{bag}}(x) = \mathrm{Mode}\left\{ \hat{f}_1(x), \ldots, \hat{f}_B(x) \right\}
    $$

- **Boosting** : 이전 오차(분류가 틀린 샘플)에 더 많은 가중치를 두고, 여러 약한 분류기(트리)를 순차적으로 학습하여 성능을 점진적으로 개선하는 방법

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
### 1️⃣ 정의 (Definition)

랜덤 포레스트는 **서로 다른 랜덤 벡터 $\Theta_k$** 에 의해 생성된 트리 집합 $\{h(x, \Theta_k)\}$ 의 앙상블이다.<br>
본 논문에서는 $i.i.d.$ 랜덤 벡터 $Θₖ$ “각 트리가 한 표를 던진다(casts a unit vote)”라고 이야기 한다.<br>
많은 수의 트리를 만든 뒤 가장 많은 표를 받은 클래스에 투표한다.<br>
우리는 이런 절차들을 랜덤 포레스트라고 부른다.

$$
H(x) = \text{majority\_vote}\{h(x, \Theta_1), h(x, \Theta_2), \dots, h(x, \Theta_K)\}
$$

$$
H(x) = \arg\max_{c \in \mathcal{Y}} \sum_{k=1}^K \mathbb{1}\left[ h(x, \Theta_k) = c \right]
$$

각 트리는 **훈련 샘플 부트스트래핑 + 무작위 feature 선택**으로 학습된다.<br>
트리 수가 충분히 많으면, 예측 확률이 안정화되어 오버피팅이 발생하지 않는다.<br>

### 2️⃣ 일반화 오차 수렴 (Convergence)
```python
X, y = make_classification(
    n_samples=3000,
    n_features=16,
    n_informative=6,
    n_redundant=4,
    n_classes=2,
    class_sep=1.2,
    flip_y=0.03,
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=123, stratify=y
)
```

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/inmAGai.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

랜덤 포레스트의 일반화 오차는 다음과 같다:

$$
PE(Prediction Error)^* = P_{X,Y}\big(P_\Theta(h(X,\Theta)=Y) - \max_{j \neq Y} P_\Theta(h(X,\Theta)=j) < 0 \big)
$$ 

> 논문에서는 $PE(Prediction Error)^*$를 margin 이라고 표현함함

이는 **강한 대수의 법칙(Strong Law of Large Numbers)** 에 의해 트리 수 $K \to \infty$ 일 때 수렴한다.<br>
즉, 트리를 무한히 추가해도 **overfitting이 일어나지 않는다.**

### 3️⃣ Strength–Correlation 이론

본 논문에서는 Random Forest의 정확도(Generalization Error; test 데이터셋에서 틀릴 확률)가 트리의 **강도(strength)** 와 **상관(correlation)** 의 함수임을 수학적으로 증명했다.

$$
PE(Prediction Error)^* \le \frac{\rho (1 - s^2)}{s^2}
$$

- 일반화 오차의 상한(bound)
  - 트리의 강도 $s$가 증가할수록 $(1-s^2)$가 작아지고 $s^2$가 커지므로, 오차 상한이 낮아짐
  - 트리 간 상관관계 $\rho$가 낮을수록 오차 상한이 낮아짐

| 항목 | 의미 |
|------|------|
| $s$ | 각 트리의 평균적인 분류 정확도 (Strength) |
| $\rho$ | 트리 간 예측 상관관계 (Correlation) |

- 트리의 **강도(strength, $s$)** 는 높을수록 좋고
  - 강도($s$)는 정답에 대해 평균적으로 얼마나 “여유 있게” 이기는지를 나타내는 **평균 마진(margin)** 으로 정의
  - 논문에서는 $s = \mathbb{E}_{X,Y}[\text{margin}]$ 형태로 수식화
  - 즉, 평균 마진이 클수록(= 강도 ↑) 예측이 더 자신 있고 안정적
- 트리 간 **상관(correlation, $𝜌$)** 은 낮을수록 좋다.

> **Rule of Thumb**  <br>
> 낮은 ρ / 높은 s → 낮은 일반화 오차 <br>
> 강도는 높게 상관은 낮게 만들수록 일반화 오차가 작아짐짐

```py
def majority_vote(preds_2d):
    votes_for_1 = preds_2d.sum(axis=0)
    votes_for_0 = preds_2d.shape[0] - votes_for_1
    return (votes_for_1 >= votes_for_0).astype(int)
```

- 트리 투표 다수결(majority vote) 값을 구하는 함수
- majority vote는 사실상 클래스 투표 수에서 argmax를 적용하는 것

```py
def binary_margin_from_votes(preds_2d, y_true):
    n_trees = preds_2d.shape[0]
    votes_for_1 = preds_2d.sum(axis=0)
    p1 = votes_for_1 / n_trees
    p0 = 1 - p1
    p_correct = np.where(y_true == 1, p1, p0)
    p_incorrect = 1 - p_correct
    margin = p_correct - p_incorrect
    return margin
```
- 각 샘플에 대해 정답(y_true)이 맞게 맞힌 트리 비율(p_correct)와 틀린 비율(p_incorrect)을 구함

$$margin = p_{correct} - p_{incorrect}$$

- "정답을 맞춘 비율이 틀린 비율보다 얼마나 더 많은지"를 측정하는 값 (음수면 majority가 오답)

```py
def avg_pairwise_correlation_indicator(preds_2d, y_true):
    Z = (preds_2d == y_true[None, :]).astype(float)
    T, N = Z.shape
    Zc = Z - Z.mean(axis=1, keepdims=True)
    denom = np.sqrt((Zc**2).sum(axis=1, keepdims=True) * (Zc**2).sum(axis=1)[None, :])
    corrs = []
    for a, b in combinations(range(T), 2):
        za = Zc[a]; zb = Zc[b]
        num = (za * zb).sum()
        da = np.sqrt((za**2).sum()); db = np.sqrt((zb**2).sum())
        if da == 0 or db == 0:
            continue
        corrs.append(num / (da * db))
    if len(corrs) == 0:
        return 0.0
    return float(np.mean(corrs))
```
- 트리별로 정답 예측 여부(맞음=1, 틀림=0)로 2차원 배열 Z를 만듦 (모양: (트리 수, 샘플 수))
- 트리별로 "정답률 벡터 Z"의 평균을 빼고 정규화
- 트리 쌍마다 Pearson 상관계수(표본 상관)를 계산해서, 그 값들의 평균을 반환

→ 이 값이 낮을수록(0에 가까울수록) 트리들이 서로 다르게 실수(실패)하며, 앙상블 효과가 커진다.

---

> mtry는 랜덤 포레스트(Random Forest) 모델에서 각 트리의 **노드가 분할(split)할 때 참고하는 “무작위 feature 개수”** 를 뜻한다.

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/r0ErscE.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

- Strength(s) 는 mtry가 커질수록 ↑ (개별 트리가 강해짐)
- Correlation(ρ) 도 mtry가 커질수록 ↑ (트리들이 비슷해짐)

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/0CCiVWZ.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

- Test Error 는 중간 mtry에서 저점(논문과 유사한 “균형점”)
- Test Error = $f(Strength, Correlation)$<br>
           = `개별 트리 성능` vs `앙상블 다양성`의 트레이드오프

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/qJyuepg.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

- $ρ / s²$ 는 작을수록 좋음 → 작은 mtry 영역이 유리한 경향

### 4️⃣ Out-of-Bag (OOB) 추정

OOB는 RF의 핵심 내부 평가 메커니즘이다.<br>
Bootstrap으로 각 트리 학습시키면 트리 학습 시 사용되지 않은 샘플(약 1/3)을 이용해 별도의 검증 없이 일반화 오차(PE)를 추정할 수 있다.<br>
- 랜덤 포레스트의 각 트리는 훈련셋 크기 N과 같은 개수를 중복 허용(with replacement) 으로 뽑아 만든 부트스트랩 샘플로 학습
- 이때 어떤 샘플 하나(예: i번째 샘플)가 단 한 번도 선택되지 않을 확률은은 약 36.8%
  - **OOB Error ≈ Test Error**
  - **OOB Strength, OOB Correlation** 도 내부적으로 계산 가능

이로써 RF는 별도의 validation set 없이도 학습 중에 자기 평가(self-evaluation)가 가능하다.

### 5️⃣ Random Feature Selection

>랜덤 포레스트의 성능은 개별 트리의 강도(s) 는 높이고 트리들끼리의 상관(ρ) 은 낮추는 데서 나온다.

- $mtry = F$(노드에서 보는 특성 개수)를 작게 하면 다양성이 $↑$, 너무 작으면 각 트리가 약해질 수 있음($s↓$)
- 너무 크게 하면 각 트리는 강해지지만($s↑$) 서로 비슷해져 $ρ↑$ → 그래서 $U$자형 트레이드오프가 생김
- 각 노드에서 $M$개의 feature 중 무작위로 $F$개를 뽑아 split 후보로 사용
  - 이를 **Forest-RI (Random Input)** 라고 함

$$
F = 1 \text{ 또는 } F = \lfloor \log_2 M + 1 \rfloor
$$

또 다른 변형인 **Forest-RC (Random Combination)** 은  
랜덤 선형 결합으로 feature를 생성한다.

- RI가 원래 특성에서만 축 정렬 분할을 찾는 반면, RC는 무작위 선형 결합으로 새로운 축을 만들어 그 축으로 분할
$$
z = \sum_{i=1}^{L} w_i x_i, \quad w_i \sim U[-1,1]
$$

- 노드마다 L개의 특성을 무작위로 선택하여, 각 특성에 대해 가중치 $w_i$를 $U[-1,1]$에서 샘플링해 선형 결합 $z = \sum_{i=1}^L w_i x_i$를 만듬
- 이렇게 생성된 새로운 특성 $z$에 대해 한 번의 최적 분할(= 사선/경사 분할, oblique split)을 수행

이 방식은 feature 수가 적은 문제에서 유효하며,  
AdaBoost보다 **빠르고**, **노이즈에 강하며**, **병렬화가 쉬운** 장점을 가진다.

> 즉, $mtry(F)$ 는 고정 공식보다 $OOB-error$ 로 선택하는 게 안전하다.<br>
> 작은 $F$부터 크게 올려보며 $U$-자 에러 곡선의 바닥을 찾자.

## Experiment & Result

### 1️⃣ 실험 구성

- **데이터셋:** 13개 UCI + 3개 대규모 데이터 + 4개 Synthetic  
- **비교 대상:** AdaBoost (50 trees) vs Random Forest (100 trees)  
- **지표:** Test Error, OOB Error  
- **모델:** Forest-RI / Forest-RC / Adaboost

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

### 3️⃣ Strength–Correlation 관계 분석

본 논문에서는 각 노드 분할에 사용할 feature 수 $F$ 를 1~50까지 변화시켜 strength, correlation, test error의 변화를 측정했다.

#### Figure 1. Sonar 데이터셋

<p align="center">
  <img alt="Figure 1" src="https://i.imgur.com/94YSbJI.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

> Sonar 데이터에선 mtry를 키울수록 트리들이 닮아가(ρ↑) 오차가 늘어난다. <br>
> 따라서 작은 mtry가 더 유리하고, OOB가 그 추세를 잘 따라가며 약간 보수적으로 추정해준다는 걸 보여주는 그림이다

- $F > 4$ 이후 strength는 거의 일정  
- correlation은 증가  
- test error는 U-자 형태로 증가 → 최적 $F$는 4~8

#### Figure 2. Breast Cancer 데이터셋

<p align="center">
  <img alt="Figure 2" src="https://i.imgur.com/FONjjQd.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

> 이 데이터에서는 트리 강도는 이미 높아 포화 mtry를 키우면 상관만 조금씩 올라서 오차가 살짝 악화된다. <br>
> 따라서 작은 mtry가 유리하고, OOB가 신뢰할 만한 대리 지표라는 걸 보여주는 그림이다다

- correlation은 완만히 증가  
- strength는 거의 일정  
- 최소 error는 $F=1$ 근처에서 발생

#### Figure 3. Satellite 데이터셋

<p align="center">
  <img alt="Figure 3" src="https://i.imgur.com/WfRCWl8.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

> 큰/복잡 데이터에선 mtry를 조금 키우면 $s↑$ 가 $ρ↑$ 보다 이득이라 오차가 약간 좋아지고 곧 평탄해진다.

- 대규모 데이터에서는 strength가 지속적으로 증가  
- correlation은 빠르게 포화  
- 결과적으로 error는 미세하게 감소

> **결론:** 작은 데이터셋은 “낮은 $F$ → low correlation, 큰 데이터셋은 “높은 $F$ → 높은 strength”가 유리하다.


### 4️⃣ Noise Robustness 실험

5%의 라벨 노이즈를 추가했을 때, Adaboost는 성능이 급격히 저하된 반면 Random Forest는 거의 영향을 받지 않았다.

| Dataset | AdaBoost $ΔError$ | Random Forest $ΔError$ |
|:--|--:|--:|
| Breast Cancer | +43.2% | +1.8% |
| Ionosphere | +27.7% | +3.8% |
| Votes | +48.9% | +6.3% |

#### Why?
- **AdaBoost (노이즈에 민감)**  
  - 매 단계마다 오분류된 샘플의 가중치가 증가함  
  - 수식:  

    $$
    w_i^{(t+1)} \propto w_i^{(t)} \cdot \exp\left(\alpha_t \cdot 1[y_i \ne h_t(x_i)]\right)
    $$

  - 잘못 표기된(노이즈) 샘플은 반복적으로 오분류되어 가중치가 계속 커짐(지수적으로)  
  - 이후 약한 분류기들이 이 노이즈 샘플을 맞추려다 과적합 발생

- **Random Forest (노이즈에 강건)**  
  - 각 트리는 부트스트랩 샘플과 무작위 특성 선택으로 일부 데이터만 학습  
  - 예측은 다수결/평균 방식으로, 노이즈의 영향이 여러 트리에 분산되어 상쇄  
  - 개별 샘플에 가중치 집중이 없고, 트리 간 상관을 낮추는 랜덤성 덕분에 노이즈에 둔감

### 5️⃣ Variable Importance 시각화

#### Figure 4. Diabetes 데이터셋 (F=1)

<p align="center">
  <img alt="Figure 4" src="https://i.imgur.com/PKustP3.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

- x축 variable: 변수 인덱스(1~8)
- y축 percent increase: Permutation Importance = “그 변수를 OOB에서 무작위 셔플했을 때 오류율이 몇 % 증가하나?”
  - 변수 2, 6, 8번이 가장 중요하게 나타남

#### Figure 5. Diabetes 데이터셋 (F=2)
<p align="center">
  <img alt="Figure 4" src="https://i.imgur.com/Jf0F7U0.png" referrerpolicy="no-referrer" loading="lazy" />
</p>

Figure 4에서는 노드마다 단일 변수(F=1) 로 분할(= Forest-RI, 축정렬) → 변수 2가 압도적, 8·6이 그 다음으로 중요하다. <br>
Figure 5에서는 같은 데이터에 대해 세 변수 조합(feature를 3개 선형결합) 을 쓰는 Forest-RC 스타일로 바꿔서, F=2(노드마다 두 개 조합만 후보)로 다시 측정한 그래프다.<br>

> 핵심은 변수별 중요도의 상대적 크기 순서가 거의 유지된다는 것.

#### Figure 6. Votes 데이터셋 (정당 분류)

<p align="center">
  <img alt="Figure 4" src="https://i.imgur.com/q9IxA91.png" referrerpolicy="no-referrer" loading="lazy" />
</p>
Figure 6은 Votes 데이터(의회 표결 → 정당 분류)에서 Permutation Importance(OOB 기반)로 변수별 기여도를 측정한 결과다.

- **x축**: 변수(의회 표결 이슈) 인덱스 1~16
- **y축**: 해당 변수를 OOB에서 셔플했을 때 오류율이 몇 % 증가하는지 (= 중요도)
  - 값이 클수록 "그 변수 없으면 성능이 크게 나빠진다 → 중요"를 의미

**변수 4가 압도적 (약 300% 증가)**
- 이 변수만 섞어도 OOB 오류가 수 배로 커진다는 뜻 → **정당 라벨을 거의 단독으로 구분하는 핵심 이슈**였다는 해석이 자연스럽다

**나머지 변수들은 0% 근처의 낮은 중요도**
- (1) 변수 4가 대부분의 구분을 이미 해버려 추가 정보가 중복이거나
- (2) 개별로는 약한 신호라 단독 셔플 효과가 작음 → 약간의 음수/미세 양수는 OOB 표본 변동, 공선성, 경계 노이즈로 흔히 보이는 현상

여기선 변수 4 하나가 매우 강력한 결정 변수라서, **이 변수만 사용해도 숲의 상당한 정확도에 근접**할 수 있음을 시사한다.<br>
단, 정말 "동일한 수준"인지는 데이터·모델 설정에 따라 다를 수 있으니, 실무에선 해당 변수 단독 모델 vs RF를 실제로 비교해보는 게 안전하다.

- 이 데이터(의회 표결)는 특정 핵심 의제 하나가 정당 구분과 강하게 상관되어 있을 수 있음
- RF는 다수결이므로 강력한 변수를 가진 트리들이 반복해서 같은 결정을 내림
- → 그 변수를 깨뜨리면 숲 전체가 흔들림 → 큰 중요도로 반영

단일 변수 스파이크가 나오면 반드시 확인:

1. **데이터 누출(leakage)** 은 아닌지
2. **공정성/편향 이슈**는 없는지
3. **그 변수를 빼고도 모델이 견고한지** (민감도 분석)

> **보조 분석 방법**  <br>
> 공선성이 많은 데이터에선 Permutation 중요도가 신호가 강한 변수 하나에 몰리거나 분산될 수 있다.  <br>
> 필요하면 다음 방법들을 추가로 사용하자: <br>
> - Conditional permutation <br>
> - SHAP/TreeSHAP <br>
> - 그룹 단위 셔플 (이슈 묶음) <br>

## Regression Extension

본 논문은 RF를 회귀로 확장하며 다음 결과를 제시했다:

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
