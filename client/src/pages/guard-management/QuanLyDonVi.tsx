import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { donViService, type DonVi, type CreateDonViDto } from '../../api/services';

const QuanLyDonVi: React.FC = () => {
    const [donVis, setDonVis] = useState<DonVi[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<CreateDonViDto> = async (data) => {
        try {
            const payload = {
                ...data,
                tongquanso: Number(data.tongquanso)
            };
            await donViService.create(payload);
            toast.success('Tạo đơn vị thành công!');
            setShowForm(false);
            loadData();
            reset();
        } catch (error) {
            console.error('Failed to create:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await donViService.delete(id);
            toast.success('Xóa thành công!');
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
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
                        <Button variant="info-light" size="sm">
                            <i className="ti ti-calendar-plus me-1"></i>
                            Thêm Lịch Cho ĐV
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
                                    <i className="ti ti-building-plus me-2"></i>
                                    Thêm Đơn Vị Mới
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
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-users me-1 text-success"></i>
                                                    Tổng Quân Số
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="0"
                                                    {...register("tongquanso", { valueAsNumber: true })}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-hierarchy me-1 text-warning"></i>
                                                    Đơn Vị Cấp Trên
                                                </Form.Label>
                                                <Form.Select {...register("madonvitren")}>
                                                    <option value="">-- Không có --</option>
                                                    {donVis.map((dv) => (
                                                        <option key={dv.madonvi} value={dv.madonvi}>
                                                            {dv.tendonvi}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Tạo Đơn Vị
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
                                        <th><i className="ti ti-user-check me-1"></i>Có Mặt</th>
                                        <th><i className="ti ti-circle-check me-1"></i>Trạng Thái</th>
                                        <th><i className="ti ti-refresh me-1"></i>Vòng Gác</th>
                                        <th><i className="ti ti-clock me-1"></i>Thời Gian</th>
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
                                                <span className="badge bg-success-transparent">{item.tongquanso || 0}</span>
                                            </td>
                                            <td>
                                                <span className="status-badge dam-bao">
                                                    <i className="ti ti-check me-1"></i>
                                                    Sẵn sàng
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-info-transparent">Vòng 1</span>
                                            </td>
                                            <td>
                                                <span className="text-muted">06:00 - 18:00</span>
                                            </td>
                                            <td>
                                                <span className="text-muted">-</span>
                                            </td>
                                            <td>
                                                <div className="action-btn-group justify-content-center">
                                                    <Button variant="info-light" size="sm" title="Xem chi tiết">
                                                        <i className="ti ti-eye"></i>
                                                    </Button>
                                                    <Button variant="warning-light" size="sm" title="Sửa">
                                                        <i className="ti ti-edit"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger-light"
                                                        size="sm"
                                                        title="Xóa"
                                                        onClick={() => handleDelete(item.madonvi)}
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
        </div>
    );
};

export default QuanLyDonVi;
