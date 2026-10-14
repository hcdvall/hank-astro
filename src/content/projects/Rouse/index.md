---
title: "Rouse"
description: "Third person physics-based puzzle game"
startDate: 2022-06-15
author: "Henrik Sedvall"
heroImg: "/images/rouse/Rouse_aiming_abort_sprint.gif"
highlight: true
---
# About
**Rouse** is a third-person, physics-based puzzle game where you play as Rose, navigating her little brothers nightmare with a magical blunderbuss.  

The blunderbuss is central to puzzle-solving and, combined with platformer-style levels, enables creative traversal and interaction with the environment. Levels were initially designed as physics playgrounds to encourage experimentation, later refined for stronger coherence while still leaving space for inventive solutions.  

# Responsibilities
I focused on gameplay programming, primarily **player movement** (walking, jumping, sprinting) and **aiming mechanics** (ADS and movement interactions). Since platforming was central to level design, smooth and responsive maneuverability was crucial.
I also acted as **Scrum Master**, leveraging prior professional experience in agile development.

## Jumping
Jumping went through multiple iterations to balance precision and flow. The system supported three states — idle, jogging, sprinting — all built on the same core jump/fall logic with parameter adjustments.

To enhance falling, I applied `AddActorWorldOffset()` whenever detecting negative Z-velocity, accelerating descent over time for a more natural feel.

![Jumping Idle](/images/rouse/Rouse_idle_jump_resized.gif)
![Jumping Moving](/images/rouse/Rouse_moving_jump_resized.gif)

## Aiming Down Sights (ADS)
ADS was critical, as it was the only way to shoot and interact with puzzles.

- Implemented with a timeline modifying spring arm length/offset and camera FOV.
- Timeline reverses when exiting ADS, ensuring smooth transitions.
- Camera placement hid missing lower-body animations when turning.
- Adjusted movement speed and mouse sensitivity while aiming.
- Sprinting is interrupted when aiming but seamlessly resumes if the sprint key is still held, preserving flow.

![Aiming](/images/rouse/Rouse_aiming_resized.gif)
![Aiming Abort](/images/rouse/Rouse_aiming_abort_sprint_resized.gif)

## Sprinting
Added late but greatly improved game feel and player control. While not strictly necessary for platforming, sprinting made traversal more comfortable and responsive.

![Sprinting](/images/rouse/Rouse_sprinting_resized.gif)
![Sprinting Jump](/images/rouse/Rouse_sprinting_jump_resized.gif)

# Thoughts
Beyond programming, I supported animation and sound integration and performed extensive playtesting (with limited QA resources) to refine mechanics.

This was my first large Unreal project and a great learning experience. Despite the large team, collaboration was highly inclusive - ideas were reshaped rather than dismissed and everyone contributed memorable features. The shared commitment and skill of the team made the final game genuinely fun to play.
