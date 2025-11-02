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
1. PatchCore는 cold-start 산업 이상 감지를 위해 ImageNet 사전 훈련 모델에서 추출된 nominal patch-feature의 지역적으로 집계된 미드레벨 피처를 활용하여 대표적인 메모리 뱅크를 구축하는 새로운 방법을 제안함
2. 이 방법은 MVTec AD 벤치마크에서 이미지 레벨 이상 감지 AUROC 99.6%를 달성하여 기존 최첨단(state-of-the-art) 성능을 뛰어넘고, 이상 위치 파악(localization)에서도 우수한 결과를 보여줍니다.
3. ⏱️ PatchCore는 핵심 세트 서브샘플링(coreset subsampling)을 통해 메모리 뱅크의 중복성을 줄이고 추론 시간을 크게 단축하여 실용적인 산업 환경에 적합하며, 적은 수의 샘플(low-shot) 시나리오에서도 높은 효율성을 보입니다.