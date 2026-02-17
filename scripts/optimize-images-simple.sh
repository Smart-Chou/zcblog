#!/bin/bash

# 简化版图片优化脚本
# 使用 sips (macOS 自带工具)

echo "🖼️  开始图片优化..."
echo ""

# 创建备份目录
BACKUP_DIR="public/assets/note-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 备份目录: $BACKUP_DIR"
echo ""

# 统计
TOTAL_BEFORE=0
TOTAL_AFTER=0
COUNT=0

# 处理大于 500KB 的图片
find public/assets/note -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +500k | while read file; do
    SIZE_BEFORE=$(stat -f%z "$file")
    FILENAME=$(basename "$file")
    
    # 备份
    cp "$file" "$BACKUP_DIR/$FILENAME"
    
    # 获取扩展名
    EXT="${file##*.}"
    BASENAME="${file%.*}"
    
    echo "📷 处理: $FILENAME"
    echo "   原始大小: $((SIZE_BEFORE / 1024 / 1024))MB"
    
    # PNG 转 JPEG
    if [[ "$EXT" == "png" ]]; then
        sips -s format jpeg -s formatOptions 85 "$file" --out "${BASENAME}.jpg" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            rm "$file"
            file="${BASENAME}.jpg"
            echo "   ✓ 转换为 JPEG"
        fi
    elif [[ "$EXT" == "jpg" ]] || [[ "$EXT" == "jpeg" ]]; then
        # 重新压缩 JPEG
        sips -s format jpeg -s formatOptions 85 "$file" --out "${file}.tmp" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            mv "${file}.tmp" "$file"
            echo "   ✓ 重新压缩"
        fi
    fi
    
    # 限制最大宽度 1920px
    WIDTH=$(sips -g pixelWidth "$file" 2>/dev/null | tail -1 | awk '{print $2}')
    if [ ! -z "$WIDTH" ] && [ "$WIDTH" -gt 1920 ]; then
        sips -Z 1920 "$file" >/dev/null 2>&1
        echo "   ✓ 调整尺寸: ${WIDTH}px → 1920px"
    fi
    
    SIZE_AFTER=$(stat -f%z "$file" 2>/dev/null || echo $SIZE_BEFORE)
    SAVED=$((SIZE_BEFORE - SIZE_AFTER))
    PERCENT=$((SAVED * 100 / SIZE_BEFORE))
    
    echo "   优化后: $((SIZE_AFTER / 1024 / 1024))MB (节省 ${PERCENT}%)"
    echo ""
    
    COUNT=$((COUNT + 1))
    TOTAL_BEFORE=$((TOTAL_BEFORE + SIZE_BEFORE))
    TOTAL_AFTER=$((TOTAL_AFTER + SIZE_AFTER))
done

echo "✅ 优化完成!"
echo "处理文件: $COUNT 个"
echo "优化前: $((TOTAL_BEFORE / 1024 / 1024))MB"
echo "优化后: $((TOTAL_AFTER / 1024 / 1024))MB"
echo "节省: $((( TOTAL_BEFORE - TOTAL_AFTER) / 1024 / 1024))MB"
