#!/bin/bash

echo "🔄 开始同步 md 文件中的图片引用..."

# 1. 获取 public/assets/note/ 目录下所有图片文件及其实际扩展名
declare -A image_map

echo "📁 扫描图片文件..."
for file in public/assets/note/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        name_without_ext="${filename%.*}"
        ext="${filename##*.}"
        image_map["$name_without_ext"]="$ext"
        echo "  发现: $filename"
    fi
done

echo ""
echo "📝 扫描并更新 md 文件..."

# 2. 扫描所有 md 文件中的图片引用并更新
updated_count=0
total_count=0

for md_file in src/content/article/*.md; do
    if [ -f "$md_file" ]; then
        ((total_count++))
        modified=false
        temp_file="${md_file}.tmp"
        
        echo "  检查: $(basename "$md_file")"
        
        # 逐行读取文件
        while IFS= read -r line || [ -n "$line" ]; do
            original_line="$line"
            
            # 匹配 ![...](/assets/note/xxx.png) 格式的图片引用
            # 查找所有可能的图片引用
            if [[ "$line" =~ \!\[.*\]\(/assets/note/([^)]+)\) ]]; then
                # 提取文件名（包含扩展名）
                full_filename="${BASH_REMATCH[1]}"
                name_without_ext="${full_filename%.*}"
                current_ext="${full_filename##*.}"
                
                # 检查是否有对应的实际文件
                if [ -n "${image_map["$name_without_ext"]}" ]; then
                    actual_ext="${image_map["$name_without_ext"]}"
                    
                    # 如果扩展名不同，进行替换
                    if [ "$current_ext" != "$actual_ext" ]; then
                        new_filename="${name_without_ext}.${actual_ext}"
                        line="${line//${full_filename}/${new_filename}}"
                        echo "    ✓ 更新: $full_filename -> $new_filename"
                        modified=true
                    fi
                fi
            fi
            
            echo "$line"
        done < "$md_file" > "$temp_file"
        
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

echo ""
echo "✅ 同步完成!"
echo "检查的文件数: $total_count"
echo "更新的文件数: $updated_count"
