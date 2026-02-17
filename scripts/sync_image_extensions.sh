#!/bin/bash

echo "🔄 开始同步 md 文件中的图片引用..."

# 1. 创建临时文件来存储图片映射
IMAGE_MAP=$(mktemp)

echo "📁 扫描图片文件..."
for file in public/assets/note/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        name_without_ext="${filename%.*}"
        ext="${filename##*.}"
        echo "$name_without_ext|$ext" >> "$IMAGE_MAP"
        echo "  发现: $filename"
    fi
done

echo ""
echo "📝 扫描并更新 md 文件..."

updated_count=0
total_count=0

for md_file in src/content/article/*.md; do
    if [ -f "$md_file" ]; then
        ((total_count++))
        modified=false
        temp_file="${md_file}.tmp"
        
        echo "  检查: $(basename "$md_file")"
        
        # 复制原文件到临时文件
        cp "$md_file" "$temp_file"
        
        # 读取图片映射，逐个检查并替换
        while IFS='|' read -r name_without_ext actual_ext; do
            if [ -z "$name_without_ext" ] || [ -z "$actual_ext" ]; then
                continue
            fi
            
            # 查找可能的扩展名：png, jpg, jpeg, gif
            for current_ext in png jpg jpeg gif; do
                if [ "$current_ext" != "$actual_ext" ]; then
                    old_path="/assets/note/${name_without_ext}.${current_ext}"
                    new_path="/assets/note/${name_without_ext}.${actual_ext}"
                    
                    # 检查文件中是否有旧的引用
                    if grep -q "$old_path" "$temp_file" 2>/dev/null; then
                        # 使用 sed 替换
                        sed -i.bak "s|${old_path}|${new_path}|g" "$temp_file"
                        rm -f "${temp_file}.bak"
                        echo "    ✓ 更新: ${name_without_ext}.${current_ext} -> ${name_without_ext}.${actual_ext}"
                        modified=true
                    fi
                fi
            done
        done < "$IMAGE_MAP"
        
        # 如果文件被修改，替换原文件
        if [ "$modified" = true ]; then
            mv "$temp_file" "$md_file"
            ((updated_count++))
            echo "    ✅ 文件已更新"
        else
            rm "$temp_file"
        fi
    fi
done

# 清理临时文件
rm -f "$IMAGE_MAP"

echo ""
echo "✅ 同步完成!"
echo "检查的文件数: $total_count"
echo "更新的文件数: $updated_count"
