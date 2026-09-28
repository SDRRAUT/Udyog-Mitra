'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  Lock,
  Building2,
  Mail,
  Phone,
  MoreVertical,
  Filter
} from 'lucide-react';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      name: 'Dr. Suresh Deshmukh',
      email: 'suresh.deshmukh@mpcb.gov.in',
      phone: '+91 98220 11223',
      role: 'DEPT_OFFICER',
      department: 'MPCB',
      district: 'Pune',
      status: 'ACTIVE',
      lastLogin: '10 mins ago'
    },
    {
      id: 'USR-002',
      name: 'Shri. M. R. Patil',
      email: 'mrpatil@dish.gov.in',
      phone: '+91 98221 44556',
      role: 'DEPT_HOD',
      department: 'DISH',
      district: 'Maharashtra (State)',
      status: 'ACTIVE',
      lastLogin: '1 hour ago'
    },
    {
      id: 'USR-003',
      name: 'Kavita Jadhav',
      email: 'gm.dicpune@maharashtra.gov.in',
      phone: '+91 94220 77889',
      role: 'DIC_OFFICER',
      department: 'Industries Dept (DIC)',
      district: 'Pune',
      status: 'ACTIVE',
      lastLogin: '25 mins ago'
    },
    {
      id: 'USR-004',
      name: 'Vikram Joshi',
      email: 'vjoshi@mpcb.gov.in',
      phone: '+91 98900 33445',
      role: 'INSPECTOR',
      department: 'MPCB',
      district: 'Pune & Pimpri-Chinchwad',
      status: 'ACTIVE',
      lastLogin: 'Yesterday'
    },
    {
      id: 'USR-005',
      name: 'State MSIS Admin',
      email: 'admin.msis@maharashtra.gov.in',
      phone: '+91 98230 99999',
      role: 'STATE_ADMIN',
      department: 'State Single Window Bureau',
      district: 'All Districts (Super Admin)',
      status: 'ACTIVE',
      lastLogin: 'Active now'
    },
    {
      id: 'USR-006',
      name: 'Rahul Ramesh Patil',
      email: 'rahul@rahulfoods.co.in',
      phone: '+91 98230 45678',
      role: 'ENTREPRENEUR',
      department: 'Rahul Foods & Beverages Pvt Ltd',
      district: 'Pune (MIDC Ranjangaon)',
      status: 'ACTIVE',
      lastLogin: 'Active now'
    }
  ]);

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  User & Role-Based Access Control (RBAC)
                </h1>
                <p className="text-sm text-slate-400">
                  Provision Department Officers, HODs, DIC Nodal authorities, Inspectors, and State Admins
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('New User Provisioning Modal - Role, Department & District')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-blue-500/20"
            >
              <UserPlus className="w-4 h-4" />
              Provision Officer / User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name, email, department..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            {['ALL', 'DEPT_OFFICER', 'DEPT_HOD', 'DIC_OFFICER', 'STATE_ADMIN', 'ENTREPRENEUR'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                  roleFilter === r ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 uppercase tracking-wider">
                  <th className="p-4 font-semibold">User / Officer</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Department / Unit</th>
                  <th className="p-4 font-semibold">Jurisdiction / District</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[11px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300 font-medium">{u.department}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {u.district}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Edit Permissions for ${u.name}`)}
                        className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded text-xs transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
