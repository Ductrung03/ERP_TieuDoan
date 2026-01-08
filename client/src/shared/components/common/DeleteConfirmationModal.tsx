import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
    show: boolean;
    title?: string;
    content: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    show,
    title = 'Xác nhận xóa',
    content,
    onConfirm,
    onCancel,
    loading = false,
    confirmText = 'Xóa dữ liệu',
    cancelText = 'Hủy bỏ',
    confirmVariant = 'danger'
}) => {
    return (
        <Modal show={show} onHide={onCancel} centered backdrop="static">
            <Modal.Header closeButton className="border-bottom-0">
                <Modal.Title className="text-danger h5">
                    <i className="ti ti-alert-triangle me-2"></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="d-flex flex-column align-items-center text-center">
                    <div className="avatar avatar-xl bg-danger-transparent rounded-circle mb-3">
                        <i className="ti ti-trash fs-1 text-danger"></i>
                    </div>
                    {typeof content === 'string' ? (
                        <p className="mb-0 text-muted fs-15">{content}</p>
                    ) : (
                        content
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top-0 justify-content-center pb-4">
                <Button variant="light" onClick={onCancel} disabled={loading} className="px-4">
                    {cancelText}
                </Button>
                <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-4"
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <i className="ti ti-trash me-2"></i>
                            {confirmText}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;
