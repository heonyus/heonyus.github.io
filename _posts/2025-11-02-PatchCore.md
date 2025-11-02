---
layout: post
title: "PatchCore(2022)"
date: 2025-11-02
description: "Towards Total Recall in Industrial Anomaly Detection"
tags:
  - AD
  - Vision
---
# Abstract
공장과 같은 산업 현장에서는 불량 사례를 의도적으로 많이 만들기가 어렵죠.(애초에 불량은 드문 사건)
그렇다고 일부러 결함을 만들기엔 리스크가 큽니다.
게다가 불량의 형태도 매번 다르고 실제 라벨링은 이미지 픽셀단위의 주석까지 요구돼 인력과 시간이 많이 들죠.
이런 상황에서 정상 이미지만으로 이상 감지를 해야하는 cold-start(=one-class)로 문제를 해결하려합니다.

본 논문에서는 ImageNet 사전학습 백본에서 뽑은 mid-level 패치 특징을 모아 대표적 메모리 뱅크를 만들고 거기에 KNN 최근접 이웃 기반으로 테스트 패치가 정상 분포에서 벗어났는지 측정하는 PatchCore를 제안합니다.
또한 coreset subsampling으로 메모리 중복을 줄여 추론 속도/메모리를 잡습니다.

# Introduction
인간처럼 적은 nomal 이미지의 예시만 보고도 이상 징후를 구분하려는 능력을 CV로 구현하려는 과제입니다.
공정에서의 결함들은 얇은 스크레치부터 부품 누락 등등 엄청 다양하죠.
그리고 정상의 이미지는 쉽게 얻을 수 있지만 모든 불량의 경우의 수는 미리 모으기 어렵습니다.
그래서 훈련분포(nomal sample)와 분포 밖(anomaly sample)을 가르는 OOD(Out-of-Distribution) 탐지로 접근한답니다.

- OOD(Out-of-Distribution): 모델이 훈련 중에 본 적 없는 낯선 장면이나 객체가 입력될 때 모델이 이를 탐지하고 경고를 울리는 것.

