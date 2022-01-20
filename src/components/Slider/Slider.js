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
    const slideLength = itemSize + 4;
    const sliderPadding = 40;
    const sliderPaddingStyle = `0 ${sliderPadding}px`;
    const newItemWidth = getNewItemWidth();
    const newTrackWidth = newItemWidth * (slideLength);
    const initPosX = - sliderPadding + windowWidth / 2 - newItemWidth / 2;
    const transitionTime = 500;
    const transitionStyle = `transform ${transitionTime}ms ease 0s`;

    const [currentIndex, setCurrentIndex] = useState(2)
    const [posX, setPosX] = useState(0);
    const [slideTransition, setTransition] = useState(transitionStyle);
    const [isSwiping, setIsSwiping] = useState(false);
    let isResizing = false;

    const slides = setSlides();

    function setSlides() {
        let firstTwoItem = items.slice(-2);
        let lastTwoItem = items.slice(0, 2);
        firstTwoItem = firstTwoItem.length < 2 ? [...firstTwoItem, ...firstTwoItem] : firstTwoItem;
        lastTwoItem = lastTwoItem.length < 2 ? [...lastTwoItem, ...lastTwoItem] : lastTwoItem;
        return [...firstTwoItem, ...items, ...lastTwoItem];
    }

    function getNewItemWidth() {
        let itemWidth = windowWidth * 0.9 - (sliderPadding * 2)
        itemWidth = itemWidth > 1060 ? 1060 : itemWidth;
        return itemWidth;
    }

    function getPosX(index) {
        var posX = -1 * (newItemWidth * index);
        posX = posX === 0 ? initPosX : posX;
        posX += initPosX;
        return posX;
    }

    useEffect(() => {
        isResizing = true;
        setIsSwiping(true);
        setTransition('')
        setPosX(0)
        setTimeout(() => {
            isResizing = false;
            if (!isResizing)
                setIsSwiping(false)
        }, 1000);
    }, [windowWidth])

    useInterval(() => {
        handleSlide(currentIndex + 1)
    }, !isSwiping ? 2000 : null)

    function changeSlide(index) {
        setTimeout(() => {
            setTransition('');
            setPosX(getPosX(index));
        }, transitionTime)
    }

    function handleSlide(index) {
        setPosX(getPosX(index));
        if (index < 2) {
            index += itemSize;
            changeSlide(index)
        }
        else if (index >= itemSize + 2) {
            index = index - itemSize;
            changeSlide(index)
        }
        setTransition(transitionStyle);
        setCurrentIndex(index);
    }

    function prevSlide() {
        setIsSwiping(true);
        handleSlide(currentIndex - 1)
    }

    function nextSlide() {
        setIsSwiping(true);
        handleSlide(currentIndex + 1)
    }

    function getItemIndex(index) {
        if (index < 2) {
            index += itemSize - 2
        }
        else if (index >= itemSize + 2) {
            index -= (itemSize + 2);
        }
        else {
            index -= 2;
        }
        return index;
    }

    return (
        <div className="slider-area">
            <div className="slider">
                <SlideButton direction="prev" onClick={prevSlide} />
                <SlideButton direction="next" onClick={nextSlide} />
                <div className="slider-list" style={{ padding: sliderPaddingStyle }}>
                    <div className="slider-track"
                        onMouseOver={() => setIsSwiping(true)}
                        onMouseOut={() => setIsSwiping(false)}
                        style={{
                            width: newTrackWidth || 'auto',
                            transform: `translateX(${(posX || getPosX(currentIndex))}px)`,
                            transition: slideTransition
                        }}>
                        {
                            slides.map((_, i) => {
                                return getItemIndex(i)
                            }).map((itemIndex, slideIndex) =>
                                <div key={slideIndex} className={`slider-item ${currentIndex - 2 === itemIndex ? 'current-slide' : ''}`}
                                    style={{ width: newItemWidth || 'auto' }} >
                                    <a>
                                        <div style={{ background: items[itemIndex] }}>
                                            {/* {itemIndex}({slideIndex}) */}
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