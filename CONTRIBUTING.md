# Contributing

Thank you for considering contributing to this package! Let's get you started.

## 1. Fork & Clone

- Make a fork of this repository
- Navigate to your forked repository and copy the SSH url. Clone your fork locally:

```bash
$ git clone git@github.com:{ YOUR_USERNAME }/rtk-query-loader.git
$ cd rtk-query-loader
```

- Once cloned, you will see `origin` as your default remote, pointing to your personal forked repository. Add a remote named upstream pointing to the main rtk-query-loader:

```bash
$ git remote add upstream git@github.com:ryfylke-react-as/rtk-query-loader.git
$ git remote -v
```

## 2. Create a new branch

- First, make sure you have the latest changes:

```bash
$ git pull upstream main
```

- Then create a new feature branch for your changes:

```bash
$ git checkout -b { YOUR_BRANCH_NAME } main
```

## 3. Add changes

For now, try to following existing patterns. Formalized code-guidelines will come at some point.

## 4. Test you changes

- Navigate into the test app, install dependencies, then run tests:

```bash
$ cd testing-app
$ yarn install
$ yarn run test
```

- If you are adding a new feature, make sure to write a new test for your change in `testing-app/tests.test.tsx`.

## 5. Commit & Push

- Commit your changes and push

```bash
$ git commit -a -m "feat: withLoader now has a new argument, ..."
$ git push origin { YOUR_BRANCH_NAME }
```

- We prefer it if you try to stick to [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/#summary).

## 6. Create pull-request

- In Github, navigate to [@ryfylke-react/rtk-query-loader](https://github.com/ryfylke-react-as/rtk-query-loader) and click the button that reads "Compare & pull request".
- Write a title and description, and submit your pull request.
