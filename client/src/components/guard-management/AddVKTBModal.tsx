import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { VKTB } from '../../api/services';

interface AddVKTBModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: Partial<VKTB>) => void;
}

const AddVKTBModal: React.FC<AddVKTBModalProps> = ({ show, onHide, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<VKTB>>({
        defaultValues: {
            tenvktb: '',
            donvitinh: '',
            tinhtrang: 'Tốt',
            ghichu: '',
        }
    });

    const handleFormSubmit: SubmitHandler<Partial<VKTB>> = (data) => {
        onSubmit(data);
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-primary-transparent">
                <Modal.Title>
                    <i className="ti ti-shield-plus me-2"></i>
                    Thêm VKTB Mới
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-shield me-1 text-primary"></i>
                                    Tên VKTB *
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="VD: Súng AK-47"
                                    isInvalid={!!errors.tenvktb}
                                    {...register("tenvktb", { required: "Tên VKTB là bắt buộc" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.tenvktb?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-ruler me-1 text-info"></i>
                                    Đơn Vị Tính
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="VD: Khẩu"
                                    {...register("donvitinh")}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-circle-check me-1 text-success"></i>
                                    Tình Trạng
                                </Form.Label>
                                <Form.Select {...register("tinhtrang")}>
                                    <option value="Tốt">Tốt</option>
                                    <option value="Khá">Khá</option>
                                    <option value="Cần sửa chữa">Cần sửa chữa</option>
                                    <option value="Hỏng">Hỏng</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="ti ti-notes me-1 text-secondary"></i>
                            Ghi Chú
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Nhập ghi chú..."
                            {...register("ghichu")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit">
                        <i className="ti ti-check me-1"></i>
                        Thêm VKTB
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddVKTBModal;
