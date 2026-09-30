---
title: "Flower School Lessons Archive"
layout: flower-school
lessons:
  - title: "Lesson #01 - Sun and Water"
    url: 1
  - title: "Lesson #02 - Fertilizers, seeds, stars"
    url: 2
  - title: "Lesson #03 - Warp"
    url: 3
  - title: "Lesson #04 - Flower friends = FREE seeds and stars!"
    url: 4
  - title: "Lesson #05 - Enter draws, win instant prizes!"
    url: 5
  - title: "Lesson #06 - Important tips for new players"
    url: 6
  - title: "Lesson #07 - Global Compost Heap"
    url: 7
  - title: "Lesson #08 - Stars Exchange"
    url: 8
  - title: "Lesson #09 - Transfer Between Flowers"
    url: 9
  - title: "Lesson #10 - Time Jump"
    url: 10
  - title: "Lesson #11 - Checklists"
    url: 11
  - title: "Lesson #12 - Galaxy construction and Galactic Hero"
    url: 12
  - title: "Lesson #13 - PGM Bookie"
    url: 13
  - title: "Lesson #14 - Offer Bonus"
    url: 14
---

This is a reconstructed archive of the Flower School lessons for the <a href="https://android.voxelmanip.se/games/origami-flowers">Origami Flowers</a> series of mobile games by Adam Schmelzle. These lessons were intended to teach new players about the game and its features.

The servers for the Origami Flowers games were shut down in December 2017, and is no longer available to play. This archive has been made to preserve information about how the game worked, as explained through its own help system.

The lesson texts have been reconstructed by performing OCR on the <a href="https://www.youtube.com/watch?v=9GRzC8TXLGU">only known surviving screen recording of the lesson pages</a> with Tesseract and manually cleaning up the text afterwards. There may be mistakes in the reconstruction, and the dynamic content of the pages that would be fetched from the current player's state is not present.

<h3>Lessons</h3>

<ul>
  {% for lesson in page.lessons %}
    <li><a href="{{ lesson.url }}/">{{ lesson.title }}</a></li>
  {% endfor %}
</ul>
