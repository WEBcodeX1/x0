
**Define a proposal for global CSS styles**

Question: it must be clarified whether `<a>` or `<button>` elements should be used and / or both is possible

As soon as it is a "navigation", we need the `<nav>` element around it.
Note: The use of the `<nav>` element automatically communicates that a section has a navigation function. We should always use the correct semantic HTML element rather than ARIA that can come later.

**normal menu:**

```
<nav class="menu">
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

**tab menu for example:**

```
<nav class="tab-menu">
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```
The semantics of the nav element is to provide links. However, a nav element does not need to contain a list, but it can contain other types of content as well.

**example:**

```
<nav>
   <a href="#">Home</a>
   <a href="#"> About </a>
   <a href="#"> Contact</a>
</nav>
```
**icons:**

I would solve icon integration via css pseudo `:before` / `:after`, to which `<a>` or `<button>` or even` <div>` can be added accordingly
