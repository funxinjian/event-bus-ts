#!/bin/bash

pnpm run build

if [ $? -ne 0 ]; then
    echo "build 失败"
    exit 1
fi

pnpm jest

if [ $? -ne 0 ]; then
    echo "测试失败"
    exit 1
fi

# 提取 version 字段的值
VERSION=$(sed -n 's/.*"version": "\([^"]*\)".*,/\1/p' package.json)

if [[ $VERSION == *"beta"* ]]; then
    pnpm publish --access public --tag beta
else
    pnpm publish --access public
fi
