/**
 * 初始化文章内容图片的 PhotoSwipe 支持。
 * 遍历文章内容区域的所有图片，将它们包装为可点击的 PhotoSwipe 画廊。
 */
function initPhotoSwipeForContentImages() {
    console.log('初始化 PhotoSwipe 图片点击放大');
    try {
        // 查找文章内容区域
        const content = document.querySelector('.post__content');
        if (!content) return;

        // 查找所有图片
        const images = content.querySelectorAll('img');
        if (images.length === 0) return;

        // 创建隐藏的 PhotoSwipe 画廊容器
        const galleryContainer = document.createElement('div');
        galleryContainer.id = 'content-photoswipe-gallery';
        galleryContainer.style.display = 'none';
        galleryContainer.style.position = 'absolute';
        galleryContainer.style.zIndex = '-9999';
        galleryContainer.style.opacity = '0';
        galleryContainer.style.pointerEvents = 'none';

        // 存储图片数据和索引
        const imageData: Array<{
            src: string;
            width: number;
            height: number;
            alt: string;
            element: HTMLImageElement;
            index: number;
        }> = [];

        // 遍历图片，创建画廊项并存储数据
        images.forEach((img, index) => {
            // 获取图片原始尺寸
            let width = img.naturalWidth || img.width || 1920;
            let height = img.naturalHeight || img.height || 1080;

            // 如果尺寸为 0，使用默认值
            if (width === 0 || height === 0) {
                width = 1920;
                height = 1080;
            }

            // 创建画廊链接
            const link = document.createElement('a');
            link.href = img.src;
            link.setAttribute('data-pswp-src', img.src);
            link.setAttribute('data-pswp-width', width.toString());
            link.setAttribute('data-pswp-height', height.toString());
            link.setAttribute('data-caption', img.alt || '');
            link.setAttribute('data-index', index.toString());

            // 复制图片用于画廊容器
            const imgClone = img.cloneNode(true) as HTMLImageElement;
            link.appendChild(imgClone);
            galleryContainer.appendChild(link);

            // 存储图片数据
            imageData.push({
                src: img.src,
                width,
                height,
                alt: img.alt || '',
                element: img,
                index
            });

            // 为原图添加点击事件和样式
            img.style.cursor = 'zoom-in';
            img.style.transition = 'transform 0.2s ease';

            // 添加悬停效果
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.02)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });

            // 点击事件
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openPhotoSwipe(index);
            });
        });

        // 将画廊容器添加到页面
        document.body.appendChild(galleryContainer);

        // PhotoSwipe 实例
        let lightbox: any = null;
        let isPhotoSwipeReady = false;

        // 打开 PhotoSwipe
        const openPhotoSwipe = (index: number) => {
            if (!lightbox || !isPhotoSwipeReady) {
                console.warn('PhotoSwipe 未初始化，请稍后再试');
                // 显示用户友好的提示
                const img = imageData[index]?.element;
                if (img) {
                    const originalCursor = img.style.cursor;
                    img.style.cursor = 'not-allowed';
                    setTimeout(() => {
                        img.style.cursor = originalCursor;
                    }, 1000);
                }
                return;
            }

            // 加载并打开指定索引的图片
            lightbox.loadAndOpen(index);
        };

        // 加载 PhotoSwipe CSS
        const loadPhotoSwipeCSS = () => {
            // 检查是否已加载 PhotoSwipe CSS
            if (document.querySelector('link[href*="photoswipe"]')) {
                return Promise.resolve();
            }

            return import('photoswipe/style.css').then(() => {
                console.log('PhotoSwipe CSS 加载成功');
            }).catch((error) => {
                console.warn('动态加载 PhotoSwipe CSS 失败，尝试使用 CDN 回退', error);
                // CDN 回退
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/photoswipe@5.4.4/dist/photoswipe.css';
                document.head.appendChild(link);
            });
        };

        // 动态加载 PhotoSwipe JS 和 CSS
        Promise.all([
            loadPhotoSwipeCSS(),
            import('photoswipe/lightbox')
        ]).then(([, { default: PhotoSwipeLightbox }]) => {
            // 创建 PhotoSwipe 实例
            lightbox = new PhotoSwipeLightbox({
                gallery: '#content-photoswipe-gallery',
                children: 'a',
                pswpModule: () => import('photoswipe'),
                showHideAnimationType: 'fade',
                zoomAnimationDuration: 500,
                bgOpacity: 0.8,
                spacing: 0.1,
                wheelToZoom: true,
                pinchToClose: false,
                closeOnVerticalDrag: true,
                padding: { top: 20, bottom: 40, left: 20, right: 20 },
                arrowPrev: true,
                arrowNext: true,
                arrowKeys: true,
                zoom: true,
                maxZoomLevel: 4,
                secondaryZoomLevel: 2,
            });

            // 可选：添加自定义按钮
            lightbox.on('uiRegister', () => {
                // 检查 pswp 和 ui 是否存在
                if (lightbox.pswp?.ui) {
                    lightbox.pswp.ui.registerElement({
                        name: 'download-button',
                        order: 8,
                        isButton: true,
                        html: '<button class="pswp__button pswp__button--download" title="下载"></button>',
                        onClick: (_event: Event, _el: HTMLElement, pswp: any) => {
                            const item = pswp.currSlide?.data;
                            if (item?.src) {
                                window.open(item.src, '_blank');
                            }
                        }
                    });
                }
            });

            // 初始化
            lightbox.init();
            isPhotoSwipeReady = true;
            console.log('PhotoSwipe lightbox 初始化完成，图片数量:', imageData.length);

            // 初始化完成后，更新所有图片的光标样式为可点击
            imageData.forEach(({ element }) => {
                if (element) {
                    element.style.cursor = 'zoom-in';
                }
            });

            // 图片加载成功回调
            lightbox.on('loadComplete', (e: any) => {
                console.log(`图片 ${e.index + 1}/${imageData.length} 加载完成`);
            });

            // 关闭时清理
            lightbox.on('close', () => {
                // 可以在这里添加关闭后的清理逻辑
            });

            // 错误处理
            lightbox.on('error', (error: Error) => {
                console.error('PhotoSwipe 错误:', error);
            });
        }).catch((error) => {
            console.error('加载 PhotoSwipe 失败:', error);
            // 加载失败，禁用图片点击功能
            imageData.forEach(({ element }) => {
                if (element) {
                    element.style.cursor = 'default';
                    // 移除点击事件监听器
                    const newElement = element.cloneNode(true) as HTMLImageElement;
                    element.parentNode?.replaceChild(newElement, element);
                }
            });
        });

        // 页面卸载时清理
        const cleanup = () => {
            if (lightbox) {
                lightbox.destroy();
                lightbox = null;
            }
            isPhotoSwipeReady = false;
            if (galleryContainer && galleryContainer.parentNode) {
                galleryContainer.parentNode.removeChild(galleryContainer);
            }
        };

        // 监听页面卸载
        window.addEventListener('beforeunload', cleanup);
        document.addEventListener('astro:page-load', cleanup);

    } catch (error) {
        console.error('初始化 PhotoSwipe 时出错:', error);
    }
}

// 页面加载后初始化
document.addEventListener('astro:page-load', initPhotoSwipeForContentImages);

// 如果页面已加载，立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhotoSwipeForContentImages);
} else {
    initPhotoSwipeForContentImages();
}