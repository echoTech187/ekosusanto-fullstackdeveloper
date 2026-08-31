import React from 'react';
import { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED':
        return { label: 'Applied', className: 'status-applied' };
      case 'REVIEWING':
        return { label: 'Reviewing', className: 'status-reviewing' };
      case 'SHORTLISTED':
        return { label: 'Shortlisted', className: 'status-shortlisted' };
      case 'REJECTED':
        return { label: 'Rejected', className: 'status-rejected' };
      case 'ACCEPTED':
        return { label: 'Accepted', className: 'status-accepted' };
      default:
        return { label: status, className: 'status-applied' };
    }
  };

  const config = getStatusConfig(status);

  return <span className={`badge ${config.className}`}>{config.label}</span>;
};
