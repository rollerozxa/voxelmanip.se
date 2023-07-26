---
---

# Subdomains
This page lists all (public) subdomains under the `voxelmanip.se` domain.

<table>
	<tr><th>Subdomain</th><th>Hosted by</th><th>Source</th><th>Description</th></tr>
	{% for subdomain in site.data.subdomains %}
		<tr>
			<td><a href="https://{{ subdomain.domain }}{% if subdomain.domain != "@" %}.{% endif %}voxelmanip.se/">{{ subdomain.domain }}</a></td>
			<td>{{ subdomain.host }}</td>
			<td>{% if subdomain.source %}<a href="{{ subdomain.source }}">Source</a>{% else %}N/A{% endif %}</td>
			<td>{{ subdomain.description }}</td>
		</tr>
	{% endfor %}
</table>

## Request a subdomain
If we're friends and you'd like a subdomain for some project, [contact me](/about/#contact) and I'll probably agree, assuming the project is legal and tasteful.
