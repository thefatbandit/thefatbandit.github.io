---
recent: false
hidden: true
title: "Shortcodes Samples"
date: 2020-06-08T08:06:25+06:00
description: Shortcodes sample
hero: boat.jpg
mermaid: true
---

This is a sample post intended to test the followings:

- Default hero image.
- Different shortcodes.

## Alert

The following alerts are available in this theme.

{{< alert type="success" >}}
This is sample alert with `type="success"`.
{{< /alert >}}

{{< alert type="danger" >}}
This is sample alert with `type="danger"`.
{{< /alert >}}

{{< alert type="warning" >}}
This is sample alert with `type="warning"`.
{{< /alert >}}

{{< alert type="info" >}}
This is sample alert with `type="info"`.
{{< /alert >}}

{{< alert type="dark" >}}
This is sample alert with `type="dark"`.
{{< /alert >}}

{{< alert type="primary" >}}
This is sample alert with `type="primary"`.
{{< /alert >}}

{{< alert type="secondary" >}}
This is sample alert with `type="secondary"`.
{{< /alert >}}

## Image

#### A sample image without any attribute.

{{< img src="/posts/shortcodes/boat.jpg" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A sample image with `height` and `width` attributes.

{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A center aligned image with `height` and `width` attributes.

{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" align="center" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A image with `float` attribute.

{{< img src="/posts/shortcodes/boat.jpg" height="200" width="500" float="right" title="A boat at the sea" >}}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies. Praesent tellus risus, eleifend vel efficitur ac, venenatis sit amet sem. Ut ut egestas erat. Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat. Suspendisse nec ipsum eu erat finibus dictum. Morbi volutpat nulla purus, vel maximus ex molestie id. Nullam posuere est urna, at fringilla eros venenatis quis.

Fusce vulputate dolor augue, ut porta sapien fringilla nec. Vivamus commodo erat felis, a sodales lectus finibus nec. In a pulvinar orci. Maecenas suscipit eget lorem non pretium. Nulla aliquam a augue nec blandit. Curabitur ac urna iaculis, ornare ligula nec, placerat nulla. Maecenas aliquam nisi vitae tempus vulputate.

## Split

This theme support splitting the page into as many columns as you wish.

#### Two column split

{{< split 6 6>}}

##### Left Column

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### Right Column

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

#### Three column split

{{< split 4 4 4 >}}

##### Left Column

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### Middle Column

Aenean dignissim dictum ex. Donec a nunc vel nibh placerat interdum. 

---

##### Right Column

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

## Vertical Space

Give vertical space between two lines.

This is line one.
{{< vs 4>}}
This is line two. It should have `4rem` vertical space with previous line.

## Video

{{< video src="/videos/sample.mp4" >}}

<!-- markdown-link-check-disable-next-line -->
Video by [Rahul Sharma](https://www.pexels.com/@rahul-sharma-493988) from [Pexels](https://www.pexels.com).

## Mermaid

Here, are few example of mermaid shortcode.

**Graph:**

{{< mermaid align="left" >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{< /mermaid >}}

**Sequence Diagram:**

{{< mermaid >}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
{{< /mermaid >}}

**Gantt diagram:**

{{< mermaid >}}
gantt
  dateFormat  YYYY-MM-DD
  title Adding GANTT diagram to mermaid
  excludes weekdays 2014-01-10

section A section
  Completed task            :done,    des1, 2014-01-06,2014-01-08
  Active task               :active,  des2, 2014-01-09, 3d
  Future task               :         des3, after des2, 5d
  Future task2               :         des4, after des3, 5d
{{< /mermaid >}}

**Class Diagram:**

{{< mermaid >}}
classDiagram
  Class01 <|-- AveryLongClass : Cool
  Class03 *-- Class04
  Class05 o-- Class06
  Class07 .. Class08
  Class09 --> C2 : Where am i?
  Class09 --* C3
  Class09 --|> Class07
  Class07 : equals()
  Class07 : Object[] elementData
  Class01 : size()
  Class01 : int chimp
  Class01 : int gorilla
  Class08 <--> C2: Cool label
{{< /mermaid >}}

**Git Graph:**

{{< mermaid >}}
gitGraph
    commit id: "ZERO"
    branch develop
    commit id:"A"
    checkout main
    commit id:"ONE"
    checkout develop
    commit id:"B"
    checkout main
    commit id:"TWO"
    cherry-pick id:"A"
    commit id:"THREE"
    checkout develop
    commit id:"C"
{{< /mermaid >}}

**ER Diagram:**

{{< mermaid >}}
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
{{< /mermaid >}}

## Gist

{{< gist hossainemruz 4ad86c9b6378677e14eff12713e75e44 >}}

## Embedded PDF

{{< embed-pdf src="/files/sample.pdf" >}}

## Quiz (quizdown)

Interactive quizzes, used by the GMAT Critical Reasoning posts. The shortcode is this site's own (`layouts/shortcodes/quizdown.html`) and loads [quizdown](https://github.com/bonartm/quizdown-js) 0.6.0 only on pages that contain a quiz. Colours follow the site's light/dark theme.

#### How to write one

Put the quiz in markdown between the opening and closing shortcode:

```markdown
{{</* quizdown */>}}

---
shuffle_questions: false
shuffle_answers: false
---

## What is 2 + 2?

> Hint: count on your fingers.

1. [ ] 3
    > Too low. Try again.
2. [x] 4
3. [ ] 5
    > Too high. Try again.

## Which of these are prime?

- [x] 2
- [x] 3
- [ ] 4
- [x] 5

## Put these in order, smallest first

1. One
2. Two
3. Three

{{</* /quizdown */>}}
```

Rules:

- **Each question starts with a `##` heading.** The heading text is the question.
- **The list type sets the question type:**
  - **Single choice** (radio buttons): a numbered list with boxes. Mark exactly one `1. [x]`; the rest are `1. [ ]`.
  - **Multiple choice** (checkboxes): a bulleted list with boxes. Mark every right answer `- [x]`; the rest are `- [ ]`.
  - **Put in order**: a numbered list *without* boxes, written in the correct order. Readers see it shuffled and drag it back into order.
- **Hint:** a `>` quote right under the heading adds a "Hint" button.
- **Feedback on an answer:** a `>` quote indented 4 spaces under that answer is shown when it's picked.
- **Options** go in an optional `---` block at the top: `shuffle_questions`, `shuffle_answers`, `start_on_load`, `nQuestions`.
- Keep the indentation exactly as shown. The shortcode passes it through untouched, even in the minified build.

#### Result

{{< quizdown >}}

---
shuffle_questions: false
shuffle_answers: false
---

## What is 2 + 2?

> Hint: count on your fingers.

1. [ ] 3
    > Too low. Try again.
2. [x] 4
3. [ ] 5
    > Too high. Try again.

## Which of these are prime?

- [x] 2
- [x] 3
- [ ] 4
- [x] 5

## Put these in order, smallest first

1. One
2. Two
3. Three

{{< /quizdown >}}
