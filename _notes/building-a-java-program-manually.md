---
title: Building a Java program manually
last_modified: 2026-10-22
---

Typically when doing Java development you would use an IDE such as IntelliJ IDEA, Eclipse or VSCode with the Red Hat Java extension. However, if you want to forego all this graphical tooling for one reason or the other, it's very much possible to compile a Java program and build a JAR with nothing but the JDK on the command line.

<!--more-->

These instructions assume a Linux-y terminal environment with OpenJDK installed on your system. To follow along on Windows, you may use Git Bash as part of [Git for Windows](https://gitforwindows.org/) or a similar environment along with a OpenJDK build such as that from [Adoptium](https://adoptium.net/).

## The steps
We will assume a project directory with the following structure - a `src/` directory with however many Java source files you have and a `resources/` directory with data files.

```
- src/
	- `se/voxelmanip/example/Hello.java`
- resources/
	- cuddles.txt
```

Open a terminal in the project directory. And make a new directory for our build output:

```bash
mkdir -p jar
```

Then we will compile the Java source files with `javac`, using `find` to recursively get all the Java source files in `src/`, and then output them to `jar/`.

```bash
javac --release 21 -d jar $(find src -name "*.java")
```

-  The `--release` argument can be used to select which version of Java to target for wider compatibility, but is optional. If omitted, it will use the same version that your version of the JDK is.
-  If you have external libraries in the form of a binary JAR, you can add them to the classpath with `-cp lib/example.jar` to link against them, putting libraries in `lib/`.

Let's copy over the resource files to the JAR:

```bash
cp -r resources/* jar
```

Optionally, if you have any libraries you want to include in the JAR, you can copy the classes to the `jar/` directory now.

Then, package it up into a JAR with `jar`. The first argument specifies first what action we should take (`c` for create), then more letters for additional options. `f` specifies the JAR filename and `e` the entrypoint which is the class where your main function is, if you want the JAR to be runnable.

```bash
jar cfe hello.jar se.voxelmanip.example.Hello -C jar .
```

If you have the right file associations in your OS then you should be able to double click the resulting JAR, or run the following:

```bash
java -jar hello.jar
```

The above commands to build the JAR can be put together into a `build.sh` script, cleaning the `jar/` directory first to make sure that you get a clean build with no remnants between builds.

## Bonus: jshell
`jshell` was added in JDK 9 and functions as a REPL-like environment for exploratory programming with Java. It allows you to write Java code on the command-line and it will automatically build and run it, printing the output to the terminal.

```bash
|  Welcome to JShell -- Version 21.0.12.1
|  For an introduction type: /help intro

jshell> System.out.println("Hello world...");
Hello world...
```
