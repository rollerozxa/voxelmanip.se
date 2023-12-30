---
title: Memcached vs. APCu for PHP
cover_alt: Image of the memcached rabbits running towards the left, with text on the bottom that says "Memcached vs. APCu"
redirect_from: /2023/08/15/Memcached-Vs-APCu/
---

When you are using an SQL database it is always useful to combine it with some sort of key-value store with less overhead to act as caching, either for heavy queries or if you just want to aggressively optimise page load speeds.

<!--more-->

Previously I have used [memcached](https://memcached.org/) for caching certain things in [principia-web](/projects/principia-web/). It has worked well, but it also always felt needlessly slow. Memcached is a server that runs independently of PHP, so you will need to communicate back and forth between PHP and the memcached server. Initially I used the default TCP connection but when the memcached server is running on the same machine there is some needless overhead using TCP. So I ended up switching to connecting via Unix sockets which seemed to perform generally faster.

*(While writing this blog post I realised that memcached also supports UDP, something I hadn't previously tested, but if you skip to the benchmark table below you can see that it is actually significantly faster than both TCP and Unix sockets.)*

Enter [APCu](https://www.php.net/manual/en/book.apcu.php) (or the APC User Cache), a PHP extension that provides an in-memory key-value store that persists for as long as the PHP master process (i.e. `php-fpm` or `mod_php`) is running. As it is a part of PHP, there won't be any kind of round-trip necessary between PHP and the cache store, which should make it faster than memcached. I rewrote the cache class to call APCu instead of memcached in principia-web and my hypothesis was quickly confirmed as the cache became faster to read from, lowering page load times.

I presume the difference between APCu and memcached would be like an embedded SQL database such as SQLite, versus an SQL database running as a dedicated server such as MariaDB. Both in terms of performance and scalability, SQLite being fast for small workloads since it's minimal and exists inside of the process making use of the database. But once you need to scale up a dedicated database server such as MariaDB makes more sense.

## Just give me some fuckin' numbers!
Surprisingly, I couldn't find much benchmarks or performance statistics actually comparing APCu and memcached. So here were some quick numbers I got from writing a [quick and dirty benchmark script](https://gist.github.com/rollerozxa/62540b7a263c39520d0dccc17cf53ce5), comparing APCu against memcached with the three different types of connections.

<table>
	<tr>
		<th style="border:0"></th>
		<th rowspan=2>APCu</th>
		<th style="border:0" colspan=3>memcached</th>
	</tr>
	<tr>
		<th></th>
		<th>TCP</th>
		<th>UDP</th>
		<th>Socket</th>
	</tr>
	<tr>
		<td>Read 50k keys</td>
		<td>0.005s</td>
		<td>0.691s</td>
		<td>0.030s</td>
		<td>0.594s</td>
	</tr>
	<tr>
		<td>Write 50k keys (short string)</td>
		<td>0.016s</td>
		<td>0.703s</td>
		<td>0.024s</td>
		<td>0.607s</td>
	</tr>
	<tr>
		<td>Write 50k keys (8KB)</td>
		<td>0.165s</td>
		<td>1.608s</td>
		<td>0.672s</td>
		<td>1.443s</td>
	</tr>
</table>

When benchmarked, the difference between TCP and Unix sockets for memcached turned out to not be all that large after all, and UDP turned out to be significantly faster than both. However, no way of connecting to memcached outcompetes APCu's performance, which makes sense considering you cannot fully eliminate the round-trip required to the memcached server.

## In defense of memcached...
In regards to my use cases of a key-value data store for caching in principia-web, APCu works very well and performs better than memcached. However, I am aware that there are some features of memcached that APCu does not have, most importantly the fact that memcached can be scaled up by adding more servers to the cluster. Memcached also runs independently of PHP and is not exclusive to the PHP ecosystem, so if you would want other languages to interface with a memcached cache you would be able to do that.

As APCu is directly tied to the PHP process, it also means that it will be cleared whenever PHP is updated or restarted (for reconfiguration or similar). This will usually make the cache less long-running than a memcached server that can run independently. APCu also appears to not have any way of persisting cache data between restarts, while memcached does have some ways of saving cached data during restarts (using `-e`).
