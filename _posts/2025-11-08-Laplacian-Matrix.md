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

# Question

- 고유값 분해(eigendecomposition)와의 관계는 무엇인가?
- Chebyshev 다항식 기반 필터와의 관계는 무엇인가?
- 푸리에 변환과의 관계는 무엇인가?


# Appendix

어떤 그래프 G (V,E) $G(V,E)$ 의 **adjacency matrix** 는 n × n $n×n$ matrix A \= \[a i,j\] $A=[ai,j]$ 이다.

a i,j \= { 1,if v i,v j ∈ E (G) 0,otherwise 
$$
ai,j={1,if vi,vj∈E(G)0,otherwise
$$

이러한 행렬이 있을 때 이 행렬의 거듭제곱의 의미는 무엇인지 설명해 보시오. 즉 A k $Ak$ 에서 a (k) i,j \= p $ai,j(k)=p$ 는 무슨 의미인지 설명하시오.

---

### Answer

> a (k) i,j \= p $ai,j(k)=p$ 는 정점 v i $vi$ 에서 정점 v j $vj$ 까지 정확히 k 길이의 경로(path)가 p개 존재한다는 의미입니다.

그래프 G의 인접행렬 A를 거듭제곱했을 때, A k $Ak$ 의 (i,j) $(i,j)$ 원소(즉 a (k) i,j $ai,j(k)$)는 “정점 i에서 정점 로 가는 길이 인 **모든 단순 경로** (정확히는 중복 방문 가능성을 포함한 **‘워크(walk)’**)의 개수”를 나타냅니다. 다시 말해

A k \= ⎡ ⎢ ⎢ ⎢ ⎢ ⎣ a (k) 1,1 ⋯ a (k) 1,n ⋮ ⋱ ⋮ a (k) n,1 ⋯ a (k) n,n ⎤ ⎥ ⎥ ⎥ ⎥ ⎦ 
$$
Ak=[a1,1(k)⋯a1,n(k)⋮⋱⋮an,1(k)⋯an,n(k)]
$$

에서 a (k) i,j \= p $ai,j(k)=p$ 라면, 이는 길이가 인 (연속된 개의 간선을 거치는) 워크 중 시작점이 i이고 끝점이 인 것이 총 개 존재함을 의미합니다

---

### In simple terms

그 래프를 ‘도시들과 도시를 잇는 도로망’으로 생각해 봅시다.

- 그래프의 각 정점(Vertex)은 도시 하나에 해당합니다.
- 두 도시를 직접 연결하는 도로가 있으면, 그 두 정점이 연결된 ‘간선(Edge)’이 있다고 표현합니다.

이제 이 도시들을 나타내는 n × n $n×n$ 크기의 ‘인접행렬(Adjacency Matrix) A)’이란, 도시 번호를 행과 열에 적어두고, “도시 와 도시 j가 직접 연결되어 있으면 1, 아니면 0”을 적어놓은 표라고 볼 수 있습니다.

- 예를 들어 A \[2,5\] \= 1 $A[2,5]=1$ 이면, 도시 2에서 도시 5로 바로 가는 도로가 있다는 뜻이고,
- A \[2,5\] \= 0 $A[2,5]=0$ 이라면 그런 도로가 없다는 뜻입니다.

그렇다면 이 표(행렬) A를 여러 번 곱한다는 건 무슨 의미일까요?

- A 2 $A2$ (A를 2번 곱한 것)의 (i,j) $(i,j)$ 위치에 있는 숫자는 “도시 에서 출발해서 **정확히 2번의 도로** 를 거쳐 도시 j에 도달하는 모든 방법(‘경로’ 혹은 좀 더 정확히는 ‘워크(walk)’라 부름)의 개수”를 의미합니다.
- 예컨대 (i,j) $(i,j)$ 자리의 값이 3이라면, 도시 에서 두 번의 이동(도로 2개 사용)을 해서 도시 j에 도달하는 서로 다른 방법이 3가지 존재한다는 뜻이죠.
- 같은 식으로 A 3 $A3$ 의 (i,j) $(i,j)$ 위치 값은 “도시 i에서 정확히 3번의 도로를 거쳐 도시 로 가는 모든 방법의 개수”가 됩니다.

즉,

A k 의 (i,j) 원 소 \= ‘ 도 시 i 에 서 출 발 하 여 정 확 히 k 번 의 이 동 을 거 쳐 도 시 j 에 도 달 하 는 모 든 방 법 의 수 ’ $Ak의 (i,j) 원소=‘도시 i에서 출발하여 정확히 k번의 이동을 거쳐 도시 j에 도달하는 모든 방법의 수’$

가 되는 셈입니다. 이렇게 인접행렬을 거듭제곱하면 그래프에서의 여러 단계 경로(워크)들을 간단히 계산하고 관리할 수 있게 됩니다.