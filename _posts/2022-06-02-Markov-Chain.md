---
layout: post
title: "An Example of Statistical Investigation of the Text Eugene Onegin Concerning the Connection of Samples in Chains(1913)"
date: 2022-06-01
tags: [paper, markov]
---

# Intro
일반적인 확률론의 가정을 깨고, 현실 세계 데이터에서 발생하는 종속성(연결성)을 수학적으로 모델링하고 증명하고자 함 </br>

## Data
Pushkin의 소설 Eugene Onegin(실제 데이터)의 첫장 전체와 두 번째 장 16개 연을 분석 
- 총 데이터 양: 20,000 개의 러시아어 알파벳 문자(20,000개의 연결된 시행;Connected Trials)
- 제외 문자: 러시아어의 단단한 부호(ъ), 부드러운 부호(ь)는 독립적으로 발음되지 않음

## Variable
20,000개의 문자를 모음(vowel) 또는 자음(consonant) 중 하나로 분류되는 시행으로 간주
- 연결된 시행(Connected Trials)'의 의미: 종속성 입증
- 마르코프가 이 20,000개의 문자를 '독립적인 시행'이 아닌 '연결된 시행'으로 간주했다는 사실 자체가 이 연구의 핵심 목적
- 고전적인 통계 모델(예: 베르누이 시행)은 각 시행이 서로 독립적이라고 가정하기 때문에...!
- 현실 세계의 많은 현상, 특히 언어 텍스트와 같은 연속적인 데이터에서는 고전적인 확률론이 가정하는 것처럼 각 시행이 독립적이지 않다는 것을 마르코프가 증명하고자 했다는 뜻

# Experiment
Quantifying Probability and Dependence</br>
확률 및 종속성 정량화

1. 기본 확률 ($p$) 계산
