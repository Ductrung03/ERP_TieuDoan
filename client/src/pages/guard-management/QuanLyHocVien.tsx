import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { hocVienService, type HocVien, type CreateHocVienDto } from '../../api/services';
import DeleteConfirmationModal from '../../shared/components/common/DeleteConfirmationModal';

const QuanLyHocVien: React.FC = () => {
    const [hocViens, setHocViens] = useState<HocVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateHocVienDto>();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await hocVienService.getAll();
            setHocViens(data);
        } catch (error) {
            console.error('Failed to load:', error);
            toast.error('Không thể tải danh sách học viên');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<CreateHocVienDto> = async (data) => {
        try {
            const payload = {
                ...data,
                ngaysinh: data.ngaysinh ? new Date(data.ngaysinh) : undefined
            };
            await hocVienService.create(payload);
            toast.success('Tạo học viên thành công!');
            setShowForm(false);
            loadData();
            reset();
        } catch (error) {
            console.error('Failed to create:', error);
            toast.error('Tạo học viên thất bại');
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            await hocVienService.delete(deleteId);
            toast.success('Xóa học viên thành công!');
            setShowDeleteModal(false);
            loadData();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            toast.error(error.response?.data?.error?.message || 'Xóa thất bại');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    // Filter data
    const filteredData = hocViens.filter(item =>
        item.hoten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sdt?.includes(searchTerm)
    );

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Quản Lý Học Viên" currentpage="Học Viên" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-users"></i>
                        <span>Quân Số Gác - Danh Sách Học Viên</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Thêm Học Viên'}
                        </Button>
                        <Button variant="success-light" size="sm">
                            <i className="ti ti-file-export me-1"></i>
                            Xuất Báo Cáo
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body>
                    {/* Toolbar */}
                    <div className="management-toolbar mb-3">
                        <InputGroup className="search-input">
                            <InputGroup.Text>
                                <i className="ti ti-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên hoặc SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="ms-auto d-flex align-items-center gap-2">
                            <span className="badge bg-primary-transparent">
                                <i className="ti ti-users me-1"></i>
                                Tổng: {filteredData.length} học viên
                            </span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-user-plus me-2"></i>
                                    Thêm Học Viên Mới
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-user me-1 text-primary"></i>
                                                    Họ Tên *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập họ tên..."
                                                    isInvalid={!!errors.hoten}
                                                    {...register("hoten", { required: "Họ tên là bắt buộc" })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.hoten?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-calendar me-1 text-info"></i>
                                                    Ngày Sinh
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    {...register("ngaysinh")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-phone me-1 text-success"></i>
                                                    Số Điện Thoại
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="0xxx..."
                                                    isInvalid={!!errors.sdt}
                                                    {...register("sdt", {
                                                        pattern: {
                                                            value: /^[0-9]{10,11}$/,
                                                            message: "Số điện thoại không hợp lệ (10-11 số)"
                                                        }
                                                    })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.sdt?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-mail me-1 text-warning"></i>
                                                    Email
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    isInvalid={!!errors.gmail}
                                                    {...register("gmail", {
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Email không hợp lệ"
                                                        }
                                                    })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.gmail?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-map-pin me-1 text-secondary"></i>
                                                    Địa Chỉ
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập địa chỉ..."
                                                    {...register("diachi")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Tạo Học Viên
                                        </Button>
                                        <Button type="button" variant="outline-secondary" onClick={() => setShowForm(false)}>
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Table */}
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="empty-state">
                            <i className="ti ti-users-off d-block"></i>
                            <h5>Chưa có học viên</h5>
                            <p>Nhấn "Thêm Học Viên" để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>STT</th>
                                        <th><i className="ti ti-user me-1"></i>Họ Tên</th>
                                        <th><i className="ti ti-calendar me-1"></i>Ngày Sinh</th>
                                        <th><i className="ti ti-phone me-1"></i>SĐT</th>
                                        <th><i className="ti ti-mail me-1"></i>Email</th>
                                        <th><i className="ti ti-map-pin me-1"></i>Địa Chỉ</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.mahocvien}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-primary-transparent rounded-circle">
                                                        <i className="ti ti-user"></i>
                                                    </span>
                                                    <span className="fw-medium">{item.hoten}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {item.ngaysinh ? (
                                                    <span className="badge bg-secondary-transparent">
                                                        {new Date(item.ngaysinh).toLocaleDateString('vi-VN')}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>{item.sdt || <span className="text-muted">-</span>}</td>
                                            <td>{item.gmail || <span className="text-muted">-</span>}</td>
                                            <td>{item.diachi || <span className="text-muted">-</span>}</td>
                                            <td>
                                                <div className="action-btn-group justify-content-center">
                                                    <Button
                                                        variant="info-light"
                                                        size="sm"
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Button>
                                                    <Button
                                                        variant="warning-light"
                                                        size="sm"
                                                        title="Sửa"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger-light"
                                                        size="sm"
                                                        title="Xóa"
                                                        onClick={() => handleDeleteClick(item.mahocvien)}
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <DeleteConfirmationModal
                show={showDeleteModal}
                title="Xóa Học Viên"
                content={`Bạn có chắc muốn xóa học viên này không? Hành động này không thể hoàn tác.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                loading={deleteLoading}
            />
        </div>
    );
};
export default QuanLyHocVien;
