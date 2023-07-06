
# Manage Task Web Application

Subject project (Thiết kế phần mềm).



## Project Description
Task Management provide eviroment to manage tasks of rooms in the company or manage tasks in projects of team, office and so on.

## Production
Link to Production: [Try this](https://tkpm-olive.vercel.app/)

## Tech Stack

**Client:** React, TailwindCSS

**Server:** Firebase


## Acknowledgements
 - HTML, CSS, Javascript, Typescript
 - [React](https://reactjs.org/docs/getting-started.html)
 - [React Router Dom](https://www.npmjs.com/package/react-router-dom)
 - [React Drag and Drop](https://www.npmjs.com/package/react-beautiful-dnd)
 - [Firebase](https://github.com/matiassingers/awesome-readme)


## Related

Application base on [Trello](https://trello.com)

## How to run in Local
- Install [NodeJs](https://nodejs.org/en/download)
- Clone the project
```
git clone https://github.com/nmkha-github/NMCNPM.git
```
- Go to the project directory
```
cd NMCNPM
```
- Install package
```
npm install
```
- Start the server
```
npm start
```
## Database manage
To manage database, following tutorial
- Create a project in Firebase.
- Replace SDK in file src/lib/config/firebase-config.tsx
```
const FirebaseConfig = {
  // Replace all in this object
  apiKey: "AIzaSyASap1ay125TJIPgYsAEqdE4JvXqUhFhT8",
  authDomain: "nmcnpm-d177c.firebaseapp.com",
  databaseURL: "https://nmcnpm-d177c-default-rtdb.firebaseio.com",
  projectId: "nmcnpm-d177c",
  storageBucket: "nmcnpm-d177c.appspot.com",
  messagingSenderId: "658397747139",
  appId: "1:658397747139:web:38ba98009508d364b0cf76",
  measurementId: "G-FGC4SP6FC4",
};
```
- Config rules for Firestore Database
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2023, 1, 19);
    }
  }
}
```
- Config rules for Storage
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if request.auth != null;
      allow read;
    }
  }
}
```

## Current Status
- Authorization (Login, logout, register user account).
- Module room with create, find, sort by name, join, edit infomation actions.
- Module task (includes **4 status** ToDo, Doing, Reviewing, Done) with create, edit, assign, statistic actions in **realtime**.
- Module member in room with delete, statistic actions.
- Module newsfeed for the notification or usage like a forum.
## Future Status
- Update task detail with more feature
- Update task status with flexible status 
- Update feature notify user on email
- Update feature resource
- Update feature schedule
## Deployment

Config in vercel deploy by branch main in this repository when merge branch or any change in main branch.

- Login in [vercel](https://vercel.com)
- Create a project in vercel
- Link project with repository in github
- Config deploy by branch main
## Contributors
- [20120497 - Nguyễn Quang Huy](https://github.com/QuangHuy54)
- [20120502 - Nguyễn Minh Kha](https://github.com/nmkha-github)
- [20120545 - Lê Hoài Phong](https://github.com/Phongle1311)
