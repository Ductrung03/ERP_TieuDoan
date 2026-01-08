import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { vktbService, type VKTB } from '../../api/services';

const QuanLyVKTB: React.FC = () => {
    const [vktbs, setVktbs] = useState<VKTB[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<VKTB>({
        defaultValues: {
            tenvktb: '',
            donvitinh: '',
            tinhtrang: 'Tốt',
            ghichu: '',
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await vktbService.getAll();
            setVktbs(data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<VKTB> = async (data) => {
        try {
            await vktbService.create(data);
            toast.success('Tạo VKTB thành công!');
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
            await vktbService.delete(id);
            toast.success('Xóa thành công!');
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    // Filter data
    const filteredData = vktbs.filter(item =>
        item.tenvktb?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by status for summary
    const statusCounts = {
        tot: filteredData.filter(v => v.tinhtrang === 'Tốt').length,
        hong: filteredData.filter(v => v.tinhtrang === 'Hỏng').length,
        thieu: filteredData.filter(v => v.tinhtrang === 'Cần sửa chữa').length,
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Tốt': return 'tot';
            case 'Hỏng': return 'hong';
            case 'Cần sửa chữa': return 'thieu';
            default: return 'pending';
        }
    };

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Quản Lý VKTB" currentpage="VKTB" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-shield"></i>
                        <span>VKTB Gác - Vũ Khí Trang Bị</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Thêm VKTB'}
                        </Button>
                        <Button variant="warning-light" size="sm">
                            <i className="ti ti-printer me-1"></i>
                            In Biên Bản
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
                                placeholder="Tìm theo tên VKTB..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="ms-auto d-flex align-items-center gap-2">
                            <span className="badge bg-success-transparent">
                                <i className="ti ti-check me-1"></i>
                                Tốt: {statusCounts.tot}
                            </span>
                            <span className="badge bg-danger-transparent">
                                <i className="ti ti-x me-1"></i>
                                Hỏng: {statusCounts.hong}
                            </span>
                            <span className="badge bg-warning-transparent">
                                <i className="ti ti-alert-triangle me-1"></i>
                                Cần sửa: {statusCounts.thieu}
                            </span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-shield-plus me-2"></i>
                                    Thêm VKTB Mới
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
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
                                            rows={2}
                                            placeholder="Nhập ghi chú..."
                                            {...register("ghichu")}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Tạo VKTB
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
                            <i className="ti ti-shield-off d-block"></i>
                            <h5>Chưa có VKTB</h5>
                            <p>Nhấn "Thêm VKTB" để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>STT</th>
                                        <th><i className="ti ti-shield me-1"></i>Tên VKTB</th>
                                        <th><i className="ti ti-ruler me-1"></i>ĐVT</th>
                                        <th><i className="ti ti-circle-check me-1"></i>Tình Trạng</th>
                                        <th><i className="ti ti-check me-1"></i>Khớp</th>
                                        <th><i className="ti ti-notes me-1"></i>Ghi Chú</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.mavktb}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-warning-transparent rounded">
                                                        <i className="ti ti-shield"></i>
                                                    </span>
                                                    <span className="fw-medium">{item.tenvktb}</span>
                                                </div>
                                            </td>
                                            <td>{item.donvitinh || '-'}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(item.tinhtrang || '')}`}>
                                                    {item.tinhtrang}
                                                </span>
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    defaultChecked={item.tinhtrang === 'Tốt'}
                                                    className="text-success"
                                                />
                                            </td>
                                            <td>{item.ghichu || <span className="text-muted">-</span>}</td>
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
                                                        onClick={() => handleDelete(item.mavktb)}
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

export default QuanLyVKTB;
