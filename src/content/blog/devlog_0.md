---
title: "Unreal Jenkins Pipeline"
description: "A simple, yet efficient automation of build distribution."
pubDate: 2026-01-28
author: "Hank"
---

## Background

What started as me dipping my toes into multiplayer game dev turned into something else entirely (at least initially).

Long story short: I set out to create a multiplayer game in Unreal Engine. Well, not really a game per se, but more of a "playground for innovation", if you so will. I wanted to learn more about how to do multiplayer - how does it work and how do I set this up in UE. I wanted to create a basic lobby system where I could invite friends over Steam. I have no grand vision of what the game will be, but I know I want to do something cooperatively, maybe add gameplay elements over time and see where it leads by messing around. The multiplayer implementation itself became its own rabbit whole and might be a topic for another post.

When I got a base for the game up and running and I wanted to try out the online components, such as hosting a server and have friends join via Steam. I found my self building the game inside the UE-editor, which I found to be a tedious process. Since I develop on Linux (setting up Unreal Engine to work on Linux is also a topic of its own), I figured it would be nice to just run a bash-script from the terminal to build the game, without having to open the engine.

Then I found it even more tedious to upload the build somewhere and then let friends know about the new build and have them download and run the build (this was also a topic of its own, leading to me writing a bash-script to launch the game). There were many parameters that had me think that automation would be nice and I figured Jenkins could be helpful, along with some setup to let friends get the builds directly from my system, instead of having me upload all the time. AND it would be nice to have some kind of notification to send out when builds failed or succeeded.

I finally ended up with a solution where Docker Compose runs Jenkins, which listens to pushes or manual triggered builds and runs a bash-script. Jenkins forwards build results to a Discord server and the Jenkins dashboard lives on my personal website for anyone to witness (as long as my PC is running the Docker instance). I also setup login credentials for myself, so only I can mess around with the build system, but testers can download builds.

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

### The Problem
**Multiple Write Locations:** UE5 writes to many directories during builds, such as `Intermediate/`, `DerivedDataCache/`, `Saved/`, `Binaries/`. When both my user and Jenkins tried to access these folders, permission conflicts occured because neither can modify files created by the other.

**Zen Server Conflicts:** Zen is apparently UE5s derived data cache server that stores processed assets (textures, shaders, etc.) to speed up builds. It uses shared memory (/dev/shm) for fast inter-process communication. When my local builds and Jenkins both tried to access the same shared memory objects, I got "Permission denied" errors and cooking failures.

**Reproducibility:** Without isolation, builds were not consistent. Leftover files and environment differences could mean a successful build on my machine but a f-up in Jenkins.

### The Solution
**Separate Filesystems:** Inside the Docker container, Jenkins has its own complete filesystem. When it writes to `/workspace/MP_FogJob/Intermediate/`, it is writing to the containers filesystem, not directly to my home directory.

**Volume Mounts** let the container access my project files without copying them. I tell Docker: "make `/home/shen/Dev/MP_FogJob` on my computer appear as `/workspace/MP_FogJob` inside the container". Now Jenkins can read my code and create builds, while temporary files stay contained in the containers own filesystem.

**UID Mapping:** I configured Jenkins to run as UID 1000, which is the same user ID as my host account. When Jenkins creates files in the mounted volumes, they are automatically owned by me on the host. No permission conflicts.

**docker-compose.yml:**
```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: mp-fogjob-jenkins
    privileged: true
    user: "1000:1000"
    ports:
      - "8090:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /path/to/MP_FogJob:/workspace/MP_FogJob
      - /path/to/UnrealEngine:/workspace/UnrealEngine
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JENKINS_OPTS=--httpPort=8080
      - GIT_LFS_SKIP_SMUDGE=1

volumes:
  jenkins_home:
    driver: local
```

**Skipping Git LFS:** Since the Docker container mounts my project directory directly, Jenkins already has access to all the large assets managed by Git LFS. There is no need to download them again from GitHub. By setting GIT_LFS_SKIP_SMUDGE=1, we tell Git to skip the LFS download step entirely and speed up the checkout process.

**Plugin dependencies:** Some plugins failed in the containerized environment because they expect GUI libraries that do not exist in headless mode. Plugins like Bridge and Fab are editor-only tools that probably work fine on my desktop, but threw errors in Docker. I solved it by disabling the mischievous buggers in the `.uproject file`.

