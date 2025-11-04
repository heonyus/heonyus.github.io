# Markdown 표를 HTML로 변환하는 Jekyll 플러그인
Jekyll::Hooks.register :posts, :post_render do |post|
  # 렌더링된 HTML에서 <p> 태그 안의 표를 찾아서 HTML 테이블로 변환
  if post.output
    post.output = post.output.gsub(/<p>(\s*\|.+?\|[\s\S]*?\|.+?\|)\s*<\/p>/m) do |match|
      content = $1
      lines = content.strip.split("\n")
      
      # 최소 3줄 (헤더, 구분선, 데이터) 필요
      next match if lines.length < 3
      
      # 구분선 확인
      separator_idx = lines.index { |line| line.match?(/^\|[\s:|-]+\|$/) }
      next match unless separator_idx && separator_idx > 0
      
      # 헤더 파싱
      headers = lines[0].split('|').map(&:strip).reject(&:empty?)
      next match if headers.empty?
      
      # 데이터 행 파싱
      rows = lines[(separator_idx+1)..-1].map do |line|
        line.split('|').map(&:strip).reject(&:empty?)
      end
      
      # HTML 테이블 생성
      html = "<table>\n<thead>\n<tr>\n"
      headers.each { |h| html += "<th>#{h}</th>\n" }
      html += "</tr>\n</thead>\n<tbody>\n"
      
      rows.each do |cells|
        html += "<tr>\n"
        cells.each { |c| html += "<td>#{c}</td>\n" }
        html += "</tr>\n"
      end
      
      html += "</tbody>\n</table>"
      html
    end
  end
end

