---
title: "To dot or cross in gamedev"
description: "I figured I could create a mini tutorial to help distinguish between dot- and cross products"
pubDate: 2025-05-29
author: "Henrik Sedvall"
---

# The Dynamic Duo of Vector Mathematics! 🎮

Picture vectors as arrows flying through your game world - they have direction and magnitude, like a player's velocity or the direction an enemy is facing. Now, what happens when these vectors collide mathematically? That's where our two mathematical superstars enter the stage!

![Vector illustration](/public/images/vector_concepts_diagram.svg)

## Dot Product: The "Friendship Meter" 

The dot product is like asking two vectors: "Hey, how much do you two agree on direction?" It's the mathematical equivalent of a handshake that tells you everything about the relationship between two directional forces.

**The Formula:** `A · B = |A| × |B| × cos(θ)`

Think of it this way - when two vectors are best friends (pointing the same direction), you get a positive number. When they're enemies (pointing opposite ways), you get negative. When they're just acquaintances (perpendicular), you get zero - they're neutral!

### The Magic in Action:

**Stealth Games:** Imagine you're coding a guard's vision cone. The dot product between the guard's facing direction and the vector toward the player instantly tells you if the player is in the "danger zone." Positive dot product? Busted! Zero or negative? You're in the shadows, safe and sound.

**Dynamic Lighting:** Every surface in your game world is having a constant conversation with light sources through dot products. "How directly is this light hitting me?" asks the surface. The dot product between the surface normal and light direction gives the answer - and determines how bright that pixel should glow.

**Combat Systems:** Want to know if that sword swing is a devastating frontal assault or a weak glancing blow? Dot product the attack direction with the defender's facing direction. The closer to 1.0, the more devastating the impact!

## Cross Product: The "Perpendicular Wizard" ✨

If dot product is the friendship meter, cross product is the rebel that says "I'm going to point in a completely different direction than both of you!" It takes two vectors and births a third that's perpendicular to both - like mathematical parenthood.

**The Superpower:** Given vectors A and B, the cross product A × B creates a vector that's 90 degrees to both, with a magnitude equal to the area of the parallelogram they form. It's geometry with attitude!

### Where the Magic Happens:

**World Building:** Ever wonder how your game engine knows which way a polygon is facing? Cross product! Take any two edges of a triangle, cross them, and BAM - you've got the surface normal. This little perpendicular vector tells the renderer "this side faces outward" and makes proper lighting and collision detection possible.

**Camera Wizardry:** Those smooth orbital camera movements around your character? Cross product is the choreographer! It takes your camera's current direction and the world's up vector, crosses them, and creates the perfect "right" vector for silky smooth strafing movements.

**Physics Playground:** When a spinning wheel hits a ramp, or when you're calculating the torque on a rotating door, cross product is working overtime. It's the mathematical engine behind every spin, twist, and tumble in your physics simulation.

**Procedural Terrain:** Imagine generating a world where trees always grow perpendicular to hillsides, or where buildings align properly with sloped terrain. Cross product takes the terrain's slope vectors and generates the perfect "up" direction for natural-looking object placement.

## The Ultimate Showdown: When to Deploy Each Weapon

### Reach for Dot Product when you're asking:
- "Are these two things pointing in a similar direction?"
- "How much does this movement align with that direction?"
- "Is this object in front of or behind the player?"
- "How steep is this incline relative to my movement?"

### Summon Cross Product when you need:
- "Give me a direction that's perpendicular to both of these!"
- "Which way should this surface face?"
- "I need to rotate around this axis - what's my rotation vector?"
- "How do I orient this object relative to this sloped surface?"

## The Beautiful Truth

Here's the mind-bending reality: dot product reduces the complexity of 3D relationships into a single, meaningful number - it's the ultimate simplifier. Cross product does the opposite - it takes two directions and explodes them into a completely new dimension of possibility.

Together, they're like the yin and yang of game mathematics. Dot product asks "how similar?" while cross product declares "here's something completely different!" Master both, and you'll have the vector vocabulary to speak fluently with your game world's geometry, physics, and visual systems.

Every frame of every game you've ever played has been a symphony of millions of these vector conversations happening in perfect mathematical harmony! 🎵

## Quick Reference

### Dot Product Properties:
- **Input:** Two vectors
- **Output:** Single number (scalar)
- **Positive:** Vectors point in similar directions
- **Zero:** Vectors are perpendicular
- **Negative:** Vectors point in opposite directions

### Cross Product Properties:
- **Input:** Two vectors
- **Output:** New vector perpendicular to both
- **Magnitude:** Area of parallelogram formed by input vectors
- **Direction:** Follows right-hand rule
- **Zero:** When input vectors are parallel

### Common Use Cases:

| Scenario | Use Dot Product | Use Cross Product |
|----------|----------------|-------------------|
| Line of sight checks | ✅ | ❌ |
| Lighting calculations | ✅ | ❌ |
| Surface normals | ❌ | ✅ |
| Camera rotations | ❌ | ✅ |
| Field of view | ✅ | ❌ |
| Physics torque | ❌ | ✅ |
| Movement direction | ✅ | ❌ |
| Object orientation | ❌ | ✅ |