# RideX CI/CD Workflow Explanation

This document explains the **Continuous Integration and Continuous Deployment (CI/CD)** pipeline set up for your RideX project using **GitHub Actions**.

The workflow file is located at: `c:\Users\sahkr\OneDrive\Desktop\RideX-\.github\workflows\deploy.yml`

## Overview

The goal of this workflow is to **automatically build** your Backend and Frontend Docker images and **push** them to Docker Hub whenever you make changes to your specific code. This ensures your deployment artifacts are always up-to-date without manual command-line work.

---

## Breakdown of `deploy.yml`

### 1. The Trigger
```yaml
on:
  push:
    branches:
      - main
```
*   **What it does:** This tells GitHub to run this workflow *only* when code is pushed to the `main` branch.
*   **Why:** You usually only want to deploy stable code that has been merged to your main branch, not every experimental feature branch.

### 2. The Job (`build-and-push`)
```yaml
jobs:
  build-and-push:
    runs-on: ubuntu-latest
```
*   **runs-on: ubuntu-latest**: GitHub spins up a fresh virtual machine (Runner) running Ubuntu Linux to execute these steps.

### 3. The Steps

#### Step 1: Checkout Code
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
*   **Action:** Downloads your project's code from the GitHub repository onto the runner machine so the subsequent steps can access your `Dockerfile` and source code.

#### Step 2: Login to Docker Hub
```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```
*   **Action:** Authenticates with Docker Hub.
*   **Secrets:** It uses **Encrypted Secrets** (`DOCKER_USERNAME`, `DOCKER_PASSWORD`) that you must set in your GitHub Repository Settings. This keeps your credentials safe and not hardcoded in the file.

#### Step 3: Build and Push Backend
```yaml
- name: Build and push Backend
  uses: docker/build-push-action@v6
  with:
    context: ./backend
    push: true
    tags: ${{ secrets.DOCKER_USERNAME }}/ridex-backend:latest
```
*   **context: ./backend**: Tells Docker to look inside the `backend` folder for the `Dockerfile` and code.
*   **push: true**: Automatically uploads the result to Docker Hub.
*   **tags**: Names the image `ridex-backend` with the `latest` tag.

#### Step 4: Build and Push Frontend
```yaml
- name: Build and push Frontend
  uses: docker/build-push-action@v6
  with:
    context: ./RideX
    push: true
    tags: ${{ secrets.DOCKER_USERNAME }}/ridex-frontend:latest
```
*   **context: ./RideX**: Tells Docker to look inside the `RideX` folder (your frontend).
*   **tags**: Names the image `ridex-frontend`.

---

## How to Make It Work

1.  **Push Code**: Commit and push this file to your GitHub repository.
2.  **Set Secrets**:
    *   Go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**.
    *   Click **New repository secret**.
    *   Add `DOCKER_USERNAME` (your Docker ID).
    *   Add `DOCKER_PASSWORD` (your Docker Hub Access Token).
3.  **Watch it Run**: Go to the **Actions** tab in your GitHub repo to see the pipeline executing live.
