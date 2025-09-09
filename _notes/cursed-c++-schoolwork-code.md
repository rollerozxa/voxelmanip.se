---
title: Cursed C++ schoolwork code
last_modified: 2025-09-09
---

In the first year of gymnasiet (equiv. to 10th grade) we had introductory programming lessons using C++ (read: C with `iostream`), that we would then combine with electricity lessons to apply onto Arduino boards.

For the programming theory part, one of the assignments we had was to write a short program containing a custom function to add two integer numbers together and return the sum, which would then be called and printed out using `cout` in the main function. Simple programming exercise. Then I looked over to the classmate sitting next to me and I saw this.

<!--more-->

```cpp
#include <iostream>

using namespace std;

int min_funktion(int a, int b);

int a = 1;
int b = 2;

int min_funktion(int a, int b);
	int summa = a + b;

int main()
{
	cout << summa << endl;
	return 0;
}
```

While this solution completely missed the point of the assignment, it ended up nonetheless being completely valid C++ code that compiles and prints the expected output based on the hardcoded values, which he was very excited to show me by compiling and running it.

I still wonder if he did it intentionally merely to mess with me knowing I would see and react to it.

---

For completeness, this was my own solution for the assignment:

```cpp
#include <iostream>

using namespace std;

int summa(int num1, int num2) {
	return num1 + num2;
}

int main() {
	cout << summa(4, 5) << endl;
	cout << summa(0, 1) << endl;
	cout << summa(13, 57) << endl;

	return 0;
}
```
