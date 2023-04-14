// Import library
import React from 'react';

// Import component

const Modal = ({ title, children, size }) => {
    return (
        <div className="modal d-flex justify-center items-center">
            <div
                className="modal-container"
                data-size-modal={size ? size : 'sm'}
            >
                {title && (
                    <div className="modal-header">
                        <div className="modal-title fw-semibold">{title}</div>
                    </div>
                )}
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
