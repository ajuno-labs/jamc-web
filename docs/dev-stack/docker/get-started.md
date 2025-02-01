## What is Docker?

- open platform for developing, shipping, and running applications

## The Docker Platform

## What can I use Docker for?

- Fast, consistent delivery of your applications
- Responsive deployment and scaling
- Running more workloads on the same hardware

Literally don't really understand what those mean.

## Docker Architecture

- Client-server architecture
    - use REST API
- Docker client
- Docker daemon (dockerd)
- Docker compose: multiple `docker run` commands
- Docker Desktop
- Docker Registries
    - stores images
    - Docker Hub: public registry
- Docker Objects
    - Images: read-only template with instructions for creating a Docker container
        - Dockerfiles
    - Containers: runnable instances of images
        - isolated from other containers and their host system by default, but can be configured to share resources
- The Underlying Technology
    - Written in Go
    - namespaces???

## Introduction

- Run the first container: `docker run -d -p 8080:80 docker/welcome-to-docker`
- Access the frontend: `http://localhost:8080`

### Manage Containers Using Docker Desktop

- docker compose watch
- doesn't have to install anything. Just Docker + Editor

## Docker Concepts

### The basics

- Container
    - Properties
        - self-contained
        - Isolated
        - independent
        - Portable
    - Compares with VMs
- Image
    - a standardized package that includes all of the files, binaries, libraries, and configurations to run a container.
    - Priciples
        - Immutable??
        - composed of layers???
- Registry
    - centralized location for storing and retrieving images
- Docker Compose
    - yaml file

### Building Images

#### Understanding Image Layers

- Image Layers
    - I can understand that 
    - Stacking the layers
- Try it out
    - `docker container commit`

#### Writing a Dockerfile

- Common instructions
    - FROM <image>
    - WORKDIR <path>
    - COPY <src> <dest>
        - It seems like copy is used to access the files in the host machine and put them in the container.
    - RUN <command>
    - ENV <name> <value>
    - EXPOSE <port>
    - USER <username>
    - CMD ["<command>", "<arg1>", "<arg2>"]

#### Build, Tag and Publish an Image

- `docker build .` 

- Tagging:
    - Full image name: [HOST[:PORT_NUMBER]/]PATH[:TAG]
    - Add tag: `docker image tag <image_name> <new_tag>`
- Push to registry: `docker push <registry>/<image_name>`

#### Using the Build Cache

- Docker caches the instructions in the Dockerfile
- Some invalidation rules
    - Any changes to the command of a RUN instruction invalidates that layer
    - Any changes to files copied into the image with the COPY or ADD instructions
    - Once one layer is invalidated, all following layers are also invalidated. If any previous layer, including the base image or intermediary layers, has been invalidated due to changes, Docker ensures that subsequent layers relying on it are also invalidated. This keeps the build process synchronized and prevents inconsistencies.

#### Multi-stage builds

### Running Containers

#### Publishing and exposing ports

- Because a container is isolated, it can't access the host machine's ports. So somehow we need to map the container's port to the host machine's port.
- `docker run -p <host_port>:<container_port> <image_name>`
- Exposed ports are the ports that are exposed to all network interfaces, so we need to be careful with sensitive ports like databases.
- **ephemeral ports**
- `EXPOSE`: specifies the ports that the container will listen on, and exposes them all using the `-P` flag

#### Overriding container defaults



