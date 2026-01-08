import React from 'react';
import { Card, Table } from 'react-bootstrap';
import type { LichGac } from '../../api/services';

interface WeeklyCalendarProps {
    lichGacs: LichGac[];
    currentWeekStart?: Date;
    onDateClick?: (date: Date) => void;
}

interface DayCell {
    date: Date;
    dayName: string;
    lichGac?: LichGac;
    isToday: boolean;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ lichGacs, currentWeekStart, onDateClick }) => {
    // Get current week's Monday
    const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
        return new Date(d.setDate(diff));
    };

    const weekStart = currentWeekStart || getWeekStart(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate week days
    const weekDays: DayCell[] = [];
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const lichGac = lichGacs.find(lg => {
            const lgDate = new Date(lg.ngaygac);
            lgDate.setHours(0, 0, 0, 0);
            return lgDate.getTime() === date.getTime();
        });

        weekDays.push({
            date,
            dayName: dayNames[i],
            lichGac,
            isToday: date.getTime() === today.getTime(),
        });
    }

    // Fake ca gác data for demonstration
    const caGacLabels = ['Ca 1 (06:00-12:00)', 'Ca 2 (12:00-18:00)', 'Ca 3 (18:00-06:00)'];

    return (
        <Card className="custom-card">
            <Card.Header className="card-header-actions">
                <div className="card-title-with-icon">
                    <i className="ti ti-calendar-week"></i>
                    <span>Lịch Gác Tuần</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">
                        {weekStart.toLocaleDateString('vi-VN')} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </Card.Header>
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <Table className="table-bordered mb-0">
                        <thead>
                            <tr className="text-center">
                                <th style={{ width: '150px' }} className="bg-light">Ca Gác</th>
                                {weekDays.map((day, idx) => (
                                    <th
                                        key={idx}
                                        className={`${day.isToday ? 'bg-primary text-white' : 'bg-light'}`}
                                        style={{ cursor: onDateClick ? 'pointer' : 'default' }}
                                        onClick={() => onDateClick?.(day.date)}
                                    >
                                        <div className="fw-bold">{day.dayName}</div>
                                        <div className="small">{day.date.getDate()}/{day.date.getMonth() + 1}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {caGacLabels.map((caLabel, caIdx) => (
                                <tr key={caIdx}>
                                    <td className="fw-medium text-muted small">{caLabel}</td>
                                    {weekDays.map((day, dayIdx) => (
                                        <td key={dayIdx} className="text-center p-2">
                                            {day.lichGac ? (
                                                <div className="d-flex flex-column gap-1">
                                                    <span className={`badge bg-${caIdx === 2 ? 'warning' : 'success'}-transparent`}>
                                                        3 người
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted small">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default WeeklyCalendar;
