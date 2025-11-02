# Ensure friendlier Markdown handling for line breaks and headings.
# - Preserve multiple consecutive blank lines by converting extras to <br>
# - Ensure a blank line exists before ATX headings so they parse as headers
#   even when the author didn't insert an empty line (works around hard_wrap)

module MdSpacing
  def self.transform(raw)
    return raw unless raw.is_a?(String) && !raw.empty?

    lines = raw.gsub("\r\n", "\n").gsub("\r", "\n").split("\n", -1)
    new_lines = []
    in_fence = false
    fence_marker = nil
    blank_run = 0

    flush_blanks = lambda do
      if blank_run > 0
        # one real blank line ends the previous block
        new_lines << ""
        # additional blanks become <br> so vertical space is preserved
        (blank_run - 1).times { new_lines << "<br>" }
        blank_run = 0
      end
    end

    lines.each_with_index do |line, idx|
      # toggle fenced code blocks (``` or ~~~)
      if !in_fence && line =~ /^(```|~~~)/
        flush_blanks.call
        in_fence = true
        fence_marker = Regexp.last_match(1)
        new_lines << line
        next
      elsif in_fence && fence_marker && line.start_with?(fence_marker)
        new_lines << line
        in_fence = false
        fence_marker = nil
        next
      end

      if in_fence
        # inside code fences: do not alter spacing
        new_lines << line
        next
      end

      # count blank lines (lines containing only whitespace)
      if line.strip.empty?
        blank_run += 1
        next
      end

      # before emitting a non-blank line, resolve any queued blanks
      flush_blanks.call

      # ensure headings start a fresh block (so they don't get parsed as text
      # when hard_wrap turns prior newline into <br>). This applies even when
      # a heading follows another heading directly (e.g., `##` then `###`).
      if line =~ /^\s{0,3}\#{1,6}\s+/
        # if the previous emitted line isn't blank, insert a blank
        if new_lines.any? && new_lines.last !~ /^\s*$/
          new_lines << ""
        end
      end

      new_lines << line
    end

    # trailing blanks
    if blank_run > 0
      new_lines << ""
      (blank_run - 1).times { new_lines << "<br>" }
    end

    new_lines.join("\n")
  end
end

Jekyll::Hooks.register [:posts, :pages], :pre_render do |doc|
  next unless doc.respond_to?(:content) && doc.content

  # Only process Markdown sources; skip SCSS/HTML/assets.
  ext = if doc.respond_to?(:extname) && doc.extname
          doc.extname.downcase
        else
          File.extname(doc.path.to_s).downcase
        end

  allowed = %w[.md .markdown .mkd .mkdn .mdown]
  next unless allowed.include?(ext)

  doc.content = MdSpacing.transform(doc.content)
end
