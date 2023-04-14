// Import library
import React from 'react';
import { Close } from '@icon-park/react';

// Import component

const Modal = ({ title, children, size, isIcon, setModal }) => {
    return (
        <div className="modal d-flex justify-center items-center">
            <div
                className="modal-container"
                data-size-modal={size ? size : 'sm'}
            >
                {isIcon && (
                    <div className="modal-icon" onClick={() => setModal(false)}>
                        <Close />
                    </div>
                )}
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
