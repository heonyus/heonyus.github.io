---
layout: post
title: "A Vector Space Model for Automatic Indexing(1986)"
date: 2025-06-05
category: ML
tags: [Backpropagation, Neural Networks, Deep Learning, Seminal Paper]
---
# [논문리뷰] Learning representations by back-propagating errors

> Nature 1986. [Paper](https://www.nature.com/articles/323533a0)  
> David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams  
> University of California, San Diego | Carnegie-Mellon University  
> 1986-10-09

## Introduction
단층 퍼셉트론(single-layer perceptron)은 학습 규칙이 명확했지만, 입력과 출력 사이에 직접적인 연결이 없는 은닉 유닛(hidden units)을 포함하는 다층 신경망(multi-layer networks)의 가중치를 어떻게 학습시킬지는 오랜 난제였다. 은닉 유닛에 대한 명시적인 목표값(target value)이 없기 때문에, 어떤 내부 표현(internal representation)을 학습해야 하는지 결정하기 어려웠다. 이 문제는 소위 신용 할당 문제(credit assignment problem)로 알려져 있다.

본 논문은 출력층의 오차를 네트워크의 각 계층으로 역전파(back-propagate)하여 모든 가중치를 수정하는 학습 절차, 즉 **역전파(Backpropagation) 알고리즘**을 제안한다. 이는 기존의 델타 규칙(delta rule)을 미분 가능한 활성화 함수를 갖는 다층 네트워크로 일반화한 것이다.

### **Key Contributions**

* **일반화된 델타 규칙(Generalized Delta Rule) 제안**: 다층 신경망의 은닉층 가중치를 학습시키기 위한 역전파 알고리즘을 수학적으로 정립했다.
* **내부 표현 학습의 증명**: 은닉 유닛이 입력 데이터의 통계적 규칙성을 포착하여 유용한 고차원 특징(feature)을 스스로 학습할 수 있음을 실험적으로 보였다.
* **비선형 문제 해결 능력 입증**: 배타적 논리합(XOR) 문제와 같이, 단층 퍼셉트론이 해결할 수 없었던 선형적으로 분리 불가능한 문제를 해결하는 능력을 보였다.
* **연속적 활성화 함수 기반 학습**: 비선형적이면서 미분 가능한 활성화 함수(예: 시그모이드)를 사용하여 경사 하강법 기반의 학습을 가능하게 했다.

## Method: The Back-propagation Algorithm

역전파 알고리즘의 목표는 실제 출력과 목표 출력 간의 오차를 최소화하는 방향으로 네트워크의 가중치를 조정하는 것이다. 이는 전체 네트워크의 가중치에 대한 오차 함수의 기울기(gradient)를 계산하여 경사 하강법(gradient descent)을 수행함으로써 달성된다.

### 1. 오차 함수와 가중치 업데이트 규칙

특정 입력 패턴 $p$에 대한 전체 오차 $E_p$는 출력 유닛들의 제곱 오차 합으로 정의된다.

$$E_p = \frac{1}{2} \sum_{j} (t_{pj} - o_{pj})^2$$

여기서 각 기호는 다음과 같이 정의된다.
- $t_{pj}$: 입력 패턴 $p$에 대한 출력 유닛 $j$의 **목표(target) 출력값**
- $o_{pj}$: 입력 패턴 $p$에 대한 출력 유닛 $j$의 **실제(actual) 출력값**
- 합산은 네트워크의 모든 출력 유닛 $j$에 대해 수행된다.

경사 하강법에 따라 각 가중치 $w_{ji}$ (유닛 $i$에서 유닛 $j$로 향하는 가중치)는 오차 함수의 음의 기울기 방향으로 업데이트된다.

$$\Delta_p w_{ji} \propto -\frac{\partial E_p}{\partial w_{ji}}$$

이때 $\frac{\partial E_p}{\partial w_{ji}}$는 연쇄 법칙(chain rule)을 통해 두 부분으로 분해할 수 있다.

$$\frac{\partial E_p}{\partial w_{ji}} = \frac{\partial E_p}{\partial \text{net}_{pj}} \frac{\partial \text{net}_{pj}}{\partial w_{ji}}$$

여기서 $\text{net}_{pj}$는 유닛 $j$에 들어오는 총 입력(net input)이며, 다음과 같이 계산된다.

$$\text{net}_{pj} = \sum_{i} w_{ji} o_{pi}$$

유닛 $j$의 출력 $o_{pj}$는 총 입력에 비선형 활성화 함수 $f_j$를 적용한 결과이다 ($o_{pj} = f_j(\text{net}_{pj})$).
$\frac{\partial \text{net}_{pj}}{\partial w_{ji}}$ 항은 $o_{pi}$와 같으므로, 최종적으로 가중치 업데이트 규칙은 다음과 같이 정리된다.

$$\Delta_p w_{ji} = \eta \cdot \delta_{pj} \cdot o_{pi}$$

- $\eta$: 학습률(learning rate)
- $\delta_{pj} = -\frac{\partial E_p}{\partial \text{net}_{pj}}$: 유닛 $j$에서의 **오차 신호(error signal)**

### 2. 오차 신호의 역전파

역전파 알고리즘의 핵심은 $\delta_{pj}$를 계산하는 방식에 있다. 유닛 $j$가 출력층에 있는지 혹은 은닉층에 있는지에 따라 계산법이 달라진다.

##### 출력 유닛 (Output Units)

유닛 $j$가 출력층에 있다면, $\delta_{pj}$는 연쇄 법칙에 따라 직접 계산할 수 있다.
$$\delta_{pj} = -\frac{\partial E_p}{\partial o_{pj}} \frac{\partial o_{pj}}{\partial \text{net}_{pj}} = (t_{pj} - o_{pj}) f'_j(\text{net}_{pj})$$
- $f'_j(\text{net}_{pj})$: 활성화 함수 $f_j$의 $\text{net}_{pj}$에 대한 미분값. 예를 들어, 로지스틱(시그모이드) 함수를 사용하면 $f'_j(\text{net}_{pj}) = o_{pj}(1-o_{pj})$가 된다.

##### 은닉 유닛 (Hidden Units)

유닛 $j$가 은닉층에 있다면, 이 유닛의 오차는 직접 계산할 수 없다. 대신, 후속 계층(downstream layer)의 유닛들로부터 오차를 전달받아 계산한다. 은닉 유닛 $j$가 후속 계층의 유닛 $k$들에게 미치는 영향은 가중치 $w_{kj}$를 통해 전파되므로, $\delta_{pj}$는 다음과 같이 계산된다.

$$\delta_{pj} = -\frac{\partial E_p}{\partial \text{net}_{pj}} = -\sum_k \frac{\partial E_p}{\partial \text{net}_{pk}} \frac{\partial \text{net}_{pk}}{\partial \text{net}_{pj}} = f'_j(\text{net}_{pj}) \sum_{k} \delta_{pk} w_{kj}$$

- 이 수식은 은닉 유닛 $j$의 오차 신호가 **후속 계층 유닛들의 오차 신호($\delta_{pk}$)를 가중치($w_{kj}$)로 가중합**한 뒤, 자신의 활성화 함수 미분값을 곱한 것과 같음을 의미한다. 이것이 바로 '오차의 역전파' 과정의 핵심이다.


## Experiments

본 논문은 역전파 알고리즘의 유효성을 보이기 위해 몇 가지 고전적인 벤치마크 문제를 사용했다. 이는 대규모 데이터셋을 사용한 현대적인 실험과는 다르지만, 알고리즘의 핵심 원리를 명확하게 보여준다.

* **구현 디테일**:
    * **모델**: 2개 또는 3개의 계층으로 구성된 피드포워드 신경망(Feed-forward Neural Network).
    * **활성화 함수**: 로지스틱(시그모이드) 함수 $o_j = (1 + e^{-\text{net}_j})^{-1}$ 사용.
    * **학습 방식**: 온라인 학습(입력 패턴 하나마다 가중치 업데이트) 또는 배치 학습.
    * **가속화 기법**: 학습 속도를 높이고 지역 최소점(local minima) 문제를 완화하기 위해 **모멘텀(momentum)** 항을 추가했다.
        $$\Delta w_{ji}(t+1) = \eta (\delta_{pj} o_{pi}) + \alpha \Delta w_{ji}(t)$$
        - $t$: 업데이트 시점 (iteration)
        - $\alpha$: 모멘텀 계수(0과 1 사이의 값)

* **배타적 논리합 (XOR) 문제**:
    * **구조**: 2개의 입력 유닛, 2개의 은닉 유닛, 1개의 출력 유닛으로 구성된 네트워크를 사용했다.
    * **결과**: 역전파 알고리즘을 통해 네트워크는 이 선형적으로 분리 불가능한 문제를 성공적으로 학습했다.
    * **분석**: 학습 후 은닉 유닛의 가중치를 분석한 결과, 각 은닉 유닛이 입력 공간을 재구성하는 특정 논리 함수(예: 하나는 OR, 다른 하나는 AND)와 유사한 역할을 수행하도록 학습되었음을 확인했다. 이를 통해 출력 유닛은 선형 분리가 가능한 새로운 표현 공간에서 XOR 연산을 수행할 수 있었다. 이는 역전파가 단순히 패턴을 암기하는 것을 넘어, 문제 해결에 유용한 내부 표현(internal representation)을 스스로 형성함을 보여주는 강력한 증거가 되었다.



* **대칭성 탐지 (Symmetry Detection)**:
    * 입력 벡터가 중심을 기준으로 대칭인지 판별하는 문제이다.
    * 은닉 유닛들은 입력 패턴의 국소적 특징(local feature)과 전역적 대칭성을 동시에 탐지하는 역할을 학습했다. 이 또한 데이터에 내재된 구조를 네트워크가 스스로 발견하는 능력을 보여준다.

## Notes

- 이 논문은 역전파 알고리즘을 처음으로 발명한 것은 아니지만(Werbos, Parker 등에 의해 독립적으로 발견됨), 신경망 커뮤니티에 아이디어를 명확히 알리고 그 잠재력을 입증하여 딥러닝 연구의 부흥을 이끈*결정적인 논문(seminal paper)으로 평가받는다.
- 논문에서 제안된 모멘텀 기법은 이후 Adam, RMSProp 등 더 정교한 최적화 알고리즘의 발전에 중요한 영감을 주었다.
- 당시에는 계산 비용의 한계로 깊고 큰 네트워크에 적용하기 어려웠지만, 이 알고리즘은 GPU의 발전과 함께 오늘날 딥러닝의 핵심 엔진으로 자리 잡았다.
