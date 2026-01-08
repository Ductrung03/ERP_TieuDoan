import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { donViService, type DonVi, type CreateDonViDto } from '../../api/services';
import DeleteConfirmationModal from '../../shared/components/common/DeleteConfirmationModal';

const QuanLyDonVi: React.FC = () => {
    const [donVis, setDonVis] = useState<DonVi[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Edit & View State
    const [editingUnit, setEditingUnit] = useState<DonVi | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<DonVi | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateDonViDto>();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await donViService.getAll();
            setDonVis(data);
        } catch (error) {
            console.error('Failed to load:', error);
            toast.error('Không thể tải danh sách đơn vị');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<CreateDonViDto> = async (data) => {
        try {
            const payload = {
                ...data,
                tongquanso: 0 // Auto-calculated by backend/DB
            };

            if (editingUnit) {
                await donViService.update(editingUnit.madonvi, payload);
                toast.success('Cập nhật đơn vị thành công!');
            } else {
                await donViService.create(payload);
                toast.success('Tạo đơn vị thành công!');
            }

            handleCloseForm();
            loadData();
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error(editingUnit ? 'Cập nhật thất bại' : 'Tạo đơn vị thất bại');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingUnit(null);
        reset({ tendonvi: '', kyhieu: '', madonvitren: '' });
    };

    const handleEditClick = (unit: DonVi) => {
        setEditingUnit(unit);
        reset({
            tendonvi: unit.tendonvi,
            kyhieu: unit.kyhieu,
            madonvitren: unit.madonvitren || ''
        });
        setShowForm(true);
    };

    const handleViewClick = (unit: DonVi) => {
        setSelectedUnit(unit);
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
            await donViService.delete(deleteId);
            toast.success('Xóa đơn vị thành công!');
            setShowDeleteModal(false);
            loadData();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            console.log('Error Response Data:', error.response?.data);

            const errorMessage = error.response?.data?.error?.message
                || error.response?.data?.message
                || 'Không thể xóa đơn vị. Vui lòng thử lại sau.';

            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    // Filter data
    const filteredData = donVis.filter(item =>
        item.tendonvi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kyhieu?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate totals
    const totalQuanSo = filteredData.reduce((sum, d) => sum + (d.tongquanso || 0), 0);

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Quản Lý Đơn Vị" currentpage="Đơn Vị" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-building"></i>
                        <span>Quản Lý Đơn Vị</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Thêm Đơn Vị'}
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
                                placeholder="Tìm theo tên hoặc ký hiệu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <span className="badge bg-primary-transparent">
                                <i className="ti ti-building me-1"></i>
                                {filteredData.length} đơn vị
                            </span>
                            <span className="badge bg-success-transparent">
                                <i className="ti ti-users me-1"></i>
                                Tổng quân số: {totalQuanSo}
                            </span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className={`ti ${editingUnit ? 'ti-edit' : 'ti-building-plus'} me-2`}></i>
                                    {editingUnit ? 'Cập Nhật Đơn Vị' : 'Thêm Đơn Vị Mới'}
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-building me-1 text-primary"></i>
                                                    Tên Đơn Vị *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="VD: Tiểu đội 1"
                                                    isInvalid={!!errors.tendonvi}
                                                    {...register("tendonvi", { required: "Tên đơn vị là bắt buộc" })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tendonvi?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-tag me-1 text-info"></i>
                                                    Ký Hiệu
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="VD: TD1"
                                                    {...register("kyhieu")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            {editingUnit ? 'Lưu Thay Đổi' : 'Tạo Đơn Vị'}
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
                            <i className="ti ti-building-off d-block"></i>
                            <h5>Chưa có đơn vị</h5>
                            <p>Nhấn "Thêm Đơn Vị" để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>STT</th>
                                        <th><i className="ti ti-building me-1"></i>Tên Đơn Vị</th>
                                        <th><i className="ti ti-users me-1"></i>Quân Số</th>
                                        <th><i className="ti ti-circle-check me-1"></i>Trạng Thái</th>
                                        <th><i className="ti ti-notes me-1"></i>Ghi Chú</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.madonvi}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-primary-transparent rounded">
                                                        <i className="ti ti-building"></i>
                                                    </span>
                                                    <div>
                                                        <span className="fw-medium">{item.tendonvi}</span>
                                                        {item.kyhieu && (
                                                            <div className="text-muted small">{item.kyhieu}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-transparent">{item.tongquanso || 0}</span>
                                            </td>
                                            <td>
                                                <span className="status-badge dam-bao">
                                                    <i className="ti ti-check me-1"></i>
                                                    Sẵn sàng
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">-</span>
                                            </td>
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
                                                        onClick={() => handleDeleteClick(item.madonvi)}
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
                title="Xóa Đơn Vị"
                content={`Bạn có chắc muốn xóa đơn vị này không? Hành động này không thể hoàn tác.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                loading={deleteLoading}
            />

            {/* View Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton className="bg-primary-transparent">
                    <Modal.Title>
                        <i className="ti ti-info-circle me-2 text-primary"></i>
                        Chi Tiết Đơn Vị
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUnit && (
                        <div className="p-2">
                            <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted">Tên Đơn Vị:</span>
                                <span className="fw-bold text-primary">{selectedUnit.tendonvi}</span>
                            </div>
                            <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted">Ký Hiệu:</span>
                                <span className="fw-bold">{selectedUnit.kyhieu || '-'}</span>
                            </div>
                            <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted">Tổng Quân Số:</span>
                                <span className="badge bg-success-transparent fs-13">
                                    {selectedUnit.tongquanso || 0} học viên
                                </span>
                            </div>
                            <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted">Mã Đơn Vị:</span>
                                <code>{selectedUnit.madonvi}</code>
                            </div>
                            <div className="mb-0 d-flex justify-content-between">
                                <span className="text-muted">Trạng Thái:</span>
                                <span className="status-badge dam-bao">
                                    <i className="ti ti-check me-1"></i> Sẵn sàng
                                </span>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowDetailModal(false);
                            if (selectedUnit) handleEditClick(selectedUnit);
                        }}
                    >
                        <i className="ti ti-edit me-1"></i> Chỉnh Sửa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default QuanLyDonVi;
