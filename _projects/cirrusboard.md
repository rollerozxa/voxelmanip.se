---
title: Cirrusboard
image: voxelmanip_forums
date: 2022-10-08
timeframe: "2022-"
technologies: "PHP, Twig, MariaDB/MySQL"
license: MIT
website: https://cirrus.voxelmanip.se
repo: https://github.com/Cirrusboard/Cirrusboard
---

Cirrusboard began as a high school work project (Gymnasiearbete) originally with the purpose to replace the old codebase that Voxelmanip Forums ran.

<!--more-->

This is the abstract for the report I wrote about it:

> This report details the development of a new forum software. The purpose of it was to both be a general purpose software and one that can replace the previous codebase that my website Voxelmanip Forums ran on, in order to see that it is functional and performant for a real-world forum.
>
> The work was divided into questions about the method that should be used for writing a web application. Namely choosing the technologies to use, structuring the software, implementing an account system and making the software secure and performant.
>
> The web stack that was chosen was LEMP, with PHP as the server-side language and MariaDB as the relational database engine. Modern standards for code encapsulation (using the templating engine Twig to separate the frontend and backend) and preventing common website attack vectors were used, and an account system was designed to allow for authentication and storing passwords in a secure manner. The frontend was initially designed as sketches on paper and later implemented using HTML and CSS, representing the data received from the backend PHP code.
>
> When the forum software was deemed complete enough to be production-ready, Voxelmanip Forums was migrated onto using the new forum software. The conclusion was that it worked as expected, has significantly improved code quality compared to the old codebase, and is either just as or more performant as the old codebase. However some bugs were discovered in the software which were fixed, and it lacked administration and moderation tools leading to the old codebase being kept around for moderation purposes. This is an area that could be further developed upon.

Cirrusboard is an open source general-purpose forum software, written in PHP using the Twig templating engine and intended to be as minimalist and lightweight as possible. It is inspired by the Acmlmboard family of forums and implements various features of Acmlmboard-style forums such as post layouts, but with better code quality and security than Acmlmboard.
