(() => {
    // 設定 Embla Carousel 的選項
    const options = {
        align: 'center',         // 將輪播內容置中對齊
        draggable: true,         // 啟用拖拽功能
        loop: false,             // 禁用循環滾動
        autoPlay: false,         // 自動播放功能（需要設置 autoPlayInterval）
        autoPlayInterval: 5,     // 自動播放間隔（以秒為單位）
    };
    
    let carousels = []; // 用來儲存多個輪播實例

    // 設置上一頁和下一頁按鈕
    function setupPrevNextBtns(prevBtn, nextBtn, embla) {
        prevBtn.addEventListener('click', embla.scrollPrev, false);
        nextBtn.addEventListener('click', embla.scrollNext, false);
    }
    
    // 根據狀態禁用/啟用上一頁和下一頁按鈕
    function disablePrevNextBtns(prevBtn, nextBtn, embla) {
        return () => {
            if (embla.canScrollPrev()) prevBtn.removeAttribute('disabled');
            else prevBtn.setAttribute('disabled', 'disabled');
            if (embla.canScrollNext()) nextBtn.removeAttribute('disabled');
            else nextBtn.setAttribute('disabled', 'disabled');
        };
    }

    // 自動播放功能
    function autoPlay(carouselId, enable, intervalSec = 0) {
        const index = carousels.findIndex(obj => obj.carouselId === carouselId);
        if (index === -1) return;
        if (enable) {
            if (!carousels[index].intervalId) {
                carousels[index].intervalId = setInterval(() => {
                    if (!document.hidden) {
                        const currentIndex = carousels.findIndex(obj => obj.carouselId === carouselId);
                        if (currentIndex === -1) return;
                        if (carousels[currentIndex].embla.scrollProgress() !== 1) {
                            carousels[currentIndex].embla.scrollNext();
                            return;
                        }
                        carousels[currentIndex].embla.scrollTo(0);
                    }
                }, intervalSec * 1000);
            }
        }
    }

    // 初始化多個 Embla Carousel
    function initCarouselMultiple(target, options) {
        return new Promise((resolve) => {
            const wrap = target.querySelector('.embla');
            const carouselId = target.getAttribute('id');
            const viewPort = wrap.querySelector('.embla__viewport');
            const prevBtn = wrap.querySelector('.embla__button--prev');
            const nextBtn = wrap.querySelector('.embla__button--next');

            let index = carousels.findIndex(obj => obj.carouselId === carouselId);
            if (index !== -1) return;

            const embla = EmblaCarousel(viewPort, options);
            const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);

            setupPrevNextBtns(prevBtn, nextBtn, embla);
            embla.on('select', disablePrevAndNextBtns);
            embla.on('init', disablePrevAndNextBtns);

            carousels.push({ carouselId, embla, intervalId: null });
            resolve(embla);
        });
    }

    // 解析元素的 data-* 屬性
    function getDataAttr(el) {
        const data = {};
        Array.from(el.attributes).forEach(attr => {
            if (/^data-/.test(attr.name)) {
                const camelCaseName = attr.name.substr(5).replace(/-(.)/g, ($0, $1) => $1.toUpperCase());
                data[camelCaseName] = parseBool(attr.value);
            }
        });
        return data;
    }

    // 刪除指定的輪播
    function carouselDestroy(carouselId) {
        const index = carousels.findIndex(obj => obj.carouselId === carouselId);
        if (index === -1) return;
        if ('embla' in carousels[index]) carousels[index].embla.destroy();
        clearInterval(carousels[index].intervalId);
        carousels.splice(index, 1);
    }

    // 將值轉換為布林值
    function parseBool(val) {
        return val === "true";
    }

    // 初始化 Embla
    document.querySelectorAll('.mbr-embla').forEach(el => {
        const carouselId = el.getAttribute('id');
        const prodOptions = getDataAttr(el.querySelector('.embla'));
        initCarouselMultiple(el, Object.assign(prodOptions, options));
        autoPlay(carouselId, prodOptions.autoPlay, +prodOptions.autoPlayInterval);
    });
})();
