(function () {



})();
let teamLeftArrow = document.querySelector('.team__controls-left'),
    teamRightArrow = document.querySelector('.team__controls-right')

let sliderLength = document.querySelector('.all');
sliderLength.textContent = 4
if (window.innerWidth < 1150) {
    sliderLength.textContent = 5
}
if (window.innerWidth < 850) {
    sliderLength.textContent = 7
}


document.querySelector('.current').textContent = 1;
var slider1 = slider('slider', '.team__slide');

function slider(id, itemSelector, config) {
    var el = document.getElementById(id);
    el.classList.add('slider')
    var mediaStep = '';
    var activeIndIndex = 0;
    var toogleIndex = 0;
    var items = el.querySelectorAll(itemSelector);

    function getMediaStep() {
        var width = window.innerWidth;
        var newStep = width > 1150 ? 'lg' : width > 850 ? 'md' : 'xs';


        if (mediaStep !== newStep) {
            mediaStep = newStep;
            obj.buildSlider();
        }
    }

    function getItemsQuantity() {

        return obj.config.elemsPerPage[mediaStep]
    }

    function onResize() {
        getMediaStep()
    }

    var obj = {
        activeIndex: 0,
        activeIndIndex: activeIndIndex > 0 ? activeIndIndex : 0,
        toogleIndex: 0,
        init: function () {
            getMediaStep();


            var startX = 0
            var touched = false

            var inner = el.querySelector('.slider-inner');
            var indicators = el.querySelectorAll('.slider-indicator');

            function onMouseDown(e) {
                startX = e.clientX || e.touches[0].clientX;
                touched = true;

                const weekly = document.querySelectorAll('.result__weeks-btn');
                // for (const item of weekly) item.addEventListener('touchstart', selectWeek);


            }


            function onMouseMove(e) {
                e.preventDefault()
                if (touched) {
                    inner = inner || el.querySelector('.slider-inner')
                    var x = e.clientX || e.touches[0].clientX;
                    var diff = x - startX;
                    if ((diff < 0 && activeIndIndex < indicators.length - 1) || (diff > 0 && activeIndIndex > 0)) {
                        inner.style.transform = 'translateX(' + diff + 'px)'
                    }
                }
            }

            function onMouseEnd(e) {
                if (touched) {
                    var x = e.clientX || e.changedTouches[0].clientX;
                    if (x - startX > 30) {
                        toggleIndex(activeIndIndex - 1)
                    } else if (startX - x > 30) {
                        toggleIndex(activeIndIndex + 1)

                    }
                    inner = inner || el.querySelector('.slider-inner')
                    inner.style.transform = ''
                }
                touched = false
            }


            teamRightArrow.addEventListener('click', () => {
                toggleIndex(activeIndIndex + 1)
                // obj.next()
            })

            teamLeftArrow.addEventListener('click', () => {
                toggleIndex(activeIndIndex - 1)
                // obj.prev()

            })

            window.removeEventListener('resize', onResize);
            window.addEventListener('resize', onResize);
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('touchstart', onMouseDown);
            el.addEventListener('mousedown', onMouseDown);
            el.addEventListener('touchstart', onMouseDown);
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('touchmove', onMouseMove);
            el.addEventListener('mousemove', onMouseMove);
            // el.addEventListener('touchmove', onMouseMove);
            window.removeEventListener('mouseup', onMouseEnd);
            window.removeEventListener('touchend', onMouseEnd);
            window.addEventListener('mouseup', onMouseEnd);
            window.addEventListener('touchend', onMouseEnd);

            return obj
        },
        config: {
            elemsPerPage: {
                ...{
                    'lg': 4,
                    'md': 3,
                    'xs': 2
                },
                ...((config && config.elemsPerPage) || {})
            }
        },
        buildSlider: function () {

            obj.removeSlider();

            var wrapper = document.createElement("div");
            wrapper.className = 'slider-wrapper';
            var inner = document.createElement("div");
            inner.className = 'slider-inner';

            wrapper.appendChild(inner);
            el.appendChild(wrapper);

            if (obj.config.elemsPerPage[mediaStep] >= items.length) {
                el.classList.add('not-enough-elems');
                return;
            }

            buildPages();
        },
        removeSlider: function () {
            var wrapper = el.querySelector('.slider-wrapper');
            el.classList.remove('not-enough-elems')
            wrapper && wrapper.remove();
        },
        toggle: toggleIndex
    }

    function buildIndicators() {
        var prevInd = el.querySelector('.slider-indicators');
        prevInd && prevInd.remove();

        var indicators = document.createElement('div');
        indicators.classList.add('slider-indicators')
        for (let i = 0; i < Math.ceil(items.length / getItemsQuantity()); i++) {
            let indicator = document.createElement('div');
            indicator.classList.add('slider-indicator');
            if (i === activeIndIndex) {
                indicator.classList.add('active');

            }


            indicator.setAttribute('index', i)
            indicator.addEventListener('click', function () {
                toggleIndex(i)

            })
            indicators.appendChild(indicator);
        }

        var wrapper = el.querySelector('.slider-wrapper')
        wrapper.appendChild(indicators);
    }

    function buildPages(step) {

        step = step || 1;

        var pagePrev = buildPage(obj.activeIndex + items.length - getItemsQuantity() * step);


        var pageCurrent = buildPage(obj.activeIndex)
        var pageNext = buildPage(obj.activeIndex + getItemsQuantity() * step);
        var inner = el.querySelector('.slider-inner');
        if (getItemsQuantity() < items.length) {
            buildIndicators();
            if (!el.querySelector('.slider-indicator.active')) {
                // toggleIndex(0);
            }
        }
        inner.innerHTML = '';

        inner.appendChild(pagePrev)
        inner.appendChild(pageCurrent)
        inner.appendChild(pageNext)
    }

    function buildPage(index) {
        var page = document.createElement("div")
        page.classList.add('slider-page')
        for (let i = index; i < (index + getItemsQuantity()); i++) {
            let item = items[i % items.length];
            let newItem = item.cloneNode(true);
            page.appendChild(newItem)
        }
        return page;
    }
    function toggleIndex(index) {
        var indActive = el.querySelector('.slider-indicator.active')
        var indicators = el.querySelectorAll('.slider-indicator');
        if (!indicators[index]) {
            return
        }
        indActive && indActive.classList.remove('active')
        indicators[index] && indicators[index].classList.add('active')
        if (index > activeIndIndex) {
            index - activeIndIndex > 1 && buildPages(index - activeIndIndex)
            obj.next();
        } else if (index < activeIndIndex) {
            activeIndIndex - index > 1 && buildPages(activeIndIndex - index)
            obj.prev()
        }
        activeIndIndex = index
    document.querySelector('.current').textContent = activeIndIndex + 1;


    }

    obj.prev = function () {
        var wrapper = el.querySelector('.slider-wrapper')
        wrapper.classList.add('prev');
        setTimeout(function () {
            wrapper.classList.remove('prev')
            obj.activeIndex = (obj.activeIndex - getItemsQuantity() + items.length) % items.length;
            buildPages()
        }, 300);
    }

    obj.next = function () {
        var wrapper = el.querySelector('.slider-wrapper')
        wrapper.classList.add('next');
        setTimeout(function () {
            wrapper.classList.remove('next')
            obj.activeIndex = (obj.activeIndex + getItemsQuantity() + items.length) % items.length;

            buildPages()


        }, 300);
    }

    return obj.init();
}

var icon = document.querySelector('.manifest__video-icon');
var img = document.querySelector('.manifest__video-img');
var videoIframe = document.querySelector('.video-iframe');

icon.addEventListener('click', () => {
    videoIframe.style.display = 'block';
    videoIframe.src = videoIframe.src + '?autoplay=1';
    icon.style.display = 'none';
    img.style.display = 'none';
})