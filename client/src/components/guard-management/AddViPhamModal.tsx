import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface ViPhamData {
    maHocVien: string;
    tenHocVien: string;
    loaiViPham: string;
    moTa: string;
    diemTru: number;
    ngayViPham: Date;
}

interface AddViPhamModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: ViPhamData) => void;
    hocVienList?: { id: string; name: string }[];
}

const AddViPhamModal: React.FC<AddViPhamModalProps> = ({
    show,
    onHide,
    onSubmit,
    hocVienList = []
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ViPhamData>({
        defaultValues: {
            maHocVien: '',
            tenHocVien: '',
            loaiViPham: '',
            moTa: '',
            diemTru: 0,
            ngayViPham: new Date(),
        }
    });

    const viPhamTypes = [
        { value: 'Ngủ gác', diemTru: 10 },
        { value: 'Rời vị trí', diemTru: 8 },
        { value: 'Không mang VKTB', diemTru: 5 },
        { value: 'Trang phục không đúng', diemTru: 3 },
        { value: 'Đến trễ', diemTru: 2 },
        { value: 'Khác', diemTru: 1 },
    ];

    const handleFormSubmit: SubmitHandler<ViPhamData> = (data) => {
        onSubmit(data);
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-danger-transparent">
                <Modal.Title>
                    <i className="ti ti-alert-triangle me-2"></i>
                    Thêm Vi Phạm
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="ti ti-user me-1 text-primary"></i>
                            Học Viên Vi Phạm *
                        </Form.Label>
                        <Form.Select
                            isInvalid={!!errors.maHocVien}
                            {...register("maHocVien", { required: "Vui lòng chọn học viên" })}
                        >
                            <option value="">-- Chọn học viên --</option>
                            {hocVienList.map((hv) => (
                                <option key={hv.id} value={hv.id}>{hv.name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.maHocVien?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-category me-1 text-danger"></i>
                                    Loại Vi Phạm *
                                </Form.Label>
                                <Form.Select
                                    isInvalid={!!errors.loaiViPham}
                                    {...register("loaiViPham", { required: "Vui lòng chọn loại vi phạm" })}
                                >
                                    <option value="">-- Chọn loại --</option>
                                    {viPhamTypes.map((vp) => (
                                        <option key={vp.value} value={vp.value}>
                                            {vp.value} (-{vp.diemTru} điểm)
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-minus me-1 text-warning"></i>
                                    Điểm Trừ
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={20}
                                    {...register("diemTru", { valueAsNumber: true })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="ti ti-calendar me-1 text-info"></i>
                            Ngày Vi Phạm
                        </Form.Label>
                        <Form.Control
                            type="date"
                            {...register("ngayViPham")}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="ti ti-notes me-1 text-secondary"></i>
                            Mô Tả Chi Tiết
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Mô tả chi tiết vi phạm..."
                            {...register("moTa")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Hủy
                    </Button>
                    <Button variant="danger" type="submit">
                        <i className="ti ti-check me-1"></i>
                        Ghi Nhận Vi Phạm
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddViPhamModal;
