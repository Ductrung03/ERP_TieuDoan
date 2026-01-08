import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { canBoService, donViService, type CanBo, type DonVi, type CreateCanBoDto } from '../../api/services';

const QuanLyCanBo: React.FC = () => {
    const [canBos, setCanBos] = useState<CanBo[]>([]);
    const [donVis, setDonVis] = useState<DonVi[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCanBoDto>({
        defaultValues: {
            hoten: '',
            ngaysinh: undefined,
            diachi: '',
            sdt: '',
            gmail: '',
            madonvi: '',
        }
    });

    useEffect(() => {
        loadData();
        loadDonVis();
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

    const onSubmit: SubmitHandler<CreateCanBoDto> = async (data) => {
        try {
            const payload = {
                ...data,
                ngaysinh: data.ngaysinh ? new Date(data.ngaysinh) : undefined,
                thoigianden: data.thoigianden ? new Date(data.thoigianden) : new Date()
            };
            await canBoService.create(payload);
            toast.success('Tạo cán bộ thành công!');
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
            await canBoService.delete(id);
            toast.success('Xóa thành công!');
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
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
                                <i className="ti ti-user-star me-1"></i>
                                Tổng: {filteredData.length} cán bộ
                            </span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-user-plus me-2"></i>
                                    Thêm Cán Bộ Mới
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
                                                    <i className="ti ti-building me-1 text-warning"></i>
                                                    Đơn Vị
                                                </Form.Label>
                                                <Form.Select {...register("madonvi")}>
                                                    <option value="">-- Chọn đơn vị --</option>
                                                    {donVis.map((dv) => (
                                                        <option key={dv.madonvi} value={dv.madonvi}>
                                                            {dv.tendonvi}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
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
                                            Tạo Cán Bộ
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
                                        <th><i className="ti ti-building me-1"></i>Đơn Vị</th>
                                        <th><i className="ti ti-phone me-1"></i>SĐT</th>
                                        <th><i className="ti ti-mail me-1"></i>Email</th>
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
                                                {donVis.find(d => d.madonvi === item.madonvi)?.tendonvi || (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>{item.sdt || <span className="text-muted">-</span>}</td>
                                            <td>{item.gmail || <span className="text-muted">-</span>}</td>
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
                                                        onClick={() => handleDelete(item.macanbo)}
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

export default QuanLyCanBo;
