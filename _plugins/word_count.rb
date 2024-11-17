module Jekyll
	class WordCountPerYear < Generator
		priority :low

		def generate(site)
			posts_by_year = site.posts.docs.group_by { |post| post.date.year }

			@word_counts_by_year = posts_by_year.transform_values do |posts|
				posts.sum do |post|
					content = post.content
					content.split(/\s+/).size
				end
			end

			site.config['word_counts_by_year'] = @word_counts_by_year
		end
	end
end
