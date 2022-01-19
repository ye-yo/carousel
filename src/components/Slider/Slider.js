import './Slider.css';
import './SliderItem.css';
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { ReactComponent as ArrowIcon } from '../../assets/icons/ic_arrow.svg'


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

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
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
    let newItemWidth = windowWidth * 0.9 - (sliderPadding * 2)
    newItemWidth = newItemWidth > 1060 ? 1060 : newItemWidth;
    const newTrackWidth = newItemWidth * (slideLength);
    const initPosX = - sliderPadding + windowWidth / 2 - newItemWidth / 2;
    const transitionTime = 500;
    const transitionStyle = `transform ${transitionTime}ms ease 0s`;
    const [currentIndex, setCurrentIndex] = useState(2)
    const [posX, setPosX] = useState(0);
    const [slideTransition, setTransition] = useState(transitionStyle);
    const [isSwiping, setIsSwiping] = useState(false);

    let firstTwoItem = items.slice(-2);
    let lastTwoItem = items.slice(0, 2);
    firstTwoItem = firstTwoItem.length < 2 ? [...firstTwoItem, ...firstTwoItem] : firstTwoItem;
    lastTwoItem = lastTwoItem.length < 2 ? [...lastTwoItem, ...lastTwoItem] : lastTwoItem;
    const slides = [...firstTwoItem, ...items, ...lastTwoItem]
    useInterval(() => {
        handleSlide(currentIndex + 1)
    }, !isSwiping ? 2000 : null)

    function reset(index) {
        setTimeout(() => {
            setTransition('');
            setPosX(-1 * (newItemWidth * index));
        }, transitionTime)
    }
    function getPosX(index) {
        var posX = -1 * (newItemWidth * index);
        posX = posX === 0 ? initPosX : posX;
        return posX;
    }
    function handleSlide(index) {
        setPosX(getPosX(index));
        if (index < 2) {
            index += itemSize;
            reset(index)
        }
        else if (index >= itemSize + 2) {
            index = index - itemSize;
            reset(index)
        }
        setTransition(transitionStyle);
        setCurrentIndex(index);
    }

    function getOriginIndex(index) {
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
                <button className="btn-slide-control btn-prev" onMouseOver={() => setIsSwiping(true)} onMouseOut={() => setIsSwiping(false)} onClick={() => { setIsSwiping(true); handleSlide(currentIndex - 1) }} style={{ left: (windowWidth - newItemWidth) / 2 - 60 }}><ArrowIcon width="16" height="16" fill="#333" /></button>
                <button className="btn-slide-control btn-next" onMouseOver={() => setIsSwiping(true)} onMouseOut={() => setIsSwiping(false)} onClick={() => { setIsSwiping(true); handleSlide(currentIndex + 1) }} style={{ right: (windowWidth - newItemWidth) / 2 - 60 }}><ArrowIcon width="16" height="16" fill="#333" /></button>
                <div className="slider-list" style={{ padding: sliderPaddingStyle }}>
                    <div className="slider-track" style={{ width: newTrackWidth || 'auto', transform: `translateX(${(posX || currentIndex * newItemWidth * -1) + initPosX}px)`, transition: slideTransition }}>
                        {
                            slides.map((_, i) => {
                                return getOriginIndex(i)
                            }).map((number, i) =>
                                <div key={i} className={`slider-item ${currentIndex} ${i} ${number} ${currentIndex - 2 === number ? 'current-slide' : ''}`} style={{ width: newItemWidth || 'auto' }} >
                                    <a>
                                        <div style={{ background: items[number] }}>{number}({i})</div>
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