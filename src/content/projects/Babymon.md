---
title: "Babymon"
description: "A whimsical and hectic babysitting simulation"
startDate: 2022-01-10
author: "Henrik Sedvall"
heroImg: "/images/babymon/Babymon_zoom.gif"
highlight: true
---

## About
**Babymon: Daycare Dropoff** is a fast-paced babysitting game where you play as a witch caring for monster babies while their parents are at work. Each baby has unique needs, like favorite foods or toys, which are tracked in a magical monster manual. Keep them happy until pickup time without mixing things up!  

## Responsibilities
I worked as a **Gameplay Programmer**, mainly handling camera movement, player controls, and interactions. As the project grew, I also implemented event hooks for sound and animation.  

### Camera Movement

- Top-down camera with a slight angle, smoothly following the player via `Vector3.Lerp`.  
- Clamped camera in X and Z using `Math.Clamp`.  
- Added sweep/zoom for cooking and (later deprecated) mini-games.  

![Camera](/images/babymon/Babymon_camera.gif)
![Zoom](/images/babymon/Babymon_zoom_resized.gif)


### Player Controller
- Switched from grid-based to physics-based movement using rigidbodies.  
- Inputs handled in `Update()`, physics in `FixedUpdate()`.  
- Developed a jump mechanic, iteratively syncing sounds, animations, and physics.  
- Added multiple colliders to improve movement, collisions, and jump feel.  

![Jump Mechanic](/images/babymon/Babymon_jump.gif)
![Interactions](/images/babymon/Babymon_interaction.gif)

### Player Interactions
- Built distinct actions for picking up objects vs. babies.  
- Created an interactor **Grabbers** (child object of player) to trigger interaction logic.  
- Handled edge cases where multiple objects were interactable.  





