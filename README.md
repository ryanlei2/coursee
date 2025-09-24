# Coursee

![image](https://user-images.githubusercontent.com/37818919/222242389-c5afd4cf-2130-469b-a7d4-97b7543f26cf.png)

# Running Coursee

Install yarn first to package the project

Because this dynamic website does not have a domain associated with it, just download it, cd into it, and type 'yarn add next as well as yarn dev into the terminal:

```
yarn install
yarn dev
```

Built with React, React-bootstrap, firebase (Javascript9 syntax), SurveyJS, Typescript, HTML, CSS, NPM, Yarn, NextJS, pdfmake <3

share this online with `cloudflared tunnel --url http://localhost:3000` (for me only lol)
or
`./ngrok http http://localhost:3000`

## TODO

EXTRA FEATURES

- [x] check if email is already registered, if so, notify at signup, maybe also if login is bad, once user has completed survey, take away option from dash

- [x] create admin role with elevated privileges to input classes

- [x] implemenation idea: check if user has a certain ID token, if so, give access to them by their token

- [x] make the buttons on index cards with reactbootstrap

- [ ] once student completes survey and sees choices for classes chosen, let them give feedback and thumbs up/down, which should display on admin page

- [ ] student should see history of all recommended courses from a dropdown, this should be a saved in another collection for firestore/realtime db in the user's collection, or make a new collection with just the user's id to grab it from (think about this in the future).

### IMPORTANT

- [ ] add career options
- [ ] only update this after committing code on website, otherwise it screws up with branches
- [ ] get rid of all console.logs after completed because of security purposes to not show user UID's

#### github features:

consider using branches to organize code so nothin is just on one branch (buggy / unstable)

https://stackoverflow.com/questions/39585900/what-is-the-difference-between-develop-vs-feature-branch-type
