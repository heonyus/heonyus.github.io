---
layout: post
title: "Laplacian Matrix"
date: 2025-11-08
description: "Laplacian Matrix"
tags:
  - Graph
---

# Laplacian Matrix

라플라시안 행렬(Laplacian matrix)은 그래프의 구조와 특성을 파악하는 데에 중요한 개념입니다.
이번 포스팅에서는 그래프 관점에서 라플라시안 행렬의 의미와 활용에 대해 자세히 알아보겠습니다.

엑셀 스프레드 시트나, spss와 같은 테이블 데이터와 달리, 그래프는 각 데이터를 나타내는 노드와, 노드 간의 관계인 엣지로 이루어진 형태를 띄고 있습니다.
이러한 그래프 구조를 표현하는 방법 중 하나가 인접 행렬(adjacency matrix)입니다.
아래와 같은 6개의 데이터(노드)와 각 노드의 관계로 이루어진 그래프가 있을 때, 노드들의 연결 상태를 표현하는 것이 인접 행렬입니다.

![Graph Example](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fpn6nU%2FbtsmIRs1UeK%2FAAAAAAAAAAAAAAAAAAAAAAnPYgGkXTg4RRG6dxZo73yzgrQkYG2SI_PTGTw3l8YT%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DuUCWxi%252BX5maOSDjuOke7wfB%252FNus%253D)

그래프를 구성하는 총 노드의 개수를 N이라고 하면, 인접 행렬 A는 (**N x N**) 매트릭스 형상으로 나타냅니다.
이때, 인접 행렬 A의 ( i, j ) 성분은 노드 i와 노드 j가 엣지로 연결되어 있으면 ' **1** ', 그렇지 않으면 ' **0** '으로 나타냅니다.

위 그래프가 총 6개의 노드로 구성되었기 때문에 인접 행렬 A는 ( **6 x 6** )의 형상을 띄고 있습니다.
또한 각 노드는 스스로 연결된 self-loop가 존재하지 않기 때문에, 대각 성분은 ( i, i ) 모두 0입니다.
노드 1이 노드 2,5와 연결되었기 때문에, 첫 행에서 2번째, 5번째 행렬의 성분이 1인 것을 확인할 수 있습니다.

![Matrix A](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fckv71P%2FbtsmGQhC3BH%2FAAAAAAAAAAAAAAAAAAAAAINAjVhiVYN6mZ_0rgMc5AMIBaT9iGwy7SGQjWatECSH%2Ftfile.svg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3D4E3fssUn5BEsmS0YG4FQKYrkbJg%253D)

그러나 인접 행렬은 그래프의 연결 상태만을 표현 하기 때문에, 그래프의 자세한 특성을 파악하기에는 제한적 입니다.
이러한 한계를 보완하기 위해, 라플라시안 행렬로 그래프를 표현합니다.
라플라시안 행렬은 그래프의 구조와 연결 상태, 그리고 특성을 모두 포함하는 행렬입니다.

위 그림에서 노드 6개로 이루어진 그래프 G의 라플라시안 행렬은 L로 표기할 수 있으며, 아래 식과 같이 정의됩니다

$$
L=D−A
$$

$D$ 는 그래프에서 각 노드가 연결된 이웃의 수를 표현하는 차수 행렬(degree matrix)입니다.
Degree matrix는 대각 원소 외에는 모두 0으로 이루어져 있으며, 각 대각 원소는 노드가 가진 이웃 수를 표현하는 대각 행렬입니다.
$A$ 는 위에서 표현한 인접 행렬입니다.

이 두 행렬을 통해서 라플라시안 행렬을 구할 수 있습니다.
이는 인접 행렬이 표현하는 그래프의 연결 상태뿐만 아니라, 차수 행렬이 표현하는 그래프의 특성을 반영합니다.

![Laplacian Matrix](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FFBsSp%2FbtsmFguPbGt%2FAAAAAAAAAAAAAAAAAAAAAL7eRaeNR3UXOFUIuLB4HhC5jeVTVMS34FL7okJO1Wrf%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DhjQBWxvECuq2YgSCYc4DtIooiNs%253D)

위 그림에서 표현한 라플라시안 행렬은 다음과 같은 특징을 따릅니다.

먼저 (1) 대각 성분을 중심으로 원소들이 대칭적입니다.
또한 (2)대각 성분을 제외한 요소들은 음수 값을 가집니다.
마지막으로 주 대각 성분의 값이 다른 요소 값보다 크거나 같습니다.

이러한 성징을 **diagonally dominant**라고 표현합니다.
이러한 라플라시안 행렬은 최종적으로 다음과 같은 식을 따릅니다.

![Diagonally Dominant](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FN55KY%2FbtsmIRUjUSJ%2FAAAAAAAAAAAAAAAAAAAAAPD1eo6XQP_Cz-1oaCq4vJ4Qr7Yk0WRplBtIa6CNpwFT%2Ftfile.svg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DH%252FInvVQfNobI1Y16hbkdo2FlW%252Bs%253D)

마지막으로, 정규화된 라플라시안 행렬의 값을 구할 수 있습니다.
정규화된 라플라시안 메트릭스(normalized laplacian matrix)는 다음과 같은 식으로 구합니다.

![Normalized Laplacian Matrix](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd2lYOA%2FbtsmHbzeaMK%2FAAAAAAAAAAAAAAAAAAAAAAgZr_iTiNVeK9ws6MMNa8sE_-peld1K9g1OWU1EQnxC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DV0mD4Xj53KIEBTYHYxpCNW0ufmc%253D)

라플라시안 행렬은 그래프의 구조적 특성을 파악하고 분석하는 데에 많은 도움을 줍니다.
라플라시안 메트릭스를 사용하는 주요 활용을 알아보겠습니다.

1. **그래프 분할 (Graph Partitioning)**: 라플라시안 행렬의 고유값과 고유벡터를 분석함으로써 그래프를 여러 부분으로 분할할 수 있습니다.고유값은 그래프의 구조적인 특성을 나타내며, 이를 통해 그래프를 최적으로 분할하는 방법을 찾탐색합니다. 이는 커뮤니티 탐지, 소셜 네트워크 분석, 그리고 클러스터링과 같은 다양한 분야에서 활용됩니다.
2. **그래프 스펙트럼 분석 (Graph Spectrum Analysis)**: 라플라시안 행렬의 고유값 분석은 그래프의 스펙트럼 분석을 가능하게 합니다. 예를 들어, 작은 고유값은 그래프의 커뮤니티 구조나 구성 요소들의 크기를 파악하는 데에 도움이 되며, 큰 고유값은 그래프의 확산과 동기화 현상 등을 이해하는 데에 유용합니다.
3. **스펙트럼 클러스터링 (Spectral Clustering):** 라플라시안 행렬은 스펙트럼 클러스터링에도 널리 사용됩니다. 이는 데이터 클러스터링 문제를 그래프의 구조와 연결하여 해결하는 방법입니다. 라플라시안 행렬의 고유값과 고유벡터를 분석하여 데이터를 클러스터로 그룹화할 수 있습니다.

라플라시안 행렬은 단순이 차수 행렬과 인접 행렬을 통해 구할 수 있지만, 그래프 이론에서 중요한 개념입니다.
이 행렬을 통해 그래프의 구조와 특성을 파악할 수 있습니다.
라플라시안 행렬은 다양한 분야에서 활용되기 때문에, 그래프 이론에서 중요하게 반드시 알아야 할 개념이라고 생각합니다.