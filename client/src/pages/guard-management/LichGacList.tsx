import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { lichGacService, type LichGac, type CreateLichGacDto } from '../../api/services';
import WeeklyCalendar from '../../components/guard-management/WeeklyCalendar';

const LichGacList: React.FC = () => {
    const [lichGacs, setLichGacs] = useState<LichGac[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateLichGacDto>({
        defaultValues: {
            ngaygac: new Date(),
            ghichu: '',
            matkhauhoi: '',
            matkhaudap: '',
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await lichGacService.getAll();
            setLichGacs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load:', error);
            setLichGacs([]);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<CreateLichGacDto> = async (data) => {
        try {
            const payload = {
                ...data,
                ngaygac: data.ngaygac ? new Date(data.ngaygac) : new Date()
            };
            await lichGacService.create(payload);
            toast.success('Tạo lịch gác thành công!');
            setShowForm(false);
            loadData();
            reset();
            setValue('ngaygac', new Date());
        } catch (error) {
            console.error('Failed to create:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await lichGacService.delete(id);
            toast.success('Xóa thành công!');
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    // Filter data based on search
    const filteredData = lichGacs.filter(item =>
        item.ghichu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matkhauhoi?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Quản Lý Lịch Gác" currentpage="Lịch Gác" />

            {/* Weekly Calendar View */}
            <Row className="mb-4">
                <Col xl={12}>
                    <WeeklyCalendar lichGacs={lichGacs} />
                </Col>
            </Row>

            {/* Main Card */}
            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-calendar-event"></i>
                        <span>Danh Sách Lịch Gác</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Thêm Lịch Gác'}
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
                                placeholder="Tìm kiếm nhanh..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="date-filter ms-auto">
                            <i className="ti ti-calendar"></i>
                            <span>Trong 30 ngày</span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-plus me-2"></i>
                                    Tạo Lịch Gác Mới
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-calendar-event me-1 text-primary"></i>
                                                    Ngày Gác *
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    isInvalid={!!errors.ngaygac}
                                                    {...register("ngaygac", { required: "Ngày gác là bắt buộc" })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.ngaygac?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-notes me-1 text-primary"></i>
                                                    Ghi Chú
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập ghi chú..."
                                                    {...register("ghichu")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-key me-1 text-warning"></i>
                                                    Mật Khẩu Hỏi
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập mật khẩu hỏi..."
                                                    {...register("matkhauhoi")}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-key me-1 text-success"></i>
                                                    Mật Khẩu Đáp
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập mật khẩu đáp..."
                                                    {...register("matkhaudap")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Tạo Lịch Gác
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
                            <i className="ti ti-calendar-off d-block"></i>
                            <h5>Chưa có dữ liệu</h5>
                            <p>Nhấn "Thêm Lịch Gác" để tạo mới</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>Mã Lịch</th>
                                        <th><i className="ti ti-calendar me-1"></i>Ngày Gác</th>
                                        <th><i className="ti ti-key me-1"></i>Mật Khẩu Hỏi</th>
                                        <th><i className="ti ti-key me-1"></i>Mật Khẩu Đáp</th>
                                        <th><i className="ti ti-notes me-1"></i>Ghi Chú</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item.malichgac}>
                                            <td>
                                                <code className="text-primary">{item.malichgac.substring(0, 8)}...</code>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-transparent">
                                                    <i className="ti ti-calendar me-1"></i>
                                                    {new Date(item.ngaygac).toLocaleDateString('vi-VN')}
                                                </span>
                                            </td>
                                            <td>{item.matkhauhoi || <span className="text-muted">-</span>}</td>
                                            <td>{item.matkhaudap || <span className="text-muted">-</span>}</td>
                                            <td>{item.ghichu || <span className="text-muted">Không có ghi chú</span>}</td>
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
                                                        onClick={() => handleDelete(item.malichgac)}
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

export default LichGacList;
