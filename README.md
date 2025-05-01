# Tool for following a real chess game using camera feed and YOLO11

![preview](https://github.com/user-attachments/assets/e9d95bec-26a7-4855-a68a-f2e98990dddc)

## Features
1. Digitize over-the-board (OTB) chess games using a camera.
2. Play with an opponent on [Lichess.org](https://lichess.org).
3. Pause and resume detection at any time.
4. Preview of detected pieces after each detection.
5. Analyze game.

## Tech stack
- **Backend:** FastAPI
- **Frontend:** React.js
- **AI model:** YOLO11
- **Containerization:** Docker, Docker Compose

## Run project
Use Docker to build and run the app:
```sh
docker-compose up --build
````
## Start app
Open your browser and go to:
http://localhost:3000

