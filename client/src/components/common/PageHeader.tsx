import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumb?: { label: string; path?: string }[];
    actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumb, actions }) => {
    return (
        <div className="page-header mb-4">
            <Row className="align-items-center">
                <Col>
                    <h1 className="page-title mb-1">{title}</h1>
                    {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
                    {breadcrumb && (
                        <nav>
                            <ol className="breadcrumb mb-0">
                                {breadcrumb.map((item, index) => (
                                    <li key={index} className={`breadcrumb-item ${!item.path ? 'active' : ''}`}>
                                        {item.path ? <a href={item.path}>{item.label}</a> : item.label}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}
                </Col>
                {actions && <Col xs="auto">{actions}</Col>}
            </Row>
        </div>
    );
};

export default PageHeader;
