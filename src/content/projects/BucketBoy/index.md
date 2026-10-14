---
title: "Bucket Boy"
description: "Haunted puzzle platformer powered by a flashlight"
startDate: 2021-10-15
author: "Henrik Sedvall"
heroImg: "/images/buckey_boy/Bucket_boy_floating.gif"
highlight: true
---

# About
A pitch black puzzle platformer with a flashlight mechanic that is used to light up the environment, 
avoid enemies and find batteries to recharge the flashlight.
The goal is to climb to the top of the haunted house and find the teddy bear.

This was my first team project and there were a lot of cool ideas for features we wanted 
to fit into the game under a really short time span.

# Responsibilitites 
Between programmers we divided the main responsibilities into **player mechanics** and **enemy mechanics**. 
I started out working on the enemy mechanics (gameplay and AI), though my role evolved to also include **UI**, **animation integration** and **player grabbing mechanics**.

## Enemies
Right from the start we had some ideas of what kind of enemies we wanted that would fit into our theme. 
The decision fell on ghosts and two kinds of enemies were envisioned from the get-go: 
a patrolling enemy and a floating enemy.

Both enemies were inspiration (or unmercifully stolen) from Super Mario: The ghost and the rugby player.
We wanted the enemies to be somewhat distinct since we were developing a game in such a short time, and these functionalities set the enemies apart.

### The Floating Enemy
The floating enemy is not affected by environment colliders or gravity and is therefore easy to randomly spawn.

The floating enemy would be idle if the player was:

- outside the borders of its perimeter
- moving away from the enemy
- standing still 

The floating enemy would move towards the player if the player were close enough and moving away from the enemy.

![Floating Enemy](/images/buckey_boy/Bucket_boy_floating_resized.gif)

#### Thoughts:
I wrote the code this way because it made me able to disregard the rotation of the player. 
In retrospect I believe this could be a good design choice, since it should be quite stable to only consider and compare the x position to determine the actions of the enemy.

However, a drawback of this kind of implementation could be that the distance between the enemy and the player is calculated every frame, and instead an event could be triggered when the player was close enough to the enemy.

### The Patrolling Enemy
The **patrolling enemy** was designed with two distinct states:  
1. **Idle / Patrol** – moving back and forth between two positions.  
2. **Chase** – pursuing the player if they entered its line of sight.  

#### Patrol State:
To implement patrol behavior, the enemy needed a way to detect both **ground edges** and **walls**, and then turn 180° if either was detected.  

I solved this with `Physics2D.Raycast()` calls, cast from a slightly offset child object:  
- A short downward ray (negative y) to check for ground.  
- A short horizontal ray (x-direction) to detect walls.  

These short rays were enough to keep the enemy from falling off platforms or walking into obstacles.  

#### Chase State:
From the same child object, I added a third ray — a **longer horizontal ray**.  
- If this ray collided with the player’s tag, the enemy switched to its **chase state**.  

In this state, the patrolling enemy behaved similarly to the floating enemy, but with some key differences:  
- It was affected by **colliders** and **gravity**.  
- It couldn’t pass through floors or walls, making it feel less “ghost-like.”  
- Movement was handled simply by checking if the player was left or right of the enemy, then applying `Translate()` along the x-axis.  

![Floating Enemy](/images/buckey_boy/Bucket_boy_patrolling_resized.gif)
![Floating Enemy](/images/buckey_boy/Bucket_boy_grabbing_resized.gif)

#### Thoughts:
I think this was a feasible approach to make a patrolling enemy. I initially casted rays directly from the enemy game object but found it better to use a child object (kind of like casting rays from player eyes in other games/scenarios) since it made it easier to detect no-ground and make the enemy turn around in time before falling of platforms.

To have the enemy indefinitely chase the player upon detection (similar to the rugby player in Super Mario) was also a fun design choice, since it made it quite hectic (the enemy speed was ramped up during chase) and luring the enemy to fall down from platforms, not being able to get up - a necessary gameplay scenario. A possible option to the final solution could be to have a timer where the enemy would go back to patrolling if the player was out of sight for a certain time.
    
