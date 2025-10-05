# 수식 내부의 파이프(|) 문자가 테이블 구분자로 인식되는 것을 방지
# kramdown이 파싱하기 전에 수식 내부의 | 를 HTML 엔티티로 변환

Jekyll::Hooks.register :posts, :pre_render do |post|
  # 인라인 수식 ($...$) 내부의 | 를 &#124;로 변환
  post.content = post.content.gsub(/\$([^\$]+)\$/) do |match|
    inner = $1
    if inner.include?('|')
      # 파이프를 HTML 엔티티로 변환
      inner_escaped = inner.gsub('|', '&#124;')
      "$#{inner_escaped}$"
    else
      match
    end
  end
  
  # 블록 수식 ($$...$$) 처리 - 보통 블록 수식은 문제없지만 안전을 위해
  post.content = post.content.gsub(/\$\$([^\$]+)\$\$/) do |match|
    inner = $1
    if inner.include?('|') && !inner.include?('\\begin') # LaTeX 환경 제외
      inner_escaped = inner.gsub('|', '&#124;')
      "$$#{inner_escaped}$$"
    else
      match
    end
  end
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  # 페이지도 동일하게 처리
  if page.content
    page.content = page.content.gsub(/\$([^\$]+)\$/) do |match|
      inner = $1
      if inner.include?('|')
        inner_escaped = inner.gsub('|', '&#124;')
        "$#{inner_escaped}$"
      else
        match
      end
    end
    
    page.content = page.content.gsub(/\$\$([^\$]+)\$\$/) do |match|
      inner = $1
      if inner.include?('|') && !inner.include?('\\begin')
        inner_escaped = inner.gsub('|', '&#124;')
        "$$#{inner_escaped}$$"
      else
        match
      end
    end
  end
end
