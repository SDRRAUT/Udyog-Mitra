'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Building2,
  User,
  ShieldCheck,
  MapPin,
  Lock,
  Edit3,
  Save,
  CheckCircle2,
  FileText,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    entityName: 'Rahul Foods & Beverages Pvt Ltd',
    entityType: 'Private Limited Company',
    cin: 'U15400PN2024PTC198421',
    pan: 'AABCR1234F',
    gstin: '27AABCR1234F1Z5',
    udyamNo: 'UDYAM-MH-26-0049281',
    category: 'Small Enterprise',
    authorizedPerson: 'Rahul Ramesh Patil',
    designation: 'Managing Director',
    mobile: '+91 98230 45678',
    email: 'rahul@rahulfoods.co.in',
    district: 'Pune',
    taluka: 'Haveli',
    locationType: 'MIDC Industrial Area',
    midcArea: 'MIDC Ranjangaon Industrial Park Phase-III',
    plotNo: 'Plot No. D-42',
    plotAreaSqM: '4,500 sq.m',
    capitalInvestment: '₹ 2,00,00,000 (₹ 2.00 Cr)',
    pollutionCategory: 'ORANGE',
    verifiedBy: 'MPCB & MIDC Joint Scrutiny Cell',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2.5">
              Industrial Unit Profile
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[#A6F4C5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC Verified
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Single Source of Truth for all inter-departmental clearances and statutory filings
            </p>
          </div>

          <div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                leftIcon={<Edit3 className="w-4 h-4" />}
              >
                Edit Contact Details
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                size="sm"
                variant="primary"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-[var(--success-bg)] border border-[#A6F4C5] rounded-xl text-[var(--success-text)] text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#12B76A]" />
            <span>Profile changes updated. Any verified reusable fields will trigger quick background verification.</span>
          </div>
        )}

        {/* Verified Reusable Notice */}
        <div className="mt-6 p-4 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-[var(--primary-600)] shrink-0 mt-0.5" />
          <div className="text-xs text-[var(--primary-900)]">
            <p className="font-semibold text-[var(--primary-900)]">Verified Reusable Data Policy (Statutory Single-Window)</p>
            <p className="mt-0.5 text-[var(--text-muted)] leading-relaxed">
              Fields marked with <span className="font-mono bg-[var(--surface)] px-1 py-0.5 rounded text-[var(--primary-700)] border border-[var(--primary-200)]">VERIFIED_REUSABLE 🔒</span> have already been validated by MPCB and MIDC. Subsequent departments (DISH, Fire, Labour) directly consume this verified data without requesting duplicate scrutiny.
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Entity Details */}
          <div className="p-5 surface-card border border-[var(--border)] rounded-xl shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] border-b border-[var(--border)] pb-3">
              <Building2 className="w-4 h-4 text-[var(--primary-600)]" />
              Entity Details
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-subtle)] block mb-0.5">Entity Name</label>
                <div className="font-semibold text-[var(--text)] flex items-center justify-between">
                  <span>{profile.entityName}</span>
                  <span className="text-[10px] text-[var(--primary-700)] bg-[var(--primary-50)] px-1.5 py-0.5 rounded border border-[var(--primary-200)]">
                    🔒 Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">Entity Type</label>
                  <p className="font-medium text-[var(--text)]">{profile.entityType}</p>
                </div>
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">MSME Classification</label>
                  <p className="font-mono font-semibold text-[var(--primary-700)]">{profile.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">PAN Number</label>
                  <div className="font-mono text-[var(--text)] flex items-center gap-1.5">
                    <span>{profile.pan}</span>
                    <span className="text-[10px] text-[#12B76A]">✓</span>
                  </div>
                </div>
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">GSTIN</label>
                  <div className="font-mono text-[var(--text)] flex items-center gap-1.5">
                    <span>{profile.gstin}</span>
                    <span className="text-[10px] text-[#12B76A]">✓</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[var(--text-subtle)] block mb-0.5">Udyam Registration</label>
                <p className="font-mono text-[var(--text)]">{profile.udyamNo}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Representative */}
          <div className="p-5 surface-card border border-[var(--border)] rounded-xl shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] border-b border-[var(--border)] pb-3">
              <User className="w-4 h-4 text-[var(--primary-600)]" />
              Authorized Representative
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-subtle)] block mb-0.5">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.authorizedPerson}
                    onChange={(e) => setProfile({ ...profile, authorizedPerson: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)]"
                  />
                ) : (
                  <p className="font-semibold text-[var(--text)]">{profile.authorizedPerson}</p>
                )}
              </div>

              <div>
                <label className="text-[var(--text-subtle)] block mb-0.5">Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)]"
                  />
                ) : (
                  <p className="font-medium text-[var(--text)]">{profile.designation}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">Mobile</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.mobile}
                      onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)]"
                    />
                  ) : (
                    <p className="font-mono text-[var(--text)]">{profile.mobile}</p>
                  )}
                </div>
                <div>
                  <label className="text-[var(--text-subtle)] block mb-0.5">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)]"
                    />
                  ) : (
                    <p className="font-mono text-[var(--text)] truncate">{profile.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
