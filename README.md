# concatenate-api
The server side of an app designed to display progress. [Here](http://github.com/naturalbornchiller/concatenate-client "concatenate-client") is the client side repo.

Links to the [deployed back](https://murmuring-lowlands-80865.herokuapp.com/) and [frontend](https://naturalbornchiller.github.io/concatenate-client/), respectively.
___
Concatenate is a simple but effective way for users to
track the repetition of tasks and form habits.

## The concept is simple:
1. A new user ("The User") logs into our app.
2. The User adds one (or more) new daily task(s) e.g., "write", "program", "meditate", etc. to be tracked.
3. Tracked tasks (called "Chains") last for each day that The User logs in and clicks "concat!" on the daily task they have performed. In this way, Chains, marked by passing days, grow longer, providing users with a visual representation of incremental progress. If The User fails to log onto the app and continue the Chain, the Chain is broken, forcing her to start over.
4. See how long you can keep it going!

## Planning process / problem solving strategies
The idea for this app stems from advice that developer and comic Brad Isaac received from Jerry Seinfield in a comedy club. Isaac tells it like this:

> Years ago when Seinfeld was a new television show, Jerry Seinfeld was still a touring comic. At the time, I was hanging around clubs doing open mic nights and trying to learn the ropes. One night I was in the club where Seinfeld was working, and before he went on stage, I saw my chance. I had to ask Seinfeld if he had any tips for a young comic. What he told me was something that would benefit me a lifetime...
>
> He said the way to be a better comic was to create better jokes and the way to create better jokes was to write every day. But his advice was better than that. He had a gem of a leverage technique he used on himself and you can use it to motivate yourself—even when you don't feel like it.
>
> He revealed a unique calendar system he uses to pressure himself to write. Here's how it works.
>
> He told me to get a big wall calendar that has a whole year on one page and hang it on a prominent wall. The next step was to get a big red magic marker.
>
> He said for each day that I do my task of writing, I get to put a big red X over that day. "After a few days you'll have a chain. Just keep at it and the chain will grow longer every day. You'll like seeing that chain, especially when you get a few weeks under your belt. Your only job next is to not break the chain."
>
> "Don't break the chain," he said again for emphasis. [[1]](https://lifehacker.com/jerry-seinfelds-productivity-secret-281626 "source")

It took me a while to realize the importance of incremental growth, but now that I do, I can't overstate its benefits enough. By doing something once a day, a person can transform themselves, bit by bit. For that reason the above quote resonated with me.
___
I began the process of building an app from the ground up. I started with user stories and ERDs, picked which tools to use, and began to articulate, on paper first, then programmatically, how the data might be stored, then retrieved and displayed for the client.

Because I needed to devise a way of storing data that evolves with time, I started with the server. This enterprise was more difficult than I initially imagined because of two unforseeables:
1. Using Express with Mongoose is hard as ****. It's not at all an intuitive technology to pick up and persisting evolving nested data sets is neither simple nor well-documented.
2. Dealing with JavaScript's Date objects is a pain. I'm not that quantitative to begin with, and having to manipulate Date objects and then convert from milliseconds to minutes/hours/days, from strings to numbers and back, leaves a ton of room for error.
Which is not to say I didn't enjoy solving date/time puzzles or taming the legendary Mongoose. In fact, I very much did.

The next hurdle I volunteered myself to overcome was using React. I'm glad I spent time familiarizing myself with React, as it's a tool I want to use for future projects; however I really could have stuck to Vanilla JS for this one. That said, I really got to see the power of the library, how, with state and props, one can circulate data throughout the body of a program. And I'm excited to learn more!

Most of my process involved trial-and-error. I'd stare at a big problem (How to represent the chains programmatically?) and parse it into related subproblems (What is a chain? How is a chain broken? How is it extended? How can I efficiently store it in the backend?). I found that, by solving these subproblems in succession, I could effectively answer the superproblem—and I did so mostly by playing until the pieces fit.

Lastly, this time around, I learned a lot about debugging. The secret is CONSOLE LOG EVERYTHING. By doing so your program is laid bare—you can see exactly what each variable holds and how it is mutated by the functions you thought did something completely different.

## Routes used
After signing in, this is how the resource requests should be formatted:

__Post__ a Task
```
#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"

curl "${API}${URL_PATH}/" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "name": "'"${NAME}"'"
    }
  }' \
  | json_pp

echo
```

__Index__ all Tasks
```
#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"

curl "${API}${URL_PATH}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
```

__Show__ one Task
```
#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4895277b3633db170f9dc1

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
```

__Delete__ one Task
```
#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4895277b3633db170f9dc1

curl "${API}${URL_PATH}/${ID}" \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
```

__Update__ one Task

note! - this will either..
1. create a new chain, if the last chain is broken or if there are no chains yet created, else
2. concatenate onto the chain if it's been between 24 and 48 hours since the last concat
```
#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4895277b3633db170f9dc1

curl "${API}${URL_PATH}/${ID}" \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
```

For info on how to format authentication requests please click [here](https://git.generalassemb.ly/ga-wdi-boston/express-api-template "auth").

### Goals for Future Incarnations
Ideally, I'd like for this to be an app, with reminders and whatnot. Bar that, I want to display the "chains" on a full-year calendar, rather than as discrete threads. Also, I'd like to present the user with more data on their chains (totalDaysTracked, combinedChainLength, etc.). Finally I'd like to make the UI more satisfying to view and use.

### Local setup
1. Fork and clone this repo
2. Install dependencies `npm i`
3. Wreak havoc

#### Technologies Used
- Backend: Node with Express.js and Mongoose
- Frontend: HTML, SCSS, JavaScript, React
___
Lastly, [here](https://projects.invisionapp.com/freehand/document/sik2MYH0G) is a link to the ERD!
