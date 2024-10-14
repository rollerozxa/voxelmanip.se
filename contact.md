---
title: Contact
description: You can contact me through a number of different ways.
---

You can contact me through a number of different ways. The list is ordered by roughly how frequently I check these accounts or how good of an idea it is to contact me through the platform.

<table>
	{% for contact in site.data.contact %}
		<tr>
			<th>{{ contact.name }}</th>
			<td id="{{ contact.id }}">{{ contact.value }}</td>
			<td>{{ contact.note }}</td>
		</tr>
	{% endfor %}
</table>

I prefer English for text communication, but if you contact me privately in Swedish I will usually respond back in Swedish.

<script>
document.getElementById('email').innerHTML = atob('PGEgaHJlZj0ibWFpbHRvOnJvbGxlcm96eGFAdm94ZWxtYW5pcC5zZSI+cm9sbGVyb3p4YUB2b3hlbG1hbmlwLnNlPC9hPg==');
document.getElementById('xmpp').innerHTML = atob('cm9sbGVyb3p4YUB2b3hlbG1hbmlwLnNlCg==');
</script>
