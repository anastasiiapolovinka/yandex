class Carousel {
    /* конфигурация */
    carouselId = null;
    listClass = null;
    listItemClass = null;
    arrowPrevClass = null;
    arrowNextClass = null;
    indicatorClass = null;
    indicatorItemClass = null;
    width = null; // ширина картинки + gap
    gap = null;
    count = null; // видимое количество изображений
    autoPlayInterval = null; // видимое количество изображений
    infinityLoop = null; // бесконечная прокрутка слайдера
    hide = null; // управление отображением слайдера

    // задаем переменные для элементов карусели
    carousel = null;
    list = null;
    listElems = null;
    indicator = null;
    arrowPrev = null;
    arrowNext = null;

    position = 0;
    currentIndicator = 1;
    slidesCount = 0;
 
    constructor({
        carouselId,
        listClass,
        listItemClass,
        itemWidth,
        itemGap,
        visibleItemsCount,
        arrowPrevClass,
        arrowNextClass,
        indicatorClass,
        indicatorItemClass,
        autoPlayInterval,
        infinityLoop = true,
        hide = false
    }) {
        this.carouselId = carouselId;
        this.listClass = listClass;
        this.listItemClass = listItemClass;
        this.width = itemWidth + itemGap || 'auto';
        this.gap = itemGap;
        this.count = visibleItemsCount;
        this.arrowNextClass = arrowNextClass;
        this.arrowPrevClass = arrowPrevClass;
        this.indicatorClass = indicatorClass;
        this.indicatorItemClass = indicatorItemClass;
        this.autoPlayInterval = autoPlayInterval;
        this.infinityLoop = infinityLoop;
        this.hide = hide;
    }

    init() {
        this.carousel = document.getElementById(this.carouselId);
        this.list = this.carousel.querySelector(this.listClass);
        this.listElems = this.carousel.querySelectorAll(this.listItemClass);
        this.slidesCount = this.listElems.length;
        this.indicator = document.querySelector(this.indicatorClass);
        this.arrowPrev = document.querySelector(this.arrowPrevClass);
        this.arrowNext = document.querySelector(this.arrowNextClass);

        this.arrowPrev.onclick = () => this.move('prev');
        this.arrowNext.onclick = () => this.move();

        if (this.indicatorItemClass) {
            for (let i = 0; i < this.slidesCount; i++) {
                const indicatorItem = document.createElement('button');
                indicatorItem.classList.add(this.indicatorItemClass);
                this.indicator.appendChild(indicatorItem);
            }
            this.updateIndicatorPosition();
        } else {
            this.indicator.innerHTML = `${this.currentIndicator}/${this.slidesCount}`;
        }

        this.carousel.style.overflow = 'hidden';
     
        this.list.style.display = this.hide ? 'none' : 'flex';
        
        if (this.width === 'auto') {
            this.width = this.carousel.offsetWidth;
        }

        const listChildren = this.list.children;

        for (let i = 0; i < listChildren.length; i++) {
            listChildren[i].style.minWidth = this.width + 'px';
            listChildren[i].style.display = 'flex';
        }

        if (this.autoPlayInterval) {
            setInterval(() => this.move(), this.autoPlayInterval * 1000);
        }
    }

    updateIndicatorPosition(direction = 'next') {
        const prevActivePos = this.currentIndicator === 1 ? this.slidesCount : this.currentIndicator - 1;
        const nextActivePos = this.currentIndicator === this.slidesCount ? 0 : this.currentIndicator;
        const prevActiveItemPos = direction === 'next' ? prevActivePos - 1 : nextActivePos;
        const prevActiveItem = this.indicator.children[prevActiveItemPos];
        prevActiveItem?.classList.remove('active');

        const currentIndicatorItem = this.indicator.children[this.currentIndicator - 1];
        currentIndicatorItem.classList.add('active');
        this.toggleDisable();
    }

    toggleDisable() {
        if (!this.infinityLoop) {
            if (this.currentIndicator === this.slidesCount) {
                this.arrowNext.disabled = true;
            } else if (this.currentIndicator === 1) {
                this.arrowPrev.disabled = true;
            } else {
                this.arrowNext.disabled = false;
                this.arrowPrev.disabled = false;
            }
        }
    }

    move(direction = 'next') {
        if (direction === 'next') {
            // сдвиг вправо
            this.position -= this.width;
            const removedItem = this.list.removeChild(this.listElems[this.currentIndicator - 1]);
            this.list.appendChild(removedItem);
            this.currentIndicator++;
            if (this.currentIndicator === this.slidesCount + 1) {
                this.currentIndicator = 1;
            }
        } else {
            // сдвиг влево
            const removedItem = this.list.removeChild(this.list.children[this.slidesCount - 1]);
            this.list.insertBefore(removedItem, this.list.children[0]);
            this.position += this.width;
            this.currentIndicator--;
            if (this.currentIndicator === 0) {
                this.currentIndicator = this.slidesCount;
            } 
        }
        if (this.indicatorItemClass) {
            this.updateIndicatorPosition(direction);
        } else {
            this.indicator.innerHTML = `${this.currentIndicator}/${this.slidesCount}`;
        }
    }
};

const participantsCarouselConfig = { 
    carouselId: 'carousel', // root elem of carousel
    listClass: '.gamersCard', // ul of carousel
    listItemClass: '.gamerCard',
    visibleItemsCount: 3,
    arrowPrevClass: '.arrowPrev',
    arrowNextClass: '.arrowNext',
    indicatorClass: '.carouselIndicator',
    autoPlayInterval: 4
 };

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const participantsDesktopCarouselConfig = {
    itemWidth: 394,
    itemGap: 20
};

const participantsConfig = isMobile ? participantsCarouselConfig : { ...participantsCarouselConfig, ...participantsDesktopCarouselConfig };

const participantsCarousel = new Carousel(participantsConfig);

 participantsCarousel.init();

 const stagesCarousel = new Carousel({
    carouselId: 'stagesCarousel',
    listClass: '.mobList',
    listItemClass: '.mobList > li',
    visibleItemsCount: 1,
    arrowPrevClass: '.arrowPrevBtn',
    arrowNextClass: '.arrowNextBtn',
    indicatorClass: '.stagesIndicator',
    indicatorItemClass: 'indicatorItem',
    infinityLoop: false,
    hide: !isMobile
 });

 stagesCarousel.init();
