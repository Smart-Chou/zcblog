#!/bin/bash

echo "🔄 开始同步 md 文件中的图片引用..."

# 只扫描压缩过程中实际变更了扩展名的图片（从备份目录中找线索）
echo "📁 分析图片变更..."

# 从备份目录中找出那些原来有 .png 但现在变成 .jpg 的文件
declare -a changed_files

if [ -d "public/assets/note-backup-20260217-132323" ]; then
    for backup_file in public/assets/note-backup-20260217-132323/*.png; do
        if [ -f "$backup_file" ]; then
            filename=$(basename "$backup_file" .png)
            # 检查 note 目录是否有对应的 .jpg 文件
            if [ -f "public/assets/note/${filename}.jpg" ]; then
                changed_files+=("$filename")
                echo "  发现变更: ${filename}.png -> ${filename}.jpg"
            fi
        fi
    done
    
    # 检查其他可能的变更
    for backup_file in public/assets/note-backup-20260217-132323/*; do
        if [ -f "$backup_file" ]; then
            filename=$(basename "$backup_file")
            name_without_ext="${filename%.*}"
            backup_ext="${filename##*.}"
            
            # 检查 note 目录中是否存在该文件但扩展名不同
            for current_file in public/assets/note/${name_without_ext}.*; do
                if [ -f "$current_file" ] && [ "$current_file" != "public/assets/note/${name_without_ext}.${backup_ext}" ]; then
                    current_filename=$(basename "$current_file")
                    current_ext="${current_filename##*.}"
                    if [ "$backup_ext" != "$current_ext" ]; then
                        # 避免重复添加
                        already_added=false
                        for f in "${changed_files[@]}"; do
                            if [ "$f" = "$name_without_ext" ]; then
                                already_added=true
                                break
                            fi
                        done
                        if [ "$already_added" = false ]; then
                            changed_files+=("$name_without_ext")
                            echo "  发现变更: ${name_without_ext}.${backup_ext} -> ${name_without_ext}.${current_ext}"
                        fi
                    fi
                fi
            done
        fi
    done
fi

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
        
        # 只处理那些已知扩展名变更的文件
        for name_without_ext in "${changed_files[@]}"; do
            # 获取当前实际扩展名
            actual_ext=""
            for possible_ext in jpg png jpeg gif; do
                if [ -f "public/assets/note/${name_without_ext}.${possible_ext}" ]; then
                    actual_ext="$possible_ext"
                    break
                fi
            done
            
            if [ -n "$actual_ext" ]; then
                # 查找可能的旧扩展名
                for old_ext in png jpg jpeg gif; do
                    if [ "$old_ext" != "$actual_ext" ]; then
                        old_path="/assets/note/${name_without_ext}.${old_ext}"
                        new_path="/assets/note/${name_without_ext}.${actual_ext}"
                        
                        # 检查文件中是否有旧的引用
                        if grep -q "$old_path" "$temp_file" 2>/dev/null; then
                            # 使用 sed 替换
                            sed -i.bak "s|${old_path}|${new_path}|g" "$temp_file"
                            rm -f "${temp_file}.bak"
                            echo "    ✓ 更新: ${name_without_ext}.${old_ext} -> ${name_without_ext}.${actual_ext}"
                            modified=true
                        fi
                    fi
                done
            fi
        done
        
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
