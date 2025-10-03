(function(){
  'use strict';

  // 간단한 BM25 구현 (Okapi BM25)
  function tokenize(text){
    return (text||'').toLowerCase().replace(/[^a-z0-9가-힣\s]/g,' ').split(/\s+/).filter(Boolean);
  }

  function buildIndex(docs){
    const index = {docs: [], df: new Map(), avgdl: 0};
    let totalLen = 0;
    docs.forEach((doc, id)=>{
      const tokens = tokenize(doc.title + ' ' + doc.content);
      const tf = new Map();
      tokens.forEach(t=> tf.set(t, (tf.get(t)||0)+1));
      const unique = new Set(tokens);
      unique.forEach(t=> index.df.set(t, (index.df.get(t)||0)+1));
      const dl = tokens.length;
      totalLen += dl;
      index.docs.push({id, url: doc.url, title: doc.title, date: doc.date, tf, dl});
    });
    index.N = index.docs.length;
    index.avgdl = index.N ? (totalLen / index.N) : 0.0;
    return index;
  }

  function bm25Score(index, doc, queryTokens, k1=1.5, b=0.75){
    let score = 0;
    queryTokens.forEach(q=>{
      const n = index.df.get(q) || 0;
      if(n===0) return;
      const idf = Math.log( (index.N - n + 0.5) / (n + 0.5) + 1 );
      const f = doc.tf.get(q) || 0;
      const denom = f + k1 * (1 - b + b * (doc.dl / (index.avgdl||1)));
      if(denom>0) score += idf * ( (f * (k1 + 1)) / denom );
    });
    return score;
  }

  function formatResult(doc){
    const wrapper = document.createElement('a');
    wrapper.className = 'c-archives__item';
    wrapper.href = doc.url;
    wrapper.innerHTML = `<time class="c-archives__date">${doc.date}</time><h3 class="c-archives__title">${doc.title}</h3>`;
    return wrapper;
  }

  function main(){
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const meta = document.getElementById('search-meta');
    if(!input || !results) return;

    const docs = (window.__POST_INDEX__ || []).slice();
    const index = buildIndex(docs);

    function run(){
      const q = input.value.trim();
      results.innerHTML = '';
      if(!q){ meta.textContent=''; return; }
      const qTokens = tokenize(q);
      const scored = index.docs.map(d=>({doc:d, score: bm25Score(index, d, qTokens)}))
        .filter(x=>x.score>0)
        .sort((a,b)=>b.score-a.score)
        .slice(0,50)
        .map(x=>x.doc);
      meta.textContent = `${scored.length} result(s)`;
      scored.forEach(d=> results.appendChild(formatResult(d)));
    }

    // 쿼리 파라미터에서 q를 읽어 초기 검색
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q');
    if(initial){ input.value = initial; }
    input.addEventListener('input', run);
    input.focus();
    run();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();


