import React from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface KiemTraDetail {
    ngay: Date;
    caGac: string;
    canBoKiemTra: string;
    noiDung: string;
    ketQua: string;
    ghiChu: string;
    danhSachViPham: {
        hocVien: string;
        loaiViPham: string;
        diemTru: number;
    }[];
}

interface KiemTraDetailModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: KiemTraDetail) => void;
    initialData?: Partial<KiemTraDetail>;
}

const KiemTraDetailModal: React.FC<KiemTraDetailModalProps> = ({
    show,
    onHide,
    onSubmit,
    initialData
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<KiemTraDetail>({
        defaultValues: initialData || {
            ngay: new Date(),
            caGac: '',
            canBoKiemTra: '',
            noiDung: '',
            ketQua: 'Đạt',
            ghiChu: '',
            danhSachViPham: [],
        }
    });

    const handleFormSubmit: SubmitHandler<KiemTraDetail> = (data) => {
        onSubmit(data);
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-info-transparent">
                <Modal.Title>
                    <i className="ti ti-clipboard-text me-2"></i>
                    Chi Tiết Phiếu Kiểm Tra
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-calendar me-1 text-primary"></i>
                                    Ngày Kiểm Tra *
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    isInvalid={!!errors.ngay}
                                    {...register("ngay", { required: "Ngày kiểm tra là bắt buộc" })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-clock me-1 text-warning"></i>
                                    Ca Gác
                                </Form.Label>
                                <Form.Select {...register("caGac")}>
                                    <option value="">-- Chọn ca --</option>
                                    <option value="Ca 1">Ca 1 (06:00 - 12:00)</option>
                                    <option value="Ca 2">Ca 2 (12:00 - 18:00)</option>
                                    <option value="Ca 3">Ca 3 (18:00 - 06:00)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-user-star me-1 text-info"></i>
                                    Cán Bộ Kiểm Tra
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Họ tên cán bộ"
                                    {...register("canBoKiemTra")}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="ti ti-file-text me-1 text-secondary"></i>
                            Nội Dung Kiểm Tra
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Mô tả nội dung đã kiểm tra..."
                            {...register("noiDung")}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-circle-check me-1 text-success"></i>
                                    Kết Quả
                                </Form.Label>
                                <Form.Select {...register("ketQua")}>
                                    <option value="Đạt">Đạt</option>
                                    <option value="Không đạt">Không đạt</option>
                                    <option value="Vi phạm nhẹ">Vi phạm nhẹ</option>
                                    <option value="Vi phạm nặng">Vi phạm nặng</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="ti ti-notes me-1"></i>
                                    Ghi Chú
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ghi chú thêm..."
                                    {...register("ghiChu")}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Violations List */}
                    <div className="border rounded p-3 mb-3">
                        <h6 className="mb-3">
                            <i className="ti ti-alert-triangle me-2 text-danger"></i>
                            Danh Sách Vi Phạm
                        </h6>
                        <Table size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>Học Viên</th>
                                    <th>Loại Vi Phạm</th>
                                    <th>Điểm Trừ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-3">
                                        <i className="ti ti-check-circle me-1"></i>
                                        Không có vi phạm
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button variant="outline-danger" size="sm" className="mt-2">
                            <i className="ti ti-plus me-1"></i>
                            Thêm Vi Phạm
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Hủy
                    </Button>
                    <Button variant="info" type="submit">
                        <i className="ti ti-check me-1"></i>
                        Lưu Phiếu
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default KiemTraDetailModal;
