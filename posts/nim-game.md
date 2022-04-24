---
title: "Nim"
date: "2017-12-19"
tags: ["game", "math", "algorithm"]
categories: ["math"]
---

## 前言

最近在公司活动中参与了一个博弈游戏，规则比较简单，游戏必胜策略却又耐人寻味，游戏内容就是有三堆物件，数量分别为 $3, 5, 7$ 个，两位玩家轮流从这三堆物件中取物，每次取物只能在三堆物品中选择其中一堆并至少取走一个，可以直接一堆取完，当所有堆都取完时游戏随即结束并且最后取的玩家判输。
这个游戏其实是一个叫 Nim 博弈游戏的一种衍生玩法，通常 Nim 游戏的获胜目标是争取成为最后一个取完的玩家，如果反着来，最后一个取完的玩家判为输，则是 Nim 游戏的一种变形 Anti-Nim，具体介绍参考 [#wiki](https://en.wikipedia.org/wiki/Nim#Game_play_and_illustration)。

据了解这个游戏源自中国，后由到美洲打工的华人外传，之所以称为 Nim 有个说法称是由粤语的“拈”音译而得，Nim 游戏后来也演化出多个版本的玩法，它的必胜策略直到 20 世纪初才由一个叫 [Charles L. Bouton](https://en.wikipedia.org/wiki/Charles_L._Bouton) 的数学家在他的一篇论文 [Nim, A Game with a Complete Mathematical Theory](http://www.jstor.org/stable/1967631?origin=crossref&seq=1#page_scan_tab_contents) 中给出。

## 思考

以取石子为例，假定 $w$ 为石子的总数 $(w \ge 1)$，这些石子被分为 $n$ 堆$(n \ge 1)$，局面状态以 $(x_1, x_2, \ldots,x_n)$ 进行表示，考虑以下情形:

1. 当 $n = 1$ 同时 $w = 1$ 时，显然先手胜；
2. 当 $n = 2$ 时，分析如下：

   ① $(1, 1)$ 局面，显然先手败；

   ② $(1, x)$ 局面，其中 $x > 1$，此时先手只需在 $x$ 中取走 $x - 1$，即变为 $(1, 1)$ 这种“安全局面”即可获胜；

   ③ $(x, x)$ 局面，其中 $x > 1$，此时先手取后变为$(x_1, x)$，后手总是能使局面转变为 $(x_1, x_1)$，若先手不服气，后手总能使局面往 ① 情况发展，先手必败；

   ④ $(x_1, x_2)$ 局面， 其中 $x_1 > 1$ 且 $x_2 > 1$，同时有 $x_1 \neq x_2$，此时先手必定能将局面转变为 ③ ，此时先手必胜；

   根据以上，若 $x_1 \neq x_2$ 时，$x_1 \oplus x_2 \neq 0$ 先手存在必胜策略，若 $x_1 = x_2$ 时，$x_1 \oplus x_2 = 0$ 后手存在必胜策略。

3. $n > 2$ 最终都会转化为 $n = 2$ 的情形，先手必胜需设法将局面转向 2.④，后手必胜需设法将局面转向 2.③

### 组合博弈（Combinatorial Game）

符合以下特性的博弈称为组合博弈：

```
1. 只有两位玩家
2. 游戏的局面是有限集
3. 游戏规则针对双方，每个局面的转移都要合法。如果两者的移动规则一样，称为对等博弈(impartial games)，否则为不对等博弈(partizan games)。
4. 双方轮流操作
5. 当轮到一方已无法继续操作时，游戏结束。在正常的游戏规则下，最后一个操作的人赢。在 misere 游戏规则下，最后一个操作的人输。
6. 游戏在有限步结束。
```

Nim Game 符合组合博弈的定义，由于移动规则对先后手一样，所以是对等组合博弈 (Impartial Combinationrial Game)。

### P 态(P-position)、N 态(N-position)

P 即 Previous，N 即 Next。规定局面对于上一个操作者可赢的局面状态为 P 态，对于接下来的操作者可赢的局面状态为 N 态，而当局面操作无法继续进行时则定义为终态(Terminal Position)。

对于正常规则下的对等组合博弈，P 态和 N 态有以下几个特征：

```
1. 所有的终态都是 P 态。
2. 从 N 态开始总有方法转化为 P 态。
3. 从 P 态开始总是无法避免的会转化为 N 态。
```

### Bouton 定理

要证明一种判定 position 性质的方法的正确性需要证明以下三个命题：

```
1. 这个判定方法判定终态(Terminal position)为 P-position。
2. 被该方法判定为 P-position 的局面，无法转化为其他 P-position 的局面，或者说必定会转化为 N-position。
3. 被该方法判定为 N-position 的局面，至少存在一种往 P-position 转化的途径。
```

**定理： 对于一个 Nim 游戏，局面为 $(x_1,\ldots, x_n)$，它是 P-position 当且仅当 nim-sum $= 0$ （即: $x_1 \oplus \ldots \oplus x_n = 0$），相对的，当 nim-sum $\neq 0$ 时，局面为 N-position。**

证明：

Nim Game 的终态为(0,...,0)，$0$ $\oplus$...$\oplus$ $0$ = 0，因此终态为 P-position，命题 1 得证。

注意到 nim-sum 的运算满足类似加法的结合律与交换律，同时还有两个相同的数异或结果为 0 的特性。我们以 $x_1$,..., $x_n$ 表示移动前的状态，以 $y_1$,...,$y_n$ 为移动后的状态，设 s = $x_1$ $\oplus$...$\oplus$ $x_n$ ，t = $y_1$ $\oplus$...$\oplus$ $y_n$，当移动的堆为第 k 堆，我们有 $x_i$ = $y_i$ 且 i ≠ k，$x_k$ > $y_k$。根据异或的特性可得：
t = 0 $\oplus$ t
= s $\oplus$ s $\oplus$ t
= s $\oplus$ ($x_1$ $\oplus$ ... $\oplus$ $x_n$) $\oplus$ ($y_1$ $\oplus$ ... $\oplus$ $y_n$)
= s $\oplus$ ($x_1$ $\oplus$ $y_1$) $\oplus$ ... $\oplus$ ($x_n$ $\oplus$ $y_n$)
= s $\oplus$ 0 $\oplus$ ... $\oplus$ 0 $\oplus$ ($x_k$ $\oplus$ $y_k$) $\oplus$ 0 $\oplus$ ... $\oplus$ 0
= s $\oplus$ $x_k$ $\oplus$ $y_k$
因此： t = s $\oplus$ $x_k$ $\oplus$ $y_k$
对于 P-position 的局面，有 s = 0，t = $x_k$ $\oplus$ $y_k$ 又由异或的特性可得 $x_k$ $\oplus$ $y_k$ ≠ 0，因此 t ≠ 0 。即 P-position 总是无法避免的会转化为 N-position，命题 2 得证。

对于 N-position 的局面，有 s ≠ 0，设第 d 位为 s (以二进制表示) 最左边不为 0 的位，可以找到第 k 堆 $x_k$ (以二进制表示) 的第 d 位不为 0 。再使 $y_k$ = s $\oplus$ $x_k$，已知 $x_k$ > $y_k$ ，$x_k$ 与 $y_k$ 的二进制位从最左边至 d 位相同。将 d 位的 1 变为 0 ，d 位右侧余下的二进制位最高为 $2^d$ - 1。第一位玩家可以从第 k 堆中拿走 $x_k$ - $y_k$ 的物品，使得
t = s $\oplus$ $x_k$ $\oplus$ $y_k$
= s $\oplus$ $x_k$ $\oplus$ (s $\oplus$ $x_k$)
= 0
即 N-position 总能找到方法使得局面向 P-position 转化，命题 3 得证。
证毕。

对于实际进行中的 Nim 游戏，当玩家面对 $x_1 \oplus x_2 \oplus \ldots \oplus x_k \ldots \oplus x_n = 0$ 的局面时，无论怎么取都会使 $x_1 \oplus x_2 \oplus \ldots \oplus y_k \ldots \oplus x_n \neq 0$，而当玩家面对 $x_1 \oplus x_2 \oplus \ldots \oplus x_k \ldots \oplus x_n \neq 0$ 则总有办法使 $x_1 \oplus x_2 \oplus \ldots \oplus y_k \ldots \oplus x_n = 0$。因此对于 Nim 游戏有结论：当 $x_1 \oplus x_2 \oplus \ldots \oplus x_n = 0$ 则后手存在必胜策略，当 $x_1 \oplus x_2 \oplus \ldots \oplus x_n \neq 0$ 时，先手若采取最优策略必胜，此时的必胜策略也是显而易见的，只要每次使 $x_1 \oplus x_2 \oplus \ldots \oplus x_n = 0$ 把必败态交给对方即可取胜。

## 相关题目

[杭电 oj：取(m 堆)石子游戏](http://acm.hdu.edu.cn/showproblem.php?pid=2176)

[LeetCode: Nim Game](https://leetcode.com/problems/nim-game/)

[codewars: Nim](https://www.codewars.com/kata/nim/train/javascript)

> This kata explores writing an AI for a two player, turn based game called NIM.
> **The Board**
>
> The board starts out with several piles of straw. Each pile has a random number of straws.
>
> Pile 0: ||||
>
> Pile 1: ||
>
> Pile 2: |||||
>
> Pile 3: |
>
> Pile 4: ||||||
>
> ...or more concisely: [4,2,5,1,6]
>
> **The Rules**
>
> The players take turns picking a pile, and removing any number of straws from the pile they pick
> A player must pick at least one straw
> If a player picks the last straw, she wins!
>
> **The Task**
>
> In this kata, you have to write an AI to play the straw picking game.
>
> You have to encode an AI in a function choose_move (or chooseMove, or choose-move) that takes a board, represented as a list of positive integers, and returns
>
> _[pile_index, number_of_straws]_
>
> Which refers to an index of a pile on the board, and some none-zero number of straws to draw from that pile.
>
> The test suite is written so that your AI is expected to play 50 games and win every game it plays.

根据 Bouton 定理：

$$0 = s \oplus x_k \oplus y_k$$

$$s \oplus 0 = s \oplus s \oplus x_k \oplus y_k$$

$$s = x_k \oplus y_k$$

$$y_k = s \oplus x_k$$

解题：

```javascript
function chooseMove(state) {
  let nim_sum = state.reduce((s, a) => (s ^= a), 0);
  let n = state.find(
    (element, index, arr) => (element ^ nim_sum) <= arr[index]
  );
  return [state.indexOf(n), n - (n ^ nim_sum)];
}
```

## 参考

[组合数学](https://book.douban.com/subject/10606626/) 1.7 节

[编程之美](https://book.douban.com/subject/3004255/) 1.12 节

[Nim, A Game with a Complete Mathematical Theory](http://www.jstor.org/stable/1967631?origin=crossref&seq=1#page_scan_tab_contents)

[wiki#Nim](https://en.wikipedia.org/wiki/Nim#Game_play_and_illustration)

[Game Theory](https://www.cs.cmu.edu/afs/cs/academic/class/15859-f01/www/notes/comb.pdf)
