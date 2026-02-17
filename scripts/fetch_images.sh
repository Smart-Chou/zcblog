# 初始化变量
total_pages=34
api_key="MUHLMUotKRNnNaiALxR7iu837dHWZT6N"
output_file="all_images.json"

# 清空或创建输出文件
echo '{"images":[]}' > "$output_file"

# 循环请求每一页并合并结果
for ((page=1; page<=total_pages; page++)); do
  echo "Fetching page $page..."
  curl -s -X GET "https://pic.marxchou.com/api/images?page=$page" \
    -H "Authorization: Bearer $api_key" \
    | jq '.images' > "page_$page.json"

  # 合并到总文件
  jq -s '.[0].images += .[1] | .[0]' "$output_file" "page_$page.json" > "temp.json" && mv "temp.json" "$output_file"
done

# 清理临时单页文件
echo "Cleaning up temporary files..."
rm -f page_*.json

echo "All data saved to $output_file"

# 提取所有图片的webp链接
jq '.images |= map({webp: .urls.webp})' all_images.json > webp_only.json
echo "Webp links saved to webp_only.json"

grep -v '^$' webp_only.json > webp_only_no_empty.json
echo "Empty lines removed. Result saved to webp_only_no_empty.json"