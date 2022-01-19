/* @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const Carousel = ({ imgSrcList, height = "400px", autoflow = 2000 }) => {
    const [currentLoopIndex, setCurrentLoopIndex] = React.useState(0);
    const [isFlowing, setIsFlowing] = React.useState(true);

    const size = React.useMemo(() => imgSrcList.length, [imgSrcList]);

    const getStaticIndex = React.useCallback(
        loopIndex => {
            let rest = loopIndex % size;
            if (rest < 0) {
                rest += size;
            }
            return rest;
        },
        [size]
    );

    const getNearestLoopIndex = React.useCallback(
        staticIndex => {
            const currentStaticIndex = getStaticIndex(currentLoopIndex);
            const diff = staticIndex - currentStaticIndex;
            return currentLoopIndex + diff;
        },
        [currentLoopIndex, getStaticIndex]
    );

    React.useLayoutEffect(() => {
        let intervalId;
        if (isFlowing) {
            intervalId = setInterval(() => {
                setCurrentLoopIndex(currentLoopIndex + 1);
            }, autoflow);
        }
        return () => clearTimeout(intervalId);
    }, [isFlowing, setCurrentLoopIndex, currentLoopIndex]);

    return (
        <div
            onMouseOver={() => setIsFlowing(false)}
            onMouseOut={() => setIsFlowing(true)}
            css={css`
        position: relative;
        height: ${height};
        overflow: hidden;
      `}
        >
            <div
                css={css`
          label: Carousel__listWrapper;
          transform: translateX(${-100 * size - 100 * currentLoopIndex}vw);
          transition: 0.2s;
          height: 100%;
        `}
            >
                <div
                    css={css`
            label: Carousel__list;
            transform: translateX(${100 * currentLoopIndex}vw);
            display: inline-flex;
            height: 100%;
          `}
                >
                    {Array(size * 2 + 1)
                        .fill(1)
                        .map((_, index) => {
                            const loopIndexToShow = currentLoopIndex + index - size;
                            return {
                                staticIndex: getStaticIndex(loopIndexToShow),
                                loopIndexToShow
                            };
                        })
                        .map(({ staticIndex, loopIndexToShow }, index) => (
                            <div
                                key={loopIndexToShow}
                                css={css`
                  width: 100vw;
                  height: 100%;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                `}
                            >
                                <img src={imgSrcList[staticIndex]} />
                            </div>
                        ))}
                </div>
            </div>
            <div
                css={css`
          label: Carousel__controller;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          button {
            outline: none;
          }
          & > button {
            display: flex;
            align-items: center;
            height: 100%;
            width: 32px;
            justify-content: center;
            &:focus {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }
          & > div {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        `}
            >
                <button
                    onClick={() => setCurrentLoopIndex(currentLoopIndex - 1)}
                    aria-label="Go to Previous"
                >
                    <KeyboardArrowLeftIcon fontSize="large" />
                </button>
                <button
                    onClick={() => setCurrentLoopIndex(currentLoopIndex + 1)}
                    aria-label="Go to Next"
                >
                    <KeyboardArrowRightIcon fontSize="large" />
                </button>
                <div>
                    {imgSrcList.map((_, index) => (
                        <button
                            key={index}
                            css={
                                getStaticIndex(currentLoopIndex) === index
                                    ? css`
                      color: rgba(255, 200, 0, 0.5);
                      &:focus {
                        color: rgb(255, 200, 0);
                      }
                    `
                                    : css`
                      color: rgba(125, 125, 125, 0.5);
                      &:focus {
                        color: rgb(125, 125, 125);
                      }
                    `
                            }
                            onClick={() => setCurrentLoopIndex(getNearestLoopIndex(index))}
                        >
                            <FiberManualRecordIcon fontSize="small" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
