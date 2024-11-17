---
title: Merits
---

This page contains the various educational merits I have.

## University
Currently studying a bachelor's degree in Software Engineering.

- Application Development for the Android Platform, 7.5hp*
- Web Development with Javascript, 7.5hp*
- Scientific Writing and Argumentation, 7.5hp*
- Object Oriented Programming II, 7.5hp*
- Object Oriented Programming I, 7.5hp
- Discrete Mathematics for Programmers, 7.5hp
- Software Engineering, 7.5hp
- Databases - Modelling and Implementing, 7.5hp
- Data and Computer Communications with Applications in Linux, 7.5hp
- Web Programming with HTML5, CSS3 and JavaScript, 7.5hp
- Programming Fundamentals, 7.5hp
- Introduction to Software Engineering, 7.5hp

\* Denotes courses not yet completed

## Gymnasium (upper secondary school)
I studied the technical program in gymnasiet with an orientation on information technology. I chose to study extended courses within mathematics and physics as well as the extended courses within "Teknikcollege", resulting in a total of **2800** points.

<table>
	<tr>
		<th>Course</th>
		<th>Name</th>
		<th>Points</th>
		<th>Grade</th>
		<th>Notes</th>
	</tr>
	{% for course in site.data.merits_gymnasium %}
		<tr>
			<td class="right mono">{{ course.id }}</td>
			<td>{{ course.name }}</td>
			<td class="right">{{ course.points }}</td>
			<td class="right">{{ course.grade }}</td>
			<td>{{ course.notes }}</td>
		</tr>
	{% endfor %}
</table>
