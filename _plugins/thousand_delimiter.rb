module Jekyll
	module ThousandDelimiterFilter
		def thousand_delimiter(number, delimiter = ' ')
			number.to_s.reverse.scan(/\d{1,3}/).join(delimiter).reverse
		end
	end
end

Liquid::Template.register_filter(Jekyll::ThousandDelimiterFilter)
