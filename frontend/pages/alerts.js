import React, { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
import DataTable from '../components/DataTable';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'DDoS Attack',
      severity: 'high',
      message: 'Detected potential DDoS attack from multiple IPs',
      timestamp: '2023-12-12T10:30:00Z',
      status: 'open',
      source: '192.168.1.100'
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      severity: 'medium',
      message: 'Unusual transaction pattern detected',
      timestamp: '2023-12-12T09:15:00Z',
      status: 'in_progress',
      source: '192.168.1.101'
    },
    {
      id: '3',
      type: 'Unauthorized Access',
      severity: 'high',
      message: 'Multiple failed login attempts',
      timestamp: '2023-12-12T08:45:00Z',
      status: 'resolved',
      source: '192.168.1.102'
    },
    {
      id: '4',
      type: 'Port Scan',
      severity: 'low',
      message: 'Port scanning detected from external IP',
      timestamp: '2023-12-12T08:30:00Z',
      status: 'open',
      source: '45.33.22.15'
    },
    {
      id: '5',
      type: 'Malware Detection',
      severity: 'high',
      message: 'Potential malware signature detected',
      timestamp: '2023-12-12T07:20:00Z',
      status: 'in_progress',
      source: '192.168.1.105'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Uncomment this useEffect when you have the backend API ready
  /*
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertsAPI.getAlerts();
        setAlerts(data);
      } catch (err) {
        setError(err.message || 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);
  */

  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      filterable: true,
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      filterable: true,
      cell: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.severity === 'high'
              ? 'bg-red-100 text-red-800'
              : row.severity === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      sortable: true,
      filterable: true,
    },
    {
      key: 'source',
      header: 'Source IP',
      sortable: true,
      filterable: true,
    },
    {
      key: 'timestamp',
      header: 'Date',
      sortable: true,
      cell: (row) => new Date(row.timestamp).toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      cell: (row) => {
        const statusConfig = {
          open: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' },
          in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
          resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
          closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
        };
        
        const config = statusConfig[row.status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: row.status };
        
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (row) => {
    // Handle row click, e.g., navigate to alert detail page
    console.log('Row clicked:', row);
    // You can add navigation logic here, for example:
    // router.push(`/alerts/${row.id}`);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Security Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage security alerts from your blockchain network.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={alerts}
        loading={loading}
        onRowClick={handleRowClick}
        emptyMessage="No alerts found. Your network is secure!"
      />
    </div>
  );
};

export default AlertsPage;
