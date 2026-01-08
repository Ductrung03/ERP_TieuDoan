import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermission } from '../../hooks/usePermission';
import userService, { type User, type CreateUserDto, type UpdateUserDto } from '../../api/services/user.service';
import roleService, { type Role } from '../../api/services/role.service';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<CreateUserDto>>({});
    const { canCreate, canUpdate, canDelete, isAdmin } = usePermission();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                userService.getAll(),
                roleService.getAll(),
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setFormData({ trangthai: 'Active' });
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            tendn: user.tendn,
            sdt: user.sdt,
            maquyen: user.maquyen,
            madonvi: user.madonvi,
            trangthai: user.trangthai,
        });
        setShowModal(true);
    };

    const handleDelete = async (user: User) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng "${user.tendn}"?`)) {
            try {
                await userService.delete(user.mataikhoan);
                toast.success('Xóa người dùng thành công');
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.trangthai === 'Active' ? 'Inactive' : 'Active';
        try {
            await userService.toggleStatus(user.mataikhoan, newStatus);
            toast.success(`Đã ${newStatus === 'Active' ? 'mở khóa' : 'khóa'} tài khoản`);
            loadData();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await userService.update(selectedUser.mataikhoan, formData as UpdateUserDto);
                toast.success('Cập nhật người dùng thành công');
            } else {
                await userService.create(formData as CreateUserDto);
                toast.success('Tạo người dùng mới thành công');
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải...</p>
            </div>
        );
    }

    return (
        <>
            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                    <div>
                        <h5 className="mb-0 fw-bold">
                            <i className="bi bi-people me-2 text-primary"></i>
                            Quản Lý Người Dùng
                        </h5>
                        <small className="text-muted">Tổng: {users.length} người dùng</small>
                    </div>
                    {canCreate('USER_MANAGEMENT', 'NGUOI_DUNG') && (
                        <Button variant="primary" onClick={handleCreate}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm người dùng
                        </Button>
                    )}
                </Card.Header>
                <Card.Body className="p-0">
                    <Table striped hover responsive className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Mã TK</th>
                                <th>Tên đăng nhập</th>
                                <th>Vai trò</th>
                                <th>Đơn vị</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Đăng nhập cuối</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.mataikhoan}>
                                    <td><code>{user.mataikhoan}</code></td>
                                    <td className="fw-semibold">{user.tendn}</td>
                                    <td>
                                        <Badge bg="info" text="dark">{user.tenquyen || user.maquyen}</Badge>
                                    </td>
                                    <td>{user.tendonvi || user.madonvi || '-'}</td>
                                    <td>{user.sdt || '-'}</td>
                                    <td>
                                        <Badge bg={user.trangthai === 'Active' ? 'success' : 'danger'}>
                                            {user.trangthai === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                                        </Badge>
                                    </td>
                                    <td className="small text-muted">
                                        {user.landangnhapcuoi ? new Date(user.landangnhapcuoi).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                                    </td>
                                    <td className="text-center">
                                        {canUpdate('USER_MANAGEMENT', 'NGUOI_DUNG') && (
                                            <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEdit(user)} title="Sửa">
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                        )}
                                        {isAdmin && (
                                            <Button
                                                variant={user.trangthai === 'Active' ? 'outline-secondary' : 'outline-success'}
                                                size="sm"
                                                className="me-1"
                                                onClick={() => handleToggleStatus(user)}
                                                title={user.trangthai === 'Active' ? 'Khóa' : 'Mở khóa'}
                                            >
                                                <i className={`bi ${user.trangthai === 'Active' ? 'bi-lock' : 'bi-unlock'}`}></i>
                                            </Button>
                                        )}
                                        {canDelete('USER_MANAGEMENT', 'NGUOI_DUNG') && (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user)} title="Xóa">
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center text-muted py-4">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tendn || ''}
                                onChange={(e) => setFormData({ ...formData, tendn: e.target.value })}
                                required
                                disabled={!!selectedUser}
                            />
                        </Form.Group>
                        {!selectedUser && (
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.matkhau || ''}
                                    onChange={(e) => setFormData({ ...formData, matkhau: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Vai trò <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.maquyen || ''}
                                onChange={(e) => setFormData({ ...formData, maquyen: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn vai trò --</option>
                                {roles.map((role) => (
                                    <option key={role.maquyen} value={role.maquyen}>{role.tenquyen}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formData.sdt || ''}
                                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                value={formData.trangthai || 'Active'}
                                onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
                            >
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Đã khóa</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className="bi bi-save me-2"></i>
                            {selectedUser ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UserList;
