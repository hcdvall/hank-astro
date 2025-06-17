---
title: "Rouse"
description: "Third person physics-based puzzle game"
startDate: 2022-06-15
author: "Henrik Sedvall"
heroImg: "/images/rouse/Rouse_aiming_abort_sprint.gif"
highlight: true
---

## About
Rouse is a 3rd person physics-based puzzle game where you play as Rose, awakening in her little brother's nightmare. Use your magical blunderbuss to solve puzzles and save him!

The blunderbuss is central to puzzle-solving. Combined with platformer-style levels, players use movement freedom and weapon mechanics to traverse environments. We initially designed levels as physics playgrounds, providing tools that let players feel smart solving problems. While we eventually refined the freedom for better level coherence, we preserved room for creative solutions.

## Responsibilities
I focused on gameplay programming, specifically player movement (walking, jumping, sprinting) and aiming mechanics (ADS and movement interactions). Since platforming was essential to level design, player maneuverability had to match that importance.

I also served as Scrum Master, leveraging my professional experience in the role.

## Jumping
Jumping underwent multiple iterations with continuous testing and tuning to balance precision and flow based on different obstacles. The system handled three states - idle, walking/jogging, and sprinting - all using the same core jumping/falling functions with different parameters.

Enhanced falling mechanics applied to all states: when detecting negative z-velocity, I used AddActorWorldOffset() to increase fall speed over time by a constant factor.