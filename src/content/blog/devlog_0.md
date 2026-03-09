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

## The build-script 

**Flexible Configuration:** The script uses a `build.config` file that specifies where Unreal Engine is installed. This is somewhat important because the path differs between environments. Jenkins runs inside a Docker container where the engine lives at /workspace/UnrealEngine, while local builds point directly to e.g. /home/user/Dev/UnrealEngine. By externalizing this configuration, the same script works everywhere!

**Version Tracking:** Each build is automatically tagged with a timestamp and git commit hash, creating unique identifiers like *Development_20260226_120238_a3f2c1b*. This makes it easier to trace any build back to the exact code that produced it.

**Logging:** All output is piped to `build_log.txt` using tee, so I can see the build progress in real-time while keeping record. When builds fail (which they almost never do of course shut up mind you), these logs simplifies debugging.

### The Core Logic

The script generates a unique version for each build:
```bash
# Combine timestamp with git commit hash for unique versioning
VERSION=$(date +"%Y%m%d_%H%M%S")
GIT_HASH=$(git rev-parse --short HEAD)
# Result: 20260226_120238_a3f2c1b
```

Then calls Unreals automation tool with the right flags:
```bash
"$ENGINE_PATH/Engine/Build/BatchFiles/RunUAT.sh" BuildCookRun \
    -project="$PROJECT_ROOT/$PROJECT_NAME.uproject" \
    -platform=Linux \
    -clientconfig=Development \
    -cook -build -stage -pak -archive
```
This single command compiles the code, cooks the assets, stages the files, and packages everything into a distributable build. The script also creates a latest symlink that always points to the most recent build, making it easier to locate the current version.

**[View build.sh on GitHub](https://github.com/hcdvall/mp-fog-job/blob/main/build.sh)**

## Docker
So why did I containerize docker? Well, I had major issues with file permission when I drank Jenkins straight from the bottle. In attempt to circumvent the permission conundrum I thought containerization with docker might help.

### The problem
**Multiple Write Locations:** UE5 writes to many directories during builds, such as `Intermediate/`, `DerivedDataCache/`, `Saved/`, `Binaries/`. When both my user and Jenkins tried to access these folders, permission conflicts occured because neither can modify files created by the other.

**Zen Server Conflicts:** Zen is apparently UE5s derived data cache server that stores processed assets (textures, shaders, etc.) to speed up builds. It uses shared memory (/dev/shm) for fast inter-process communication. When my local builds and Jenkins both tried to access the same shared memory objects, I got "Permission denied" errors and cooking failures.

**Reproducibility:** Without isolation, builds were not consistent. Leftover files and environment differences could mean a successful build on my machine but a f-up in Jenkins.

### The solution

**Separate Filesystems:** Inside the Docker container, Jenkins has its own complete filesystem. When it writes to `/workspace/MP_FogJob/Intermediate/`, it is writing to the containers filesystem, not directly to my home directory.

**Volume Mounts** let the container access my project files without copying them. I tell Docker: "make `/home/shen/Dev/MP_FogJob` on my computer appear as `/workspace/MP_FogJob` inside the container". Now Jenkins can read my code and create builds, while temporary files stay contained in the container's own filesystem.

**UID Mapping:** I configured Jenkins to run as UID 1000, which is the same user ID as my host account. When Jenkins creates files in the mounted volumes, they are automatically owned by me on the host. No permission conflicts.

**Plugin dependencies**: 

**docker-compose.yml highlights:**
```yaml
services:
  jenkins:
    user: "1000:1000"  # Why this matters
    volumes:
      - jenkins_home:/var/jenkins_home  # Persistent data
      - /path/to/project:/workspace/project  # Read/write access
      - /path/to/engine:/workspace/engine  # Engine files
    environment:
      - GIT_LFS_SKIP_SMUDGE=1  # Why we skip LFS
```

**Skipping Git LFS:** Since the Docker container mounts my project directory directly, Jenkins already has access to all the large assets managed by Git LFS. There is no need to download them again from GitHub. By setting GIT_LFS_SKIP_SMUDGE=1, we tell Git to skip the LFS download step entirely and speed up the checkout process.

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
