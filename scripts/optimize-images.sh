#!/bin/bash

# 图片批量优化脚本
# 使用 sips (macOS 自带工具) 进行图片压缩和转换

echo "🖼️  开始图片优化..."

# 创建备份目录
BACKUP_DIR="public/assets/note-backup-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# 统计信息
TOTAL_BEFORE=0
TOTAL_AFTER=0
COUNT=0

# 查找所有大于 500KB 的图片
find public/assets/note -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +500k | while read file; do
    # 获取文件大小
    SIZE_BEFORE=$(stat -f%z "$file")
    TOTAL_BEFORE=$((TOTAL_BEFORE + SIZE_BEFORE))
    
    # 备份原文件
    FILENAME=$(basename "$file")
    cp "$file" "$BACKUP_DIR/$FILENAME"
    
    # 获取文件扩展名
    EXT="${file##*.}"
    BASENAME="${file%.*}"
    
    echo "处理: $file ($(numfmt --to=iec-i --suffix=B $SIZE_BEFORE))"
    
    # 根据文件类型进行优化
    if [[ "$EXT" == "png" ]]; then
        # PNG: 转换为 JPEG (质量 85%)
        sips -s format jpeg -s formatOptions 85 "$file" --out "${BASENAME}.jpg" > /dev/null 2>&1
        rm "$file"
        file="${BASENAME}.jpg"
    elif [[ "$EXT" == "jpg" ]] || [[ "$EXT" == "jpeg" ]]; then
        # JPEG: 重新压缩 (质量 85%)
        sips -s format jpeg -s formatOptions 85 "$file" --out "${file}.tmp" > /dev/null 2>&1
        mv "${file}.tmp" "$file"
    fi
    
    # 调整最大宽度为 1920px
    WIDTH=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')
    if [ "$WIDTH" -gt 1920 ]; then
        sips -Z 1920 "$file" > /dev/null 2>&1
    fi
    
    # 获取优化后的大小
    SIZE_AFTER=$(stat -f%z "$file")
    TOTAL_AFTER=$((TOTAL_AFTER + SIZE_AFTER))
    
    SAVED=$((SIZE_BEFORE - SIZE_AFTER))
    PERCENT=$((SAVED * 100 / SIZE_BEFORE))
    
    echo "  ✓ 优化完成: $(numfmt --to=iec-i --suffix=B $SIZE_AFTER) (节省 ${PERCENT}%)"
    
    COUNT=$((COUNT + 1))
done

echo ""
echo "✅ 优化完成!"
echo "处理文件数: $COUNT"
echo "优化前总大小: $(numfmt --to=iec-i --suffix=B $TOTAL_BEFORE)"
echo "优化后总大小: $(numfmt --to=iec-i --suffix=B $TOTAL_AFTER)"
echo "节省空间: $(numfmt --to=iec-i --suffix=B $((TOTAL_BEFORE - TOTAL_AFTER)))"
echo "备份位置: $BACKUP_DIR"
