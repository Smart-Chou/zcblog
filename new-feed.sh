#!/bin/bash

# Step 1: 获取文件名
read -p "请输入文件名（不包括扩展名, 默认为当日时间 YYYY-MM-DD): " filename
if [ -z "$filename" ]; then 
  filename=$(date +%F)
fi

# Step 2: 选择文件创建的位置
read -p "请输入文件创建的位置（默认目录 './src/content/feed'): " filepath
if [ -z "$filepath" ]; then
  filepath="./src/content/feed"
fi

# 创建目录（如果不存在）
mkdir -p "$filepath"

# 完整文件路径
fullpath="$filepath/$filename.md"

# Step 4: 是否写入默认formatter
read -p "是否写入默认formatter (输入 'Yes' 或 'No'): " write_formatter
write_formatter=$(echo "$write_formatter" | tr '[:upper:]' '[:lower:]')
while [[ "$write_formatter" != "yes" && "$write_formatter" != "no" && "$write_formatter" != "y" && "$write_formatter" != "n" ]]; do
  echo "无效的输入，请重新输入。"
  read -p "是否写入默认formatter (输入 'Yes' 或 'No'): " write_formatter
  write_formatter=$(echo "$write_formatter" | tr '[:upper:]' '[:lower:]')
done

# Step 5: 根据选择写入默认formatter
if [[ "$write_formatter" == "yes" || "$write_formatter" == "y" ]]; then
  cat <<EOL > "$fullpath"
---
pubDate: 
image:
feeling:
---
EOL
else
  touch "$fullpath"
fi

# 确认文件是否创建成功
if [ -f "$fullpath" ]; then
  echo "文件已创建: $fullpath"
else
  echo "文件创建失败: $fullpath"
fi
