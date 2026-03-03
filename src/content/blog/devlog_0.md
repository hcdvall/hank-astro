---
title: "Devlog #0"
description: "Initial development log entry"
pubDate: 2026-01-28
author: "Hank"
---

# Devlog #0

## Background

Well, what started as me dipping my toes into creating multiplayer games turned into something else (at least initially).
Long story short: I set out to create a multiplayer game in Unreal Engine, or maybe not really game, but I wanted to learn more about how to do multiplayer - how does it work and how do I set this up in UE. I wanted to create a basic lobby where I could invite friends over Steam. I have no grand idea of what the game will be, but I know I want to invite friends and do something cooperatively, maybe add gameplay elements over time and see where it leads. Basically a playground for innovation if you so will. In mean time the development of this game, or rather the online components, will be its own topic.

When I got a base for the game up and running and I wanted to try out the online components, such as hosting a server and have friends join via Steam. I found my self building the game inside the UE-editor, which I found to be a tedious process. Since I develop on Linux (setting up Unreal Engine to work on Linux is also a topic of its own), I figured it would be nice to just run a bash-script from the terminal to build the game, without having to open the engine.

However, I then found it even more tedious to upload the build to someplace and then let friends know about the new build and have them download and run the build (this was also a topic of its own, leading to me writing a bashscript to launch the game). There were many parameters that had me think that automation would be nice, and I figured Jenkins could be helpful, along with some setup to let friends get the builds directly from my system, instead of having me upload all the time. AND it would be nice to have some kind of notification to send out when builds failed, or succeeded.

I finally ended up with a solution where I uses docker compose to handle Jenkins, where Jenkins listens to pushes or manual triggered builds and runs a bashscript. Jenkins forwards build results to a discord server and the Jenkins dashboard lives on my personal website for anyone to witness (as long as I have my computer on and runs the docker instance). I also setup login credentials for myself so only I can mess around with the build system.

## The bash-script


## Docker

## Jenkins

## Cloudflare

## Discord

## What's New

- Starting development log series
- Setting up the foundation for regular updates

## Current Progress

[Add your progress updates here]

## Next Steps

- [Add your next planned tasks here]

## Thoughts

[Add any thoughts or reflections here]

---

*This is the beginning of a regular development log series to track progress and share updates.*
