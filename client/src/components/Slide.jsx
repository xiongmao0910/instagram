// Import library
import { useState } from 'react';
import { Left, Right } from '@icon-park/react';

// Import components

const Slide = ({ media }) => {
    const [option, setOption] = useState({
        index: 0,
        isFirstStep: true,
        isLastStep: media.length === 1,
        widthContainer: 100 * media.length,
    });

    /**
     * Handle event
     */
    const handleClick = ({ type }) => {
        if (type === 1) {
            setOption((prev) => {
                return {
                    ...prev,
                    index: prev.index + 1,
                    isFirstStep: prev.index + 1 === 0,
                    isLastStep: prev.index + 1 === media.length - 1,
                };
            });
        }

        if (type === -1) {
            setOption((prev) => {
                return {
                    ...prev,
                    index: prev.index - 1,
                    isFirstStep: prev.index - 1 === 0,
                    isLastStep: prev.index - 1 === media.length,
                };
            });
        }
    };

    return (
        <div className="slide">
            <div
                className="slide-container"
                style={{
                    '--width-slide-container': `${option.widthContainer}%`,
                    '--slide-length': `${media.length}`,
                    transform: `translateX(calc(${option.index} * -${
                        100 / media.length
                    }%))`,
                }}
            >
                {media.map((el, index) => (
                    <div key={index} className="slide-item">
                        <img
                            className="img-fluid"
                            src={el}
                            alt="a photo / video of post"
                        />
                    </div>
                ))}
            </div>
            {!option.isFirstStep && (
                <div
                    className="slide-button slide-button-prev"
                    onClick={() => handleClick({ type: -1 })}
                >
                    <Left />
                </div>
            )}
            {!option.isLastStep && (
                <div
                    className="slide-button slide-button-next"
                    onClick={() => handleClick({ type: 1 })}
                >
                    <Right />
                </div>
            )}
        </div>
    );
};

export default Slide;
