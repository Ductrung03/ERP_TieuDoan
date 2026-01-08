import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import {
    canBoService,
    donViService,
    quanHamService,
    chucVuService,
    type CanBo,
    type DonVi,
    type CreateCanBoDto,
    type QuanHam,
    type ChucVu
} from '../../api/services';
import DeleteConfirmationModal from '../../shared/components/common/DeleteConfirmationModal';

const QuanLyCanBo: React.FC = () => {
    const [canBos, setCanBos] = useState<CanBo[]>([]);
    const [donVis, setDonVis] = useState<DonVi[]>([]);
    const [quanHams, setQuanHams] = useState<QuanHam[]>([]);
    const [chucVus, setChucVus] = useState<ChucVu[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Edit & View State
    const [editingCanBo, setEditingCanBo] = useState<CanBo | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCanBo, setSelectedCanBo] = useState<CanBo | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCanBoDto>({
        defaultValues: {
            hoten: '',
            ngaysinh: undefined,
            diachi: '',
            sdt: '',
            gmail: '',
            madonvi: '',
            machucvu: '',
            maquanham: ''
        }
    });

    useEffect(() => {
        loadData();
        loadDonVis();
        loadQuanHams();
        loadChucVus();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await canBoService.getAll();
            setCanBos(data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDonVis = async () => {
        try {
            const data = await donViService.getAll();
            setDonVis(data);
        } catch (error) {
            console.error('Failed to load units:', error);
        }
    };

    const loadQuanHams = async () => {
        try {
            const data = await quanHamService.getAll();
            setQuanHams(data);
        } catch (error) {
            console.error('Failed to load ranks:', error);
        }
    };

    const loadChucVus = async () => {
        try {
            const data = await chucVuService.getAll();
            setChucVus(data);
        } catch (error) {
            console.error('Failed to load positions:', error);
        }
    };

    const onSubmit: SubmitHandler<CreateCanBoDto> = async (data) => {
        try {
            const payload = {
                ...data,
                ngaysinh: data.ngaysinh ? new Date(data.ngaysinh) : undefined,
                thoigianden: data.thoigianden ? new Date(data.thoigianden) : new Date(),
                madonvi: data.madonvi || undefined
            };

            if (editingCanBo) {
                await canBoService.update(editingCanBo.macanbo, payload);
                toast.success('Cập nhật cán bộ thành công!');
            } else {
                await canBoService.create(payload);
                toast.success('Tạo cán bộ thành công!');
            }

            handleCloseForm();
            loadData();
        } catch (error: any) {
            console.error('Failed to save:', error);
            toast.error(error.response?.data?.message || 'Lưu thất bại');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCanBo(null);
        reset({
            hoten: '',
            ngaysinh: undefined,
            diachi: '',
            sdt: '',
            gmail: '',
            madonvi: '',
            machucvu: '',
            maquanham: ''
        });
    };

    const handleEditClick = (item: CanBo) => {
        setEditingCanBo(item);
        // Format date for input type="date"
        const formatDate = (dateString?: string | Date) => {
            if (!dateString) return undefined;
            return new Date(dateString).toISOString().split('T')[0];
        };

        reset({
            hoten: item.hoten,
            ngaysinh: formatDate(item.ngaysinh) as any,
            diachi: item.diachi,
            sdt: item.sdt,
            gmail: item.gmail,
            madonvi: item.madonvi || '',
            machucvu: item.machucvu || '',
            maquanham: item.maquanham || ''
        });
        setShowForm(true);
    };

    const handleViewClick = (item: CanBo) => {
        setSelectedCanBo(item);
        setShowDetailModal(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            await canBoService.delete(deleteId);
            toast.success('Xóa cán bộ thành công!');
            setShowDeleteModal(false);
            loadData();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            toast.error(error.response?.data?.message || error.response?.data?.error?.message || 'Xóa thất bại');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    // Filter data
    const filteredData = canBos.filter(item =>
        item.hoten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sdt?.includes(searchTerm)
    );

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Quản Lý Cán Bộ" currentpage="Cán Bộ" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-user-star"></i>
                        <span>Quản Lý Cán Bộ</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Thêm Cán Bộ'}
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
                                <i className="ti ti-user-star me-1"></i>
                                Tổng: {filteredData.length} cán bộ
                            </span>
                        </div>
                    </div>

                    {/* Create/Edit Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className={`ti ${editingCanBo ? 'ti-edit' : 'ti-user-plus'} me-2`}></i>
                                    {editingCanBo ? 'Cập Nhật Thông Tin Cán Bộ' : 'Thêm Cán Bộ Mới'}
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={4}>
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
                                        <Col md={4}>
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
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-building me-1 text-warning"></i>
                                                    Đơn Vị
                                                </Form.Label>
                                                <Form.Select {...register("madonvi")}>
                                                    <option value="">-- Không chọn --</option>
                                                    {donVis.map((dv) => (
                                                        <option key={dv.madonvi} value={dv.madonvi}>
                                                            {dv.tendonvi}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-medal me-1 text-danger"></i>
                                                    Quân Hàm *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.maquanham}
                                                    {...register("maquanham", { required: "Vui lòng chọn quân hàm" })}
                                                >
                                                    <option value="">-- Chọn Quân Hàm --</option>
                                                    {quanHams.map((qh) => (
                                                        <option key={qh.maquanham} value={qh.maquanham}>
                                                            {qh.tenquanham}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.maquanham?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-briefcase me-1 text-success"></i>
                                                    Chức Vụ *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.machucvu}
                                                    {...register("machucvu", { required: "Vui lòng chọn chức vụ" })}
                                                >
                                                    <option value="">-- Chọn Chức Vụ --</option>
                                                    {chucVus.map((cv) => (
                                                        <option key={cv.machucvu} value={cv.machucvu}>
                                                            {cv.tenchucvu}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.machucvu?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
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
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-mail me-1 text-danger"></i>
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
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            {editingCanBo ? 'Cập Nhật' : 'Tạo Cán Bộ'}
                                        </Button>
                                        <Button type="button" variant="outline-secondary" onClick={handleCloseForm}>
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
                            <i className="ti ti-user-off d-block"></i>
                            <h5>Chưa có cán bộ</h5>
                            <p>Nhấn "Thêm Cán Bộ" để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>STT</th>
                                        <th><i className="ti ti-user me-1"></i>Họ Tên</th>
                                        <th><i className="ti ti-medal me-1"></i>Quân hàm</th>
                                        <th><i className="ti ti-briefcase me-1"></i>Chức vụ</th>
                                        <th><i className="ti ti-building me-1"></i>Đơn Vị</th>
                                        <th><i className="ti ti-phone me-1"></i>SĐT</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.macanbo}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-info-transparent rounded-circle">
                                                        <i className="ti ti-user-star"></i>
                                                    </span>
                                                    <span className="fw-medium">{item.hoten}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {item.tenquanham ? (
                                                    <span className="badge bg-danger-transparent">{item.tenquanham}</span>
                                                ) : <span className="text-muted">-</span>}
                                            </td>
                                            <td>
                                                {item.tenchucvu ? (
                                                    <span className="badge bg-success-transparent">{item.tenchucvu}</span>
                                                ) : <span className="text-muted">-</span>}
                                            </td>
                                            <td>
                                                {donVis.find(d => d.madonvi === item.madonvi)?.tendonvi || (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>{item.sdt || <span className="text-muted">-</span>}</td>
                                            <td>
                                                <div className="action-btn-group justify-content-center">
                                                    <Button
                                                        variant="info-light"
                                                        size="sm"
                                                        title="Xem chi tiết"
                                                        onClick={() => handleViewClick(item)}
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Button>
                                                    <Button
                                                        variant="warning-light"
                                                        size="sm"
                                                        title="Sửa"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger-light"
                                                        size="sm"
                                                        title="Xóa"
                                                        onClick={() => handleDeleteClick(item.macanbo)}
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
                title="Xóa Cán Bộ"
                content={`Bạn có chắc muốn xóa cán bộ này không? Hành động này không thể hoàn tác.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                loading={deleteLoading}
            />
            {/* View Detail Modal - Using React Bootstrap Modal directly if not creating separate component yet */}
            {selectedCanBo && (
                <div className={`modal fade ${showDetailModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary-transparent">
                                <h5 className="modal-title text-primary">
                                    <i className="ti ti-user-circle me-2"></i>
                                    Chi Tiết Cán Bộ
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-4">
                                    <div className="avatar avatar-xxl bg-info-transparent rounded-circle mb-2">
                                        <i className="ti ti-user text-info fs-1"></i>
                                    </div>
                                    <h5 className="fw-bold mb-1">{selectedCanBo.hoten}</h5>
                                    <p className="text-muted mb-0">{selectedCanBo.tenquanham} - {selectedCanBo.tenchucvu}</p>
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light">
                                            <small className="text-muted d-block mb-1">Ngày sinh</small>
                                            <span className="fw-medium">
                                                {selectedCanBo.ngaysinh ? new Date(selectedCanBo.ngaysinh).toLocaleDateString('vi-VN') : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light">
                                            <small className="text-muted d-block mb-1">Đơn vị</small>
                                            <span className="fw-medium">
                                                {donVis.find(d => d.madonvi === selectedCanBo.madonvi)?.tendonvi || '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light">
                                            <small className="text-muted d-block mb-1">Số điện thoại</small>
                                            <span className="fw-medium">{selectedCanBo.sdt || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light">
                                            <small className="text-muted d-block mb-1">Email</small>
                                            <span className="fw-medium">{selectedCanBo.gmail || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="p-3 border rounded bg-light">
                                            <small className="text-muted d-block mb-1">Địa chỉ</small>
                                            <span className="fw-medium">{selectedCanBo.diachi || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Đóng</Button>
                                <Button variant="primary" onClick={() => {
                                    setShowDetailModal(false);
                                    handleEditClick(selectedCanBo);
                                }}>
                                    <i className="ti ti-edit me-1"></i> Chỉnh sửa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyCanBo;
