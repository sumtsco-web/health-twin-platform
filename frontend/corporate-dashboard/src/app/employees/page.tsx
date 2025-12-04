'use client';

import { useState } from 'react';
import { Search, Filter, Download, AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react';
import EmployeeDetailModal from '@/components/modals/EmployeeDetailModal';

interface Employee {
    id: string;
    name: string;
    employeeCode: string;
    department: string;
    role: string;
    riskScore: number;
    riskLevel: 'green' | 'yellow' | 'orange' | 'red' | 'critical';
    fatigueScore: number;
    fitToWork: boolean;
    lastSync: string;
}

// Mock employee data
const mockEmployees: Employee[] = [
    {
        id: '1',
        name: 'Ahmed Al-Mansoori',
        employeeCode: 'EMP-1001',
        department: 'Drilling Operations',
        role: 'Senior Driller',
        riskScore: 72,
        riskLevel: 'red',
        fatigueScore: 68,
        fitToWork: false,
        lastSync: '2 min ago'
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        employeeCode: 'EMP-1002',
        department: 'Production',
        role: 'Production Engineer',
        riskScore: 35,
        riskLevel: 'yellow',
        fatigueScore: 42,
        fitToWork: true,
        lastSync: '5 min ago'
    },
    {
        id: '3',
        name: 'Mohammed Hassan',
        employeeCode: 'EMP-1003',
        department: 'Maintenance',
        role: 'Technician',
        riskScore: 18,
        riskLevel: 'green',
        fatigueScore: 22,
        fitToWork: true,
        lastSync: '1 min ago'
    },
    {
        id: '4',
        name: 'Emily Chen',
        employeeCode: 'EMP-1004',
        department: 'Safety & Compliance',
        role: 'Safety Officer',
        riskScore: 28,
        riskLevel: 'yellow',
        fatigueScore: 31,
        fitToWork: true,
        lastSync: '3 min ago'
    },
    {
        id: '5',
        name: 'Omar Abdullah',
        employeeCode: 'EMP-1005',
        department: 'Drilling Operations',
        role: 'Driller Assistant',
        riskScore: 85,
        riskLevel: 'critical',
        fatigueScore: 78,
        fitToWork: false,
        lastSync: '1 min ago'
    },
];

export default function EmployeesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterRisk, setFilterRisk] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'green': return 'bg-status-safe/20 text-status-safe border-status-safe/30';
            case 'yellow': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
            case 'orange': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
            case 'red': return 'bg-status-danger/20 text-status-danger border-status-danger/30';
            case 'critical': return 'bg-status-critical/20 text-status-critical border-status-critical/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const filteredEmployees = mockEmployees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
        const matchesRisk = filterRisk === 'all' || emp.riskLevel === filterRisk;
        return matchesSearch && matchesDepartment && matchesRisk;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Employee Health Monitor</h1>
                    <p className="text-gray-400">Real-time health status for all personnel</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl hover:bg-primary/80 transition-colors">
                    <Download size={20} />
                    <span>Export Report</span>
                </button>
            </div>

            {/* Filters */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">All Departments</option>
                        <option value="Drilling Operations">Drilling Operations</option>
                        <option value="Production">Production</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Safety & Compliance">Safety & Compliance</option>
                    </select>

                    {/* Risk Filter */}
                    <select
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                        className="px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">All Risk Levels</option>
                        <option value="green">Low Risk</option>
                        <option value="yellow">Moderate Risk</option>
                        <option value="red">High Risk</option>
                        <option value="critical">Critical Risk</option>
                    </select>
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="glass-panel rounded-2xl p-6 card-hover">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
                                    <User size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{employee.name}</h3>
                                    <p className="text-sm text-gray-400">{employee.employeeCode}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(employee.riskLevel)}`}>
                                {employee.riskLevel.toUpperCase()}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Department:</span>
                                <span className="text-white font-medium">{employee.department}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Role:</span>
                                <span className="text-white font-medium">{employee.role}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Risk Score:</span>
                                <span className="text-white font-bold">{employee.riskScore}/100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Fatigue:</span>
                                <span className="text-white font-bold">{employee.fatigueScore}/100</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                {employee.fitToWork ? (
                                    <>
                                        <CheckCircle size={20} className="text-status-safe" />
                                        <span className="text-sm text-status-safe font-medium">Fit to Work</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={20} className="text-status-critical" />
                                        <span className="text-sm text-status-critical font-medium">Not Fit</span>
                                    </>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">{employee.lastSync}</span>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredEmployees.length === 0 && (
                <div className="glass-panel rounded-2xl p-12 text-center">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-gray-500" />
                    <h3 className="text-xl font-bold text-white mb-2">No employees found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Employee Detail Modal */}
            <EmployeeDetailModal
                employee={selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
            />
        </div>
    );
}
