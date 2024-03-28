# How to Build & Test your code

## Front end code build

1. Create a new Feature Branch (checked out from develop / main branch) 
2. Follow the regular naming conventions for the feature branches / hotfix & more
3. Responsiveness is handled by making use of the media queries

## Pre-requisites to Preview / Publish content

1. Preview the content on the author's preview mode
2. Preview the content on the preview server 

## Submitting a Pull Request

1. Pull the latest main branch from `upstream`:
    
    ```
    $ git pull upstream main
    ```
    
2. Always work and submit pull requests from a branch. *Do not submit pull
requests from the `main` branch of your fork*.
    
    ```
    $ git checkout -b { YOUR_BRANCH_NAME } main
    
    ```
    
3. Create your patch or feature.
4. Test your branch and add new test cases where appropriate.
5. Commit your changes using a descriptive commit message.
    
    ```
    $ git commit -m "fix(component-name): Update header with newest designs"
    ```
    
    **Note:** The optional commit -a command-line option will automatically "add"
    and "rm" edited files. See
    [Close a commit via commit message](https://help.github.com/articles/closing-issues-via-commit-messages/)
    and
    [writing good commit messages](https://github.com/erlang/otp/wiki/Writing-good-commit-messages)
    for more details on commit messages.
    
    This project uses a commit format called
    [Conventional Commits](https://www.conventionalcommits.org/). This format is
    used to help automate details about our project and how it changes. When
    committing changes, there will be a tool that automatically looks at commits
    and will check to see if the commit matches the format defined by
    Conventional Commits.
    
6. Once ready for feedback from other contributors and maintainers, **push your
commits to your fork** (be sure to run `npm run lint` and `npm run test` before pushing, to
make sure your code passes linting and unit tests):
    
    ```
    $ git push origin { YOUR_BRANCH_NAME }
    ```
    
7. In Github, navigate to
[https://github.com/Bounteous-Inc/pricefx-aem](https://github.com/Bounteous-Inc/pricefx-aem)
and click the button that reads "Compare & pull request".
8. Write a title and description, then click "Create pull request".
    
    Follow the PR template defined for the project.
    
9. Stay up to date with the activity in your pull request. Maintainers will be
reviewing your work and making comments, asking questions, and suggesting
changes to be made before they merge your code. 
10. When you need to make a
change, add, commit, and push to your branch normally.
    
    Once all revisions to your pull request are complete, a maintainer will
    squash and merge your commits for you.
    
