#!/usr/bin/env python3
import os
import re
from pathlib import Path

def main():
    print("🔄 开始同步 md 文件中的图片引用...")
    
    # 1. 获取 public/assets/note/ 目录下所有图片文件及其实际扩展名
    image_map = {}
    note_dir = Path("public/assets/note/")
    
    print("📁 扫描图片文件...")
    for file_path in note_dir.iterdir():
        if file_path.is_file():
            filename = file_path.name
            name_without_ext = file_path.stem
            ext = file_path.suffix.lstrip('.')
            image_map[name_without_ext] = ext
            print(f"  发现: {filename}")
    
    print()
    print("📝 扫描并更新 md 文件...")
    
    # 2. 扫描所有 md 文件中的图片引用并更新
    updated_count = 0
    total_count = 0
    
    article_dir = Path("src/content/article/")
    
    for md_file in article_dir.glob("*.md"):
        if md_file.is_file():
            total_count += 1
            modified = False
            print(f"  检查: {md_file.name}")
            
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 匹配 ![...](/assets/note/xxx.png) 格式的图片引用
            pattern = r'!\[.*?\]\(/assets/note/([^)]+)\)'
            
            def replace_extension(match):
                nonlocal modified
                full_filename = match.group(1)
                # 提取文件名和扩展名
                name_without_ext = full_filename.rsplit('.', 1)[0] if '.' in full_filename else full_filename
                
                if name_without_ext in image_map:
                    actual_ext = image_map[name_without_ext]
                    current_ext = full_filename.rsplit('.', 1)[1] if '.' in full_filename else ''
                    
                    if current_ext != actual_ext:
                        new_filename = f"{name_without_ext}.{actual_ext}"
                        print(f"    ✓ 更新: {full_filename} -> {new_filename}")
                        modified = True
                        # 替换引用
                        return match.group(0).replace(full_filename, new_filename)
                
                return match.group(0)
            
            new_content = re.sub(pattern, replace_extension, content)
            
            if modified:
                with open(md_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_count += 1
                print(f"    ✅ 文件已更新")
    
    print()
    print("✅ 同步完成!")
    print(f"检查的文件数: {total_count}")
    print(f"更新的文件数: {updated_count}")

if __name__ == "__main__":
    main()

