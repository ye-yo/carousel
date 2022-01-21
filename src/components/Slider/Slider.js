import './Slider.css';
import './SliderItem.css';
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import SlideButton from './SlideButton'

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function Slider() {
    const [windowWidth, windowHeight] = useWindowSize();
    const items = ['#33a', '#8c9', '#f3e074',]
    const itemSize = items.length;
    const sliderPadding = 40;
    const sliderPaddingStyle = `0 ${sliderPadding}px`;
    const newItemWidth = getNewItemWidth();
    const transitionTime = 500;
    const transitionStyle = `transform ${transitionTime}ms ease 0s`;
    const [currentIndex, setCurrentIndex] = useState(2)
    const [slideTransition, setTransition] = useState(transitionStyle);
    const [isSwiping, setIsSwiping] = useState(false);
    let isResizing = useRef(false);
    const 양끝에_추가될_데이터수 = 2;

    let slides = setSlides();
    function setSlides() {
        let addedFront = [];
        let addedLast = [];
        var index = 0;
        while (index < 양끝에_추가될_데이터수) {
            addedLast.push(items[index % items.length])
            addedFront.unshift(items[items.length - 1 - index % items.length])
            index++;
        }
        return [...addedFront, ...items, ...addedLast];
    }

    function getNewItemWidth() {
        let itemWidth = windowWidth * 0.9 - (sliderPadding * 2)
        itemWidth = itemWidth > 1060 ? 1060 : itemWidth;
        return itemWidth;
    }

    useEffect(() => {
        isResizing.current = true;
        setIsSwiping(true);
        setTransition('')
        setTimeout(() => {
            isResizing.current = false;
            if (!isResizing.current)
                setIsSwiping(false)
        }, 1000);
    }, [windowWidth])

    useInterval(() => {
        handleSlide(currentIndex + 1)
    }, !isSwiping ? 2000 : null)

    function replaceSlide(index) {
        setTimeout(() => {
            setTransition('');
            setCurrentIndex(index);
        }, transitionTime)
    }

    function handleSlide(index) {
        setCurrentIndex(index);
        if (index < 양끝에_추가될_데이터수) {
            index += itemSize;
            replaceSlide(index)
        }
        else if (index >= itemSize + 양끝에_추가될_데이터수) {
            index -= itemSize;
            replaceSlide(index)
        }
        setTransition(transitionStyle);
    }

    function onSwipe(direction) {
        setIsSwiping(true);
        handleSlide(currentIndex + direction)
    }

    function getItemIndex(index) {
        if (index < 양끝에_추가될_데이터수) {
            index += itemSize - 양끝에_추가될_데이터수
        }
        else if (index >= itemSize + 양끝에_추가될_데이터수) {
            index -= (itemSize + 양끝에_추가될_데이터수);
        }
        else {
            index -= 양끝에_추가될_데이터수;
        }
        return index;
    }

    return (
        <div className="slider-area">
            <div className="slider">
                <SlideButton direction="prev" onClick={() => onSwipe(-1)} />
                <SlideButton direction="next" onClick={() => onSwipe(1)} />
                <div className="slider-list" style={{ padding: sliderPaddingStyle }}>
                    <div className="slider-track"
                        onMouseOver={() => setIsSwiping(true)}
                        onMouseOut={() => setIsSwiping(false)}
                        style={{
                            transform: `translateX(${(-100 / slides.length) * (0.5 + currentIndex)}%)`,
                            transition: slideTransition
                        }}>
                        {
                            slides.map((_, i) => {
                                return getItemIndex(i)
                            }).map((itemIndex, slideIndex) =>
                                <div key={slideIndex} className={`slider-item ${currentIndex === slideIndex ? 'current-slide' : ''}`}
                                    style={{ width: newItemWidth || 'auto' }} >
                                    <a href="/">
                                        <div style={{ background: items[itemIndex] }}>
                                            {itemIndex}({slideIndex})
                                        </div>
                                        {/* <img src="https://static.wanted.co.kr/images/banners/1460/619f3af7.jpg"></img> */}
                                    </a>
                                </div>
                            )}
                    </div>
                </div>
            </div >
        </div >
    );


}

export default Slider;