# Contributing

**Thank you for considering contributing to this package**! This small guide will help you get started.

## 🍽️ Fork + Clone 

1. Make a fork of this repository
2. Navigate to your forked repository and copy the SSH url. Clone your fork locally:

```bash
$ git clone git@github.com:{ YOUR_USERNAME }/rtk-query-loader.git
$ cd rtk-query-loader
```

3. Once cloned, you will see `origin` as your default remote, pointing to your personal forked repository. Add a remote named upstream pointing to the main rtk-query-loader:

```bash
$ git remote add upstream git@github.com:ryfylke-react-as/rtk-query-loader.git
$ git remote -v
```

## ➕ Create a new branch 

1. First, make sure you have the latest changes:

```bash
$ git pull upstream main
```

2. Create a new feature branch for your changes:

```bash
$ git checkout -b { YOUR_BRANCH_NAME } main
```

## 👩‍💻 Add your changes 

For now, try to following existing patterns. Formalized code-guidelines will come at some point.

If you have any questions, feel free to open up an issue!

## 🩺 Test you changes 

1. In the `testing-app` directory, install the project dependencies, and then run the tests:

```bash
$ yarn install
$ yarn run test
```

2. If you are adding a new feature, make sure to write a new test for your change in `testing-app/tests.test.tsx` and rerun.

## 🤜 Push your changes
If all the tests pass, you can commit your final changes and push!

```bash
$ git commit -a -m "feat: withLoader now has a new argument, ..."
$ git push origin { YOUR_BRANCH_NAME }
```

> We prefer it if you try to stick to [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/#summary).

## 📄 Create a pull-request 

- On Github, navigate to [@ryfylke-react/rtk-query-loader](https://github.com/ryfylke-react-as/rtk-query-loader) and click the button that reads "Compare & pull request".
- Write a title and description, and submit your pull request.

Your code will be reviewed and if everything looks good you'll be added to the list of contributors.

Any contribution is appreciated 🤘
