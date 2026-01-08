import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import { lichGacService, phanCongGacService, hocVienService, donViService } from '../../api/services';

// Stat card data interface
interface StatCard {
    id: string;
    title: string;
    value: number;
    icon: string;
    color: string;
    subtext: string;
}

// Quick action interface
interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: string;
    link: string;
    color: string;
}

const quickActions: QuickAction[] = [
    {
        id: '1',
        title: 'Quản Lý Lịch Gác',
        description: 'Tạo và quản lý lịch gác theo ngày',
        icon: 'ti ti-calendar-event',
        link: '/guard-management/lich-gac',
        color: 'primary'
    },
    {
        id: '2',
        title: 'Phân Công Gác',
        description: 'Phân công học viên vào các ca gác',
        icon: 'ti ti-users-group',
        link: '/guard-management/phan-cong',
        color: 'secondary'
    },
    {
        id: '3',
        title: 'Quản Lý Học Viên',
        description: 'Quản lý danh sách học viên',
        icon: 'ti ti-user',
        link: '/guard-management/hoc-vien',
        color: 'success'
    },
    {
        id: '4',
        title: 'Quản Lý VKTB',
        description: 'Quản lý vũ khí trang bị',
        icon: 'ti ti-shield',
        link: '/guard-management/vktb',
        color: 'warning'
    },
    {
        id: '5',
        title: 'Quản Lý Đơn Vị',
        description: 'Quản lý các đơn vị trong tiểu đoàn',
        icon: 'ti ti-building',
        link: '/guard-management/don-vi',
        color: 'info'
    },
    {
        id: '6',
        title: 'Quản Lý Cán Bộ',
        description: 'Quản lý danh sách cán bộ',
        icon: 'ti ti-id-badge-2',
        link: '/guard-management/can-bo',
        color: 'danger'
    },
    {
        id: '7',
        title: 'Kiểm Tra Gác',
        description: 'Theo dõi và kiểm tra công tác gác',
        icon: 'ti ti-clipboard-check',
        link: '/guard-management/kiem-tra',
        color: 'teal'
    }
];

const GuardDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalLichGac: 0,
        totalPhanCong: 0,
        totalHocVien: 0,
        totalDonVi: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [lichgacs, phancongs, hocviens, donvis] = await Promise.all([
                lichGacService.getAll(),
                phanCongGacService.getAll(),
                hocVienService.getAll(),
                donViService.getAll(),
            ]);

            setStats({
                totalLichGac: lichgacs?.length || 0,
                totalPhanCong: phancongs?.length || 0,
                totalHocVien: hocviens?.length || 0,
                totalDonVi: donvis?.length || 0,
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const statCards: StatCard[] = [
        {
            id: '1',
            title: 'Quân Số Hiện Tại',
            value: stats.totalHocVien,
            icon: 'ti ti-users',
            color: 'primary',
            subtext: 'Học viên'
        },
        {
            id: '2',
            title: 'Đang Gác',
            value: stats.totalPhanCong,
            icon: 'ti ti-shield-check',
            color: 'success',
            subtext: 'Ca hiện tại'
        },
        {
            id: '3',
            title: 'Cảnh Báo',
            value: 2,
            icon: 'ti ti-alert-triangle',
            color: 'warning',
            subtext: 'Cần xử lý'
        },
        {
            id: '4',
            title: 'Vi Phạm Tuần',
            value: 3,
            icon: 'ti ti-x-circle',
            color: 'danger',
            subtext: 'Trong tuần'
        }
    ];

    // Chart 1: Nghỉ Gác theo Đơn Vị (Bar Chart)
    const nghiGacChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'inherit',
        },
        colors: ['#5c67f7', '#26bf94', '#f7b731'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: ['Tiểu đội 1', 'Tiểu đội 2', 'Tiểu đội 3', 'Tiểu đội 4', 'Tiểu đội 5'],
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        yaxis: {
            title: { text: 'Số lượng', style: { color: 'var(--default-text-color)' } },
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        fill: { opacity: 1 },
        tooltip: { theme: 'dark' },
        legend: {
            labels: { colors: 'var(--default-text-color)' },
            position: 'top'
        },
        grid: { borderColor: 'rgba(0,0,0,0.1)' }
    };

    const nghiGacChartSeries = [
        { name: 'Nghỉ phép', data: [3, 2, 4, 1, 2] },
        { name: 'Đang ốm', data: [1, 1, 0, 2, 1] },
        { name: 'Công tác', data: [0, 1, 1, 0, 1] },
    ];

    // Chart 2: Vi Phạm theo Thời Gian (Line Chart)
    const viPhamChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            fontFamily: 'inherit',
        },
        colors: ['#f46a6a', '#f7b731'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        yaxis: {
            title: { text: 'Số vi phạm', style: { color: 'var(--default-text-color)' } },
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        tooltip: { theme: 'dark' },
        legend: {
            labels: { colors: 'var(--default-text-color)' },
            position: 'top'
        },
        grid: { borderColor: 'rgba(0,0,0,0.1)' },
        markers: { size: 4 }
    };

    const viPhamChartSeries = [
        { name: 'Vi phạm nặng', data: [1, 0, 2, 1, 0, 1, 0] },
        { name: 'Vi phạm nhẹ', data: [2, 1, 3, 2, 1, 2, 1] },
    ];

    // Chart 3: VKTB Mất theo Tháng (Bar Chart)
    const vktbChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'inherit',
        },
        colors: ['#f46a6a'],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '60%',
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Súng', 'Đạn', 'Lựu đạn', 'Dao găm', 'Áo giáp', 'Mũ sắt'],
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        yaxis: {
            labels: { style: { colors: 'var(--default-text-color)' } }
        },
        tooltip: { theme: 'dark' },
        grid: { borderColor: 'rgba(0,0,0,0.1)' }
    };

    const vktbChartSeries = [
        { name: 'Số lượng mất', data: [0, 2, 1, 0, 1, 0] },
    ];

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Dashboard Quản Lý Canh Gác" currentpage="Dashboard" />

            {/* Welcome Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="custom-card welcome-banner overflow-hidden">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="fw-semibold mb-2 text-fixed-white">
                                        Chào mừng đến Hệ Thống Quản Lý Canh Gác! 👋
                                    </h4>
                                    <p className="mb-0 text-fixed-white op-8">
                                        Quản lý lịch gác, phân công và theo dõi hoạt động canh gác của tiểu đoàn
                                    </p>
                                </div>
                                <div className="d-none d-lg-block">
                                    <span className="avatar avatar-xxl bg-white-transparent">
                                        <i className="ti ti-shield-check fs-1 text-fixed-white"></i>
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Stats Cards Section - 4 cards */}
            <Row className="mb-4">
                {statCards.map((stat) => (
                    <Col xl={3} lg={6} md={6} key={stat.id}>
                        <Card className="custom-card stat-card overflow-hidden">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="lh-1">
                                        <span className={`avatar avatar-lg avatar-rounded bg-${stat.color}`}>
                                            <i className={`${stat.icon} fs-4`}></i>
                                        </span>
                                    </div>
                                    <div className="flex-fill">
                                        <span className="d-block text-muted mb-1">{stat.title}</span>
                                        <h3 className={`fw-bold mb-0 text-${stat.color}`}>{stat.value}</h3>
                                        <small className="text-muted">{stat.subtext}</small>
                                    </div>
                                    <div className="stat-icon-bg">
                                        <i className={`${stat.icon}`}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Charts Section */}
            <Row className="mb-4">
                {/* Chart 1: Nghỉ Gác theo Đơn Vị */}
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ti ti-chart-bar me-2 text-primary"></i>
                                Nghỉ Gác Theo Đơn Vị
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ReactApexChart
                                options={nghiGacChartOptions}
                                series={nghiGacChartSeries}
                                type="bar"
                                height={300}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Chart 2: Vi Phạm theo Thời Gian */}
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ti ti-chart-line me-2 text-danger"></i>
                                Vi Phạm Trong Tuần
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ReactApexChart
                                options={viPhamChartOptions}
                                series={viPhamChartSeries}
                                type="line"
                                height={300}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                {/* Chart 3: VKTB Mất */}
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ti ti-shield-x me-2 text-warning"></i>
                                VKTB Thất Lạc/Hỏng
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ReactApexChart
                                options={vktbChartOptions}
                                series={vktbChartSeries}
                                type="bar"
                                height={250}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lịch Gác Tuần - Placeholder */}
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ti ti-calendar-week me-2 text-info"></i>
                                Lịch Gác Tuần Này
                            </div>
                            <Link to="/guard-management/lich-gac" className="btn btn-sm btn-primary-light">
                                Xem chi tiết
                            </Link>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <table className="table table-sm management-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Thứ</th>
                                            <th>Ca 1</th>
                                            <th>Ca 2</th>
                                            <th>Ca 3</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>T2</strong></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>T3</strong></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-warning-transparent">2 người</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>T4</strong></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>T5</strong></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                            <td><span className="badge bg-danger-transparent">1 người</span></td>
                                            <td><span className="badge bg-success-transparent">3 người</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ti ti-apps me-2"></i>
                                Chức Năng Chính
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                {quickActions.map((action) => (
                                    <Col xxl={3} xl={4} lg={6} md={6} key={action.id}>
                                        <Link to={action.link} className="text-decoration-none">
                                            <div className={`quick-action-card border border-${action.color} rounded-3 p-3 h-100 transition-all`}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="lh-1">
                                                        <span className={`avatar avatar-md avatar-rounded bg-${action.color}-transparent`}>
                                                            <i className={`${action.icon} fs-5 text-${action.color}`}></i>
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <h6 className="mb-1 fw-semibold">{action.title}</h6>
                                                        <p className="mb-0 text-muted fs-12">{action.description}</p>
                                                    </div>
                                                    <div>
                                                        <i className={`ti ti-chevron-right text-${action.color}`}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GuardDashboard;
