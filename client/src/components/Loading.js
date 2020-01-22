import React from 'react';

const Loading = () => {
    return (
        // <div className="loading--hover">
        <div data-loading className="bx--loading">
            <svg className="bx--loading__svg" viewBox="-75 -75 150 150">
                <title>Loading</title>
                <circle className="bx--loading__stroke" cx="0" cy="0" r="37.5" />
            </svg>
        </div>
        // </div>
    );
};

export default Loading;