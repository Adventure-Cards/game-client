# Contributing to Deck Viewer

We welcome new contributors and contributions both large and small!

## Developing

The development branch is `main`, and this is the branch that all pull
requests should be made against.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your
   local device.
2. Create a new branch:
   ```
   git checkout -b MY_BRANCH_NAME
   ```
3. Install yarn:
   ```
   npm install -g yarn
   ```
4. Install the dependencies with:
   ```
   yarn
   ```
5. Start developing and watch for code changes:
   ```
   yarn dev
   ```

## Building

You can build the project with:

```bash
yarn build
# - or -
yarn prepublish
```

If you need to clean the project for any reason, use `yarn clean`.
