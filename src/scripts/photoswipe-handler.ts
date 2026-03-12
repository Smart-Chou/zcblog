/**
 * 初始化文章内容图片的 PhotoSwipe 支持。
 * 遍历文章内容区域的所有图片，将它们包装为可点击的 PhotoSwipe 画廊。
 */
function initPhotoSwipeForContentImages() {
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
            // 获取图片原始尺寸，默认为 1920x1080
            const width = 1920;
            const height = 1080;

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

        // 打开 PhotoSwipe
        const openPhotoSwipe = (index: number) => {
            if (!lightbox) {
                console.warn('PhotoSwipe 未初始化');
                return;
            }

            // 加载并打开指定索引的图片
            lightbox.loadAndOpen(index, galleryContainer);
        };

        // 动态加载 PhotoSwipe
        import('photoswipe/lightbox').then(({ default: PhotoSwipeLightbox }) => {
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
        });

        // 页面卸载时清理
        const cleanup = () => {
            if (lightbox) {
                lightbox.destroy();
                lightbox = null;
            }
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