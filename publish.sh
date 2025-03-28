#!/bin/bash

BRANCH=$(git branch --show-current)
if [[ $BRANCH != "main" ]]; then
  echo "🛑 ERROR: Must be on main branch"
  exit 1
fi

if [[ $(git status --porcelain | wc -l) -gt 0 ]]; then
  echo "🛑 ERROR: Please stash or push current changes"
  exit 1
fi

git checkout main --quiet
git rebase development --quiet
git push origin main --quiet

echo -e "\033[1m\033[36mRebase complete\033[0m"