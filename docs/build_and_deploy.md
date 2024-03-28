# How to Build & Test your code

## Front end code build

1. Create a new Feature Branch (checked out from develop / main branch) 
2. Follow the regular naming conventions for the feature branches / hotfix & more
3. Responsiveness is handled by making use of the media queries

## Pre-requisites to Preview / Publish content

1. Preview the content on the author's preview mode
2. Preview the content on the preview server 

```sh

## Key takeaways

1. The URL is of the pattern https://admin.hlx.page/preview/<<Repo-Owner>>/<<Repo-Name>>/<<Branch-Name>>/
    Where 
    - Repo-Owner : Bounteous-Inc  
    - Repo-Name : pricefx-aem
    - Branch-Name : main / develop / feature/test-component
1. Kindly note that the branch name if contains '/' should be replaced with '-' if it must be previewed on a browser
1. Logs of Author / preview / publish can be requested individually.

## What is the branching strategy ?

![image](../resources/branching_strategy_3_repos.png)
