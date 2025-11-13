# Automatically add captions to images using their alt text.
# Wraps <img> tags with alt attributes in <figure> tags and adds <figcaption>.

module ImageCaption
  def self.add_captions(content)
    return content unless content.is_a?(String) && !content.empty?

    # First pass: Handle images wrapped in <p> tags
    # Matches: <p><img ... alt="..." ... /></p> or <p><img ... alt="..." ... ></p>
    content = content.gsub(/<p>\s*(<img[^>]+alt=["']([^"']+)["'][^>]*\/?>\s*)<\/p>/m) do
      img_tag = $1.strip
      alt_text = $2
      "<figure>#{img_tag}<figcaption>#{alt_text}</figcaption></figure>"
    end
    
    # Second pass: Handle standalone images not in <p> or <figure>
    # This will catch images that weren't wrapped by Jekyll
    content = content.gsub(/^(\s*)(<img[^>]+alt=["']([^"']+)["'][^>]*\/?>)\s*$/m) do
      indent = $1
      img_tag = $2
      alt_text = $3
      
      # Check if this line is part of a figure already (simple check)
      # by looking if the match is immediately preceded or followed by figure tags
      preceding_line = content[0...($~.begin(0))].split("\n").last || ""
      following_line = content[($~.end(0))..-1].split("\n").first || ""
      
      if preceding_line.include?("<figure") || following_line.include?("</figure>")
        $&  # Return original match
      else
        "#{indent}<figure>#{img_tag}<figcaption>#{alt_text}</figcaption></figure>"
      end
    end
    
    content
  end
end

# Hook into Jekyll's rendering pipeline
# Use post_render to process the final HTML output
Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
  next unless doc.respond_to?(:output) && doc.output
  
  doc.output = ImageCaption.add_captions(doc.output)
end

