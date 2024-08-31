---
title: Subdomains
description: This page lists all (public) subdomains under the voxelmanip.se domain.
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