**[View build.sh on GitHub](https://github.com/hcdvall/mp-fog-job/blob/main/build.sh)**


## Jenkins
Jenkins acts as the orchestrator, tying everything together through a declarative pipeline defined in a `Jenkinsfile` that lives in the repo. My pipeline is constructed with these stages:

1. **Setup:** Create `build.config` with container paths
2. **Checkout:** Pull latest code from GitHub
3. **Build:** Run the build-script inside the container
4. **Archive:** Store artifacts for download purposes
5. **Notify:** Send Discord webhook with build results
6. **Cleanup:** Delete old builds (I keep the 5 latest)

**Example:**
```bash
...
stage('Build') {
    steps {
        sh """
            chmod +x ${PROJECT_PATH}/build.sh
            cd ${PROJECT_PATH}
            ./build.sh ${BUILD_CONFIG}
        """
    }
}
...
```

**[View full Jenkinsfile on GitHub](https://github.com/hcdvall/mp-fog-job/blob/main/Jenkinsfile)**


Apart from the Jenkinsfile, there are a couple of additional setup steps for GitHub and Discord integration, as well as securing access to the Jenkins dashboard. For getting started with Jenkins itself, check out the [official getting started guide](https://www.jenkins.io/doc/pipeline/tour/getting-started/).

### GitHub Integration
To enable Jenkins to pull from your repository, you need to create a Personal Access Token on GitHub and add it as a credential in Jenkins.
Under Manage Jenkins you can "Add credentials". In this case I used ""Username with Password"" as my credentials type.
1. Navigate to Manage Jenkins -> Credentials
2. Click (global) -> Add Credentials
3. Select "Username with password" as the credential type
4. Enter your GitHub username and paste the token as the password
5. Set the ID to github-credentials (this matches what the Jenkinsfile expects)

![Credentials](/images/blogs/credentials.png)
![Add credentials](/images/blogs/add_credentials.png)

When this is setup, Jenkins will be able to authenticate and pull from the repo. 

### Discord Notifications
The discord setup is quite straightforward as the Github. You add credentials the same way, but use "Secret text" instead of "Username with Password". In Discord you will have to create a webhook and grab the webhook URL from a server you want to use. 

![Discord webhook](/images/blogs/discord_webhook.png)

In Jenkins one also has to make sure to install plugins for Discord and GithHub integration. Now with all that setup Jenkins can send build notifications directly to your Discord channel with download links and build status.

## Cloudflare
At this point, the build system was working, but it was only accessible locally, making the whole Discord notification setup pretty much useless. I needed a way to expose Jenkins to the internet that felt somewhat safe and let testers grab the latest build directly from yours truly, saving me from the boringness of manually uploading builds somewhere every time.

I looked into ngrok and Cloudflare, and was sold on the adult and serious enterpriseiness of Cloudflare.
A for-me-in-this-case free service that creates a secure tunnel from my machine to Cloudflare's network, giving me a proper domain (builds.henriksedvall.com) with automatic HTTPS.

I did my setup in five steps:
1. **Install cloudflared:** `yay -S cloudflared` (I use Arch, btw)
2. **Authenticate:** `cloudflared tunnel login` (select your domain)
3. **Create tunnel:** `cloudflared tunnel create mp-fogjob-jenkins`
4. **Configure routing:** Point *builds.henriksedvall.com* to the tunnel
5. Run as systemd service so it starts automatically:
```bash
    sudo systemctl enable cloudflared-jenkins
    sudo systemctl start cloudflared-jenkins
```

On top of this it is necessary to update nameservers to Cloudflare's. You have to update in Cloudflare and at your current domain provider. 

## Summary
### The Developer Experience

1. I push code to GitHub
2. Jenkins detects change (or manual trigger)
3. Build script executes inside the running container (compile -> cook -> package)
4. Artifacts archived in Jenkins
5. Discord notification sent with download link
6. Testers click link and download
7. Old builds automatically cleaned up

**Worth mentioning:** The Docker container has to be running beforehand. I start it manually with `docker-compose up -d` and it runs until I stop it or shut down my PC. Ideally, this would all run on a dedicated server that's always online. But this was an experiment to mimic a "big company setup" on my local machine, and it works surprisingly well.

**Time savings:** What used to take 45 minutes of manual work (compile, cook, package, upload, notify testers) now happens automatically. First build took 50 minutes, but incremental builds with minor changes are down to 5-10 minutes.

## Conclusion
There are always finicky setups and workarounds when running Unreal Engine on Linux, but that's part of the charm! If you just want to "open the editor and make games" Windows might be the easier path. But if you love tinkering with workflows, automating processes and understanding how the tools actually work under the hood, then Linux is incredibly rewarding.

### What I gained from this project:

- Deepened understanding of CI/CD pipelines and DevOps practices
- Hands-on experience with Docker, Jenkins, and Cloudflare
- A professional (hey, somewhat at least?) build system that could **save lives every week**
- The satisfaction of solving complex technical challenges

Was it all worth it? Absolutely. I think the time investment might payoff. Push code, grab coffee, builds ready for testers, all automatic and I can do it from anywhere on any PC (as long as the container is running).
**For anyone considering a similar setup:** Start simple. Get your build script working locally first. The build script is likely the only thing you really need to get big improvement in the workflow. From here add Docker, then Jenkins, then the fancy stuff. Each piece I added solved a real and current problem that I did not predicted beforehand. After a while you have built something genuinely impressive.

If you want to check out the code, the full setup is on [GitHub](https://github.com/hcdvall/mp-fog-job/blob/main/README_CICD.md). Questions? Contact me!
