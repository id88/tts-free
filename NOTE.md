
1. 运行 `git fetch` 命令，它会从远程仓库获取最新的分支和提交历史，但不会自动合并或修改你的本地工作区。它只是更新远程分支的引用和提交历史，使你能够在本地进行进一步操作，如合并、比较差异或创建新分支等。

2. 如果你想要将远程仓库的特定分支更新到本地，可以运行 `git checkout <branch-name>` 命令，将 `<branch-name>` 替换为你想要更新的分支名称。如果你希望更新当前所在分支，可以跳过此步骤。

3. 运行 `git merge origin/<branch-name>` 命令，将 `<branch-name>` 替换为你想要更新的远程分支名称。这将把远程分支的更改合并到你的本地分支中。

总结起来，将远程仓库更新到本地的基本步骤是：
```shell
git fetch
git checkout <branch-name> (可选)
git merge origin/<branch-name>
```
请注意，在执行 `git merge` 命令之前，确保你的本地分支没有未提交的更改，否则合并可能会失败。如果发生冲突，你需要解决冲突后再进行提交。

你可以通过运行 `git branch -r` 查看所有已获取的远程分支列表。



## 升级项目的依赖，运行报错

```
Run npm run build

> tts-free@0.0.1 build
> vue-tsc --noEmit && vite build && electron-builder

/home/runner/work/tts-free/tts-free/node_modules/vue-tsc/index.js:34
            throw err;
            ^
Search string not found: "/supportedTSExtensions = .*(?=;)/"
(Use `node --trace-uncaught ...` to show where the exception was thrown)

Node.js v18.20.5
```


**解决方案**

翻了下该 Issue，有人给出了 bug 的来源 [vuejs/language-tools#5018](https://github.com/vuejs/language-tools/issues/5018)，点进去看看，该 Issue 日期也是新鲜的。

Issue 中也有人给出了[解决方法](https://github.com/vuejs/language-tools/issues/5018#issuecomment-2494783497)，自己尝试了是可行的。

- vue-tsc 版本固定成 2.0.29
- typescript 版本固定成 5.6.2

