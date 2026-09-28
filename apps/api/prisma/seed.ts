// UDYOG MARG - Complete Seed Data
// Run: npx ts-node prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting UDYOG MARG seed...');

  // ===================== STATE =====================
  const maharashtra = await prisma.state.upsert({
    where: { code: 'MH' },
    update: {},
    create: { name: 'Maharashtra', code: 'MH', isActive: true },
  });
  console.log('✅ State created: Maharashtra');

  // ===================== DISTRICTS =====================
  const districtData = [
    { name: 'Pune', code: 'MH-PUN', stateId: maharashtra.id },
    { name: 'Mumbai Suburban', code: 'MH-MUM', stateId: maharashtra.id },
    { name: 'Nagpur', code: 'MH-NAG', stateId: maharashtra.id },
    { name: 'Aurangabad', code: 'MH-AUR', stateId: maharashtra.id },
    { name: 'Nashik', code: 'MH-NAS', stateId: maharashtra.id },
    { name: 'Kolhapur', code: 'MH-KOL', stateId: maharashtra.id },
  ];

  const districts: Record<string, any> = {};
  for (const d of districtData) {
    const dist = await prisma.district.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
    districts[d.name] = dist;
  }
  console.log('✅ Districts created:', Object.keys(districts).join(', '));

  // ===================== DEPARTMENTS =====================
  const deptData = [
    { code: 'DIC', name: 'District Industries Centre', shortName: 'DIC', description: 'Facilitates industrial development at district level', color: '#3B82F6', iconCode: 'building2' },
    { code: 'MPCB', name: 'Maharashtra Pollution Control Board', shortName: 'MPCB', description: 'Regulates pollution and environmental compliance', color: '#10B981', iconCode: 'leaf' },
    { code: 'DISH', name: 'Directorate of Industrial Safety & Health', shortName: 'DISH', description: 'Ensures workplace safety and health standards', color: '#F59E0B', iconCode: 'shield' },
    { code: 'FIRE', name: 'Maharashtra Fire Services', shortName: 'FIRE', description: 'Issues fire safety NOCs and compliance', color: '#EF4444', iconCode: 'flame' },
    { code: 'LABOUR', name: 'Labour Department Maharashtra', shortName: 'Labour', description: 'Labour registrations and compliance', color: '#8B5CF6', iconCode: 'users' },
    { code: 'REVENUE', name: 'Revenue Department', shortName: 'Revenue', description: 'Land records and revenue clearances', color: '#6B7280', iconCode: 'map' },
    { code: 'MIDC', name: 'Maharashtra Industrial Dev Corp', shortName: 'MIDC', description: 'Industrial area development and allotment', color: '#0EA5E9', iconCode: 'factory' },
    { code: 'MSIS', name: 'Maharashtra State Investment & Industry', shortName: 'MSIS', description: 'State level investment facilitation', color: '#F97316', iconCode: 'trending-up' },
  ];

  const departments: Record<string, any> = {};
  for (const d of deptData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: {},
      create: { ...d, isActive: true },
    });
    departments[d.code] = dept;
  }
  console.log('✅ Departments created:', Object.keys(departments).join(', '));

  // ===================== USERS =====================
  const demoPassword = '123456'; // For demo: OTP code = 123456
  
  const usersData = [
    {
      email: 'entrepreneur.demo@mahsetu.in',
      mobile: '9000000001',
      name: 'Rajesh Sharma',
      role: 'ENTREPRENEUR' as const,
      isVerified: true,
      departmentId: null,
      districtId: districts['Pune'].id,
    },
    {
      email: 'mpcb.officer@mahsetu.in',
      mobile: '9000000002',
      name: 'Priya Desai',
      role: 'DEPARTMENT_OFFICER' as const,
      isVerified: true,
      departmentId: departments['MPCB'].id,
      districtId: districts['Pune'].id,
    },
    {
      email: 'dish.officer@mahsetu.in',
      mobile: '9000000003',
      name: 'Sunil Patil',
      role: 'DEPARTMENT_OFFICER' as const,
      isVerified: true,
      departmentId: departments['DISH'].id,
      districtId: districts['Pune'].id,
    },
    {
      email: 'fire.officer@mahsetu.in',
      mobile: '9000000004',
      name: 'Amol Kulkarni',
      role: 'DEPARTMENT_OFFICER' as const,
      isVerified: true,
      departmentId: departments['FIRE'].id,
      districtId: districts['Pune'].id,
    },
    {
      email: 'labour.officer@mahsetu.in',
      mobile: '9000000005',
      name: 'Meena Jadhav',
      role: 'DEPARTMENT_OFFICER' as const,
      isVerified: true,
      departmentId: departments['LABOUR'].id,
      districtId: districts['Pune'].id,
    },
    {
      email: 'dic.pune@mahsetu.in',
      mobile: '9000000006',
      name: 'Ashok Bhosale',
      role: 'DIC_OFFICER' as const,
      isVerified: true,
      departmentId: departments['DIC'].id,
      districtId: districts['Pune'].id,
    },
    {
      email: 'admin.msis@mahsetu.in',
      mobile: '9000000007',
      name: 'Dr. Vandana Shinde',
      role: 'STATE_ADMIN' as const,
      isVerified: true,
      departmentId: departments['MSIS'].id,
      districtId: null,
    },
    {
      email: 'grievance@mahsetu.in',
      mobile: '9000000008',
      name: 'Ramesh Wagh',
      role: 'GRIEVANCE_OFFICER' as const,
      isVerified: true,
      departmentId: departments['DIC'].id,
      districtId: districts['Pune'].id,
    },
  ];

  const users: Record<string, any> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, isActive: true },
    });
    users[u.email] = user;
  }

  // Create entrepreneur profile
  await prisma.entrepreneurProfile.upsert({
    where: { userId: users['entrepreneur.demo@mahsetu.in'].id },
    update: {},
    create: {
      userId: users['entrepreneur.demo@mahsetu.in'].id,
      entityType: 'PRIVATE_LIMITED',
      businessName: 'Sharma Food Industries Pvt Ltd',
      panNo: 'ABCPS1234D',
      udyamNo: 'UDYAM-MH-27-0001234',
      gstNo: '27ABCPS1234D1ZX',
      promoterName: 'Rajesh Sharma',
      promoterMobile: '9000000001',
      promoterEmail: 'entrepreneur.demo@mahsetu.in',
      addressLine1: 'Plot No. 45, MIDC Bhosari',
      city: 'Pune',
      pincode: '411026',
      isWomenEntrepreneur: false,
      isMSME: true,
      isProfileComplete: true,
    },
  });

  console.log('✅ Users created with demo credentials');

  // ===================== APPROVAL MASTERS =====================
  const approvalMastersData = [
    {
      code: 'MPCB_CTE',
      name: 'Consent to Establish (CTE)',
      shortName: 'CTE',
      description: 'Prior permission from MPCB to establish an industry that may cause pollution',
      departmentId: departments['MPCB'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 30,
      actReference: 'Water Prevention Act 1974, Air Prevention Act 1981',
      requiredDocs: [
        { docCode: 'SITE_PLAN', name: 'Site Plan / Layout Plan', description: 'Detailed layout showing plant layout, effluent treatment', isMandatory: true, acceptedFormats: ['pdf', 'dwg'], maxSizeMB: 10 },
        { docCode: 'PROJECT_REPORT', name: 'Project Report / DPR', description: 'Detailed project report with process description', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 20 },
        { docCode: 'LAND_OWNERSHIP', name: 'Land Ownership / Lease Document', description: '7/12 extract or lease agreement', isMandatory: true, acceptedFormats: ['pdf', 'jpg', 'jpeg'], maxSizeMB: 5 },
        { docCode: 'MPCB_FORM_1', name: 'MPCB Form 1 (CTE Application)', description: 'Duly filled MPCB CTE application form', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'FLOW_DIAGRAM', name: 'Process Flow Diagram', description: 'Manufacturing process and waste generation flow', isMandatory: false, acceptedFormats: ['pdf', 'jpg'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'MPCB_CTO',
      name: 'Consent to Operate (CTO)',
      shortName: 'CTO',
      description: 'Permission from MPCB to operate/run the established industry',
      departmentId: departments['MPCB'].id,
      isMandatoryBase: false,
      isParallelEligible: false,
      slaDays: 30,
      actReference: 'Water Prevention Act 1974, Air Prevention Act 1981',
      requiredDocs: [
        { docCode: 'CTE_COPY', name: 'Valid CTE Copy', description: 'Copy of approved CTE certificate', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'COMPLETION_CERTIFICATE', name: 'Completion Certificate', description: 'Building/civil work completion certificate', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'ETP_COMMISSIONING', name: 'ETP Commissioning Report', description: 'Effluent Treatment Plant commissioning certificate', isMandatory: false, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'MPCB_FORM_5', name: 'MPCB Form 5 (CTO Application)', description: 'Duly filled CTO application form', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
      ],
      dependencies: ['MPCB_CTE'],
    },
    {
      code: 'FACTORY_LICENSE',
      name: 'Factory License (Registration & License)',
      shortName: 'Factory Lic',
      description: 'License under Factories Act 1948 for manufacturing units employing 10+ workers',
      departmentId: departments['DISH'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 45,
      actReference: 'Factories Act 1948, Maharashtra Factories Rules 1963',
      requiredDocs: [
        { docCode: 'FACTORY_PLAN', name: 'Factory Plan (Approved)', description: 'Approved building plan showing factory layout', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'STABILITY_CERTIFICATE', name: 'Structural Stability Certificate', description: 'Certificate from Licensed Structural Engineer', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'FORM_1_FACTORY', name: 'Form 1 - Factory Registration', description: 'Duly filled Form 1 under Factories Act', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'ELECTRICITY_SUPPLY', name: 'Electricity Supply Document', description: 'Load sanction from electricity board', isMandatory: false, acceptedFormats: ['pdf', 'jpg'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'FIRE_NOC',
      name: 'No Objection Certificate - Fire Safety',
      shortName: 'Fire NOC',
      description: 'NOC from Fire Department ensuring fire safety compliance',
      departmentId: departments['FIRE'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 21,
      actReference: 'Maharashtra Fire Prevention and Life Safety Measures Act 2006',
      requiredDocs: [
        { docCode: 'BUILDING_PLAN', name: 'Approved Building Plan', description: 'Local authority approved building plan with fire safety provisions', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 15 },
        { docCode: 'FIRE_ESCAPE_PLAN', name: 'Fire Escape Plan', description: 'Emergency evacuation and fire escape route plan', isMandatory: true, acceptedFormats: ['pdf', 'jpg'], maxSizeMB: 5 },
        { docCode: 'FIRE_EQUIPMENT_SPEC', name: 'Fire Fighting Equipment Specification', description: 'Specification and layout of fire fighting equipment', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'LABOUR_SHOPS_EST',
      name: 'Shop & Establishment License',
      shortName: 'S&E License',
      description: 'Registration under Maharashtra Shops & Establishments Act',
      departmentId: departments['LABOUR'].id,
      isMandatoryBase: true,
      isParallelEligible: true,
      slaDays: 7,
      actReference: 'Maharashtra Shops & Establishments (Regulation of Employment & Conditions of Service) Act 2017',
      requiredDocs: [
        { docCode: 'AADHAR_PROMOTER', name: 'Promoter Aadhaar Card', description: 'Promoter/Owner Aadhaar card (masked)', isMandatory: true, acceptedFormats: ['pdf', 'jpg', 'jpeg'], maxSizeMB: 2 },
        { docCode: 'PAN_ENTITY', name: 'PAN Card (Entity/Proprietor)', description: 'Entity or proprietor PAN card', isMandatory: true, acceptedFormats: ['pdf', 'jpg', 'jpeg'], maxSizeMB: 2 },
        { docCode: 'BUSINESS_PROOF', name: 'Business Address Proof', description: 'Utility bill or lease agreement for business address', isMandatory: true, acceptedFormats: ['pdf', 'jpg'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'LABOUR_CONTRACT_WORK',
      name: 'Contract Labour Registration',
      shortName: 'CL Reg',
      description: 'Registration under Contract Labour (Regulation & Abolition) Act',
      departmentId: departments['LABOUR'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 30,
      actReference: 'Contract Labour (R&A) Act 1970',
      requiredDocs: [
        { docCode: 'FORM_1_CL', name: 'Form 1 - CL Registration', description: 'Application form for CL Registration', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'WORKFORCE_LIST', name: 'Workforce/Employee List', description: 'List of proposed contract employees', isMandatory: true, acceptedFormats: ['pdf', 'xlsx'], maxSizeMB: 5 },
      ],
      dependencies: ['LABOUR_SHOPS_EST'],
    },
    {
      code: 'EPF_REGISTRATION',
      name: 'EPF/ESIC Registration',
      shortName: 'EPF/ESIC',
      description: 'Registration under Employees Provident Fund and ESIC Acts',
      departmentId: departments['LABOUR'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 15,
      actReference: 'EPF & MP Act 1952, ESI Act 1948',
      requiredDocs: [
        { docCode: 'REGISTRATION_CERT', name: 'Company Registration Certificate', description: 'MOA/AOA, Partnership deed, or Udyam Certificate', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'SALARY_SLIP_SAMPLE', name: 'Sample Salary Slip', description: 'Proposed salary slip format', isMandatory: false, acceptedFormats: ['pdf', 'xlsx'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'MIDC_ALLOTMENT',
      name: 'MIDC Plot Allotment / Agreement',
      shortName: 'MIDC Allotment',
      description: 'Plot allotment and agreement from MIDC for industrial use',
      departmentId: departments['MIDC'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 60,
      actReference: 'MIDC Act 1961',
      requiredDocs: [
        { docCode: 'MIDC_APPLICATION', name: 'MIDC Plot Application', description: 'Duly filled MIDC plot allotment application', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'PROJECT_REPORT', name: 'Project Report', description: 'Detailed project/business plan', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 20 },
      ],
      dependencies: [],
    },
    {
      code: 'MPCB_HW_AUTH',
      name: 'Hazardous Waste Authorization',
      shortName: 'HW Auth',
      description: 'Authorization for handling/disposal of hazardous waste',
      departmentId: departments['MPCB'].id,
      isMandatoryBase: false,
      isParallelEligible: false,
      slaDays: 45,
      actReference: 'Hazardous & Other Wastes (M&TBM) Rules 2016',
      requiredDocs: [
        { docCode: 'HW_MANIFEST', name: 'Hazardous Waste Manifest', description: 'List of hazardous waste types and quantities', isMandatory: true, acceptedFormats: ['pdf', 'xlsx'], maxSizeMB: 10 },
        { docCode: 'DISPOSAL_PLAN', name: 'Hazardous Waste Disposal Plan', description: 'Plan for collection, storage, treatment and disposal', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
      ],
      dependencies: ['MPCB_CTE'],
    },
    {
      code: 'DISH_BOILER',
      name: 'Boiler Registration & License',
      shortName: 'Boiler License',
      description: 'Registration and license for boilers under Boilers Act',
      departmentId: departments['DISH'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 30,
      actReference: 'Boilers Act 1923, Maharashtra Boiler Regulations',
      requiredDocs: [
        { docCode: 'BOILER_DESIGN', name: 'Boiler Design Certificate', description: 'Design approval certificate from boiler authority', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'INSPECTION_REPORT', name: 'Pre-installation Inspection Report', description: 'Inspector report for boiler installation', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'ELECTRICITY_LOAD',
      name: 'Electricity Load Sanction (MSEDCL)',
      shortName: 'Power Load',
      description: 'Power load sanction from Maharashtra State Electricity Distribution Company',
      departmentId: departments['DIC'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 45,
      actReference: 'Electricity Act 2003',
      requiredDocs: [
        { docCode: 'LOAD_APPLICATION', name: 'Power Load Application', description: 'MSEDCL application with load calculation', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
        { docCode: 'ELECTRICAL_LAYOUT', name: 'Electrical Layout Plan', description: 'Internal electrical layout plan', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
      ],
      dependencies: [],
    },
    {
      code: 'WATER_NOC',
      name: 'Water Connection NOC (MIDC/Local Body)',
      shortName: 'Water NOC',
      description: 'NOC for water connection from MIDC or local body',
      departmentId: departments['MIDC'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 21,
      actReference: 'Water Supply and Sanitation Act 2005',
      requiredDocs: [
        { docCode: 'WATER_REQUIREMENT', name: 'Water Requirement Statement', description: 'Detailed water usage calculation', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
    {
      code: 'REVENUE_LAND_CONV',
      name: 'Land Use Conversion (Revenue)',
      shortName: 'Land Conversion',
      description: 'Permission for conversion of agricultural land to non-agricultural use',
      departmentId: departments['REVENUE'].id,
      isMandatoryBase: false,
      isParallelEligible: true,
      slaDays: 90,
      actReference: 'Maharashtra Land Revenue Code 1966 Section 44',
      requiredDocs: [
        { docCode: 'SEVEN_TWELVE', name: '7/12 Extract', description: 'Current 7/12 extract showing land details', isMandatory: true, acceptedFormats: ['pdf', 'jpg'], maxSizeMB: 5 },
        { docCode: 'SURVEY_MAP', name: 'Survey Map / City Survey Copy', description: 'Survey map of the plot', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 10 },
        { docCode: 'NA_APPLICATION', name: 'NA Permission Application', description: 'Application for non-agricultural permission', isMandatory: true, acceptedFormats: ['pdf'], maxSizeMB: 5 },
      ],
      dependencies: [],
    },
  ];

  const approvalMasters: Record<string, any> = {};
  for (const am of approvalMastersData) {
    const master = await prisma.approvalMaster.upsert({
      where: { code: am.code },
      update: {},
      create: {
        ...am,
        requiredDocs: am.requiredDocs as any,
        dependencies: am.dependencies as any,
      },
    });
    approvalMasters[am.code] = master;
  }
  console.log('✅ Approval Masters created:', Object.keys(approvalMasters).length);

  // ===================== CHECKLIST RULES =====================
  const checklistRules = [
    {
      ruleId: 'MPCB_CTE_ORANGE_RED',
      name: 'MPCB CTE for Orange/Red Pollution Category',
      description: 'Consent to Establish required for Orange and Red category industries',
      conditions: {
        $and: [
          { $in: [{ var: 'pollutionCategory' }, ['ORANGE', 'RED']] },
          { $in: [{ var: 'businessStage' }, ['PRE_ESTABLISHMENT', 'ESTABLISHMENT', 'EXPANSION']] }
        ]
      },
      applicableApprovals: ['MPCB_CTE'],
      mandatory: true,
      priority: 10,
      explanation: 'Orange and Red category industries require prior MPCB consent under Water (Prevention & Control of Pollution) Act 1974 and Air (Prevention & Control of Pollution) Act 1981.',
      sourceRef: 'MPCB CTE Guidelines / Maharashtra Pollution Control Board',
    },
    {
      ruleId: 'MPCB_CTE_GREEN_MIDC',
      name: 'MPCB CTE for Green Category in MIDC',
      description: 'Consent to Establish required for Green category industries in MIDC areas',
      conditions: {
        $and: [
          { $in: [{ var: 'pollutionCategory' }, ['GREEN']] },
          { $in: [{ var: 'locationType' }, ['MIDC', 'INDUSTRIAL_PARK', 'SEZ']] },
          { $in: [{ var: 'businessStage' }, ['PRE_ESTABLISHMENT', 'ESTABLISHMENT']] }
        ]
      },
      applicableApprovals: ['MPCB_CTE'],
      mandatory: true,
      priority: 11,
      explanation: 'Green category industries in MIDC/Industrial areas require MPCB CTE.',
      sourceRef: 'MPCB Green Category Guidelines',
    },
    {
      ruleId: 'MPCB_CTO_POST_CONSTRUCTION',
      name: 'MPCB CTO after Establishment',
      description: 'CTO required once construction/establishment is complete',
      conditions: {
        $and: [
          { $in: [{ var: 'pollutionCategory' }, ['GREEN', 'ORANGE', 'RED']] },
          { $in: [{ var: 'businessStage' }, ['ESTABLISHMENT', 'EXPANSION', 'DIVERSIFICATION']] }
        ]
      },
      applicableApprovals: ['MPCB_CTO'],
      mandatory: true,
      priority: 12,
      explanation: 'CTO is required before commencing operations. It depends on CTE approval.',
      sourceRef: 'MPCB CTO Guidelines',
    },
    {
      ruleId: 'FACTORY_LICENSE_WORKERS',
      name: 'Factory License for 10+ Workers',
      description: 'Factory License required for units employing 10 or more workers',
      conditions: {
        $and: [
          { '>=': [{ var: 'employeeCount' }, 10] }
        ]
      },
      applicableApprovals: ['FACTORY_LICENSE'],
      mandatory: true,
      priority: 10,
      explanation: 'As per Factories Act 1948, any factory employing 10 or more workers (with power) or 20+ workers (without power) requires a Factory License from DISH.',
      sourceRef: 'Factories Act 1948, Section 2(m), Maharashtra Factories Rules 1963',
    },
    {
      ruleId: 'FACTORY_LICENSE_POWER',
      name: 'Factory License for Power-using Units',
      description: 'Factory License required for units using power with 10+ workers',
      conditions: {
        $and: [
          { '>=': [{ var: 'employeeCount' }, 10] },
          { '>': [{ var: 'powerKW' }, 0] }
        ]
      },
      applicableApprovals: ['FACTORY_LICENSE'],
      mandatory: true,
      priority: 9,
      explanation: 'Power-using factories with 10+ workers require Factory License under Section 6 of Factories Act.',
      sourceRef: 'Factories Act 1948 Section 6',
    },
    {
      ruleId: 'FIRE_NOC_BUILDING_HEIGHT',
      name: 'Fire NOC for Buildings above 9m',
      description: 'Fire NOC mandatory for buildings/structures taller than 9 meters',
      conditions: {
        '>=': [{ var: 'buildingHeight' }, 9]
      },
      applicableApprovals: ['FIRE_NOC'],
      mandatory: true,
      priority: 10,
      explanation: 'Maharashtra Fire Prevention Act mandates Fire NOC for buildings exceeding 9m height due to fire safety risks.',
      sourceRef: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
    },
    {
      ruleId: 'FIRE_NOC_HAZARDOUS',
      name: 'Fire NOC for Hazardous Industries',
      description: 'Fire NOC mandatory if hazardous substances are involved',
      conditions: {
        '===': [{ var: 'hasHazardousSubstances' }, true]
      },
      applicableApprovals: ['FIRE_NOC'],
      mandatory: true,
      priority: 8,
      explanation: 'Industries handling hazardous substances require Fire NOC to ensure proper fire safety measures.',
      sourceRef: 'Maharashtra Fire Prevention Act 2006, Hazardous Industries Guidelines',
    },
    {
      ruleId: 'LABOUR_SHOPS_EST_ALL',
      name: 'Shop & Establishment Registration - All Businesses',
      description: 'S&E License mandatory for all business establishments',
      conditions: {
        $or: [
          { '>=': [{ var: 'employeeCount' }, 1] },
          { $in: [{ var: 'businessStage' }, ['PRE_ESTABLISHMENT', 'ESTABLISHMENT', 'EXPANSION', 'DIVERSIFICATION']] }
        ]
      },
      applicableApprovals: ['LABOUR_SHOPS_EST'],
      mandatory: true,
      priority: 5,
      explanation: 'Maharashtra Shops & Establishments Act 2017 mandates registration for all business establishments regardless of employee count.',
      sourceRef: 'Maharashtra Shops & Establishments Act 2017',
    },
    {
      ruleId: 'EPF_ESIC_20_WORKERS',
      name: 'EPF/ESIC Registration for 20+ Employees',
      description: 'EPF and ESIC registration required for units employing 20+ workers',
      conditions: {
        '>=': [{ var: 'employeeCount' }, 20]
      },
      applicableApprovals: ['EPF_REGISTRATION'],
      mandatory: true,
      priority: 8,
      explanation: 'EPF Act 1952 applies to establishments employing 20+ workers. ESI Act applies for applicable wage bands.',
      sourceRef: 'EPF & MP Act 1952, ESI Act 1948',
    },
    {
      ruleId: 'CONTRACT_LABOUR_50_WORKERS',
      name: 'Contract Labour Registration for 50+ Contract Workers',
      description: 'Registration under Contract Labour Act required for 50+ contract workers',
      conditions: {
        '>=': [{ var: 'employeeCount' }, 50]
      },
      applicableApprovals: ['LABOUR_CONTRACT_WORK'],
      mandatory: false,
      priority: 9,
      explanation: 'If employing 50 or more contract workers through contractors, CL Act registration is required.',
      sourceRef: 'Contract Labour (R&A) Act 1970',
    },
    {
      ruleId: 'MIDC_ALLOTMENT_MIDC_LOCATION',
      name: 'MIDC Allotment for MIDC Located Industry',
      description: 'MIDC plot allotment required if industry is in MIDC area',
      conditions: {
        $in: [{ var: 'locationType' }, ['MIDC']]
      },
      applicableApprovals: ['MIDC_ALLOTMENT'],
      mandatory: true,
      priority: 7,
      explanation: 'Industries located in MIDC areas must have valid MIDC plot allotment letter and execute MIDC agreement.',
      sourceRef: 'MIDC Act 1961, Plot Allotment Guidelines',
    },
    {
      ruleId: 'HW_AUTH_RED_HAZARDOUS',
      name: 'Hazardous Waste Authorization for Red + Hazardous',
      description: 'HW Authorization required for Red category industries with hazardous waste',
      conditions: {
        $and: [
          { $in: [{ var: 'pollutionCategory' }, ['RED']] },
          { '===': [{ var: 'hasHazardousSubstances' }, true] }
        ]
      },
      applicableApprovals: ['MPCB_HW_AUTH'],
      mandatory: true,
      priority: 8,
      explanation: 'Red category industries generating hazardous waste must obtain Hazardous Waste Authorization from MPCB under HW Rules 2016.',
      sourceRef: 'Hazardous & Other Wastes (Management & Transboundary Movement) Rules 2016',
    },
    {
      ruleId: 'BOILER_LICENSE_BOILER',
      name: 'Boiler License for Boiler Usage',
      description: 'Boiler Registration required if boiler is used in production',
      conditions: {
        '===': [{ var: 'hasBoiler' }, true]
      },
      applicableApprovals: ['DISH_BOILER'],
      mandatory: true,
      priority: 9,
      explanation: 'Any industrial unit using a boiler requires registration and license under Boilers Act 1923.',
      sourceRef: 'Boilers Act 1923',
    },
    {
      ruleId: 'ELECTRICITY_LOAD_ALL',
      name: 'Electricity Load Sanction',
      description: 'Power load sanction required for all manufacturing units',
      conditions: {
        $in: [{ var: 'sector' }, ['MANUFACTURING', 'PROCESSING', 'FOOD_PROCESSING', 'TEXTILE', 'CHEMICAL', 'ENGINEERING', 'PHARMA']]
      },
      applicableApprovals: ['ELECTRICITY_LOAD'],
      mandatory: true,
      priority: 6,
      explanation: 'Manufacturing units must obtain power load sanction from MSEDCL before commencing operations.',
      sourceRef: 'Electricity Act 2003',
    },
    {
      ruleId: 'WATER_NOC_MIDC',
      name: 'Water Connection NOC for MIDC Units',
      description: 'Water NOC required from MIDC for water connection in MIDC areas',
      conditions: {
        $and: [
          { $in: [{ var: 'locationType' }, ['MIDC']] },
          { '>': [{ var: 'waterRequirementKLD' }, 0] }
        ]
      },
      applicableApprovals: ['WATER_NOC'],
      mandatory: true,
      priority: 7,
      explanation: 'MIDC provides water supply to industries in its areas. NOC/connection approval required before commencing.',
      sourceRef: 'MIDC Water Supply Guidelines',
    },
    {
      ruleId: 'LAND_CONV_AGRI_TO_NA',
      name: 'Land Use Conversion for Agricultural Land',
      description: 'NA permission required if industry is proposed on agricultural land',
      conditions: {
        $and: [
          { $in: [{ var: 'landType' }, ['AGRICULTURAL', 'AGRI_CONVERTED']] },
          { $in: [{ var: 'locationType' }, ['RURAL', 'URBAN', 'NON_MIDC_INDUSTRIAL']] }
        ]
      },
      applicableApprovals: ['REVENUE_LAND_CONV'],
      mandatory: true,
      priority: 5,
      explanation: 'Converting agricultural land to industrial use requires non-agricultural permission from Revenue Department.',
      sourceRef: 'Maharashtra Land Revenue Code 1966, Section 44',
    },
    {
      ruleId: 'MPCB_CTE_WHITE_EXEMPT',
      name: 'MPCB CTE Exemption for White Category',
      description: 'White category industries do not require MPCB CTE',
      conditions: {
        '===': [{ var: 'pollutionCategory' }, 'WHITE']
      },
      applicableApprovals: ['MPCB_CTE', 'MPCB_CTO'],
      mandatory: false,
      priority: 15,
      explanation: 'White category industries are generally exempt from MPCB CTE/CTO requirements as they cause negligible pollution.',
      sourceRef: 'MPCB White Category Exemption List',
    },
    {
      ruleId: 'FIRE_NOC_LARGE_INVESTMENT',
      name: 'Fire NOC for Large Investment Projects',
      description: 'Fire NOC required for projects with investment above Rs.5 Crore',
      conditions: {
        '>': [{ var: 'totalInvestmentLakhs' }, 500]
      },
      applicableApprovals: ['FIRE_NOC'],
      mandatory: true,
      priority: 9,
      explanation: 'Large investment projects require comprehensive fire safety assessment and NOC.',
      sourceRef: 'Maharashtra Fire Prevention Act 2006',
    },
    {
      ruleId: 'MPCB_HW_ORANGE_HAZARDOUS',
      name: 'HW Auth for Orange + Hazardous',
      description: 'Hazardous Waste Authorization for Orange category with hazardous substances',
      conditions: {
        $and: [
          { $in: [{ var: 'pollutionCategory' }, ['ORANGE']] },
          { '===': [{ var: 'hasHazardousSubstances' }, true] }
        ]
      },
      applicableApprovals: ['MPCB_HW_AUTH'],
      mandatory: false,
      priority: 9,
      explanation: 'Conditional - Orange category industries with hazardous substances may require HW Authorization based on waste quantity.',
      sourceRef: 'HW Rules 2016',
    },
    {
      ruleId: 'FACTORY_LICENSE_FOOD',
      name: 'Factory License for Food Processing',
      description: 'Factory License for food processing units (FSSAI also applicable)',
      conditions: {
        $and: [
          { $in: [{ var: 'sector' }, ['FOOD_PROCESSING', 'FOOD_AND_BEVERAGES']] },
          { '>=': [{ var: 'employeeCount' }, 10] }
        ]
      },
      applicableApprovals: ['FACTORY_LICENSE'],
      mandatory: true,
      priority: 10,
      explanation: 'Food processing manufacturing units require Factory License under Factories Act.',
      sourceRef: 'Factories Act 1948',
    },
  ];

  for (const rule of checklistRules) {
    await prisma.checklistRule.upsert({
      where: { ruleId: rule.ruleId },
      update: {},
      create: {
        ...rule,
        conditions: rule.conditions as any,
        applicableApprovals: rule.applicableApprovals as any,
      },
    });
  }
  console.log('✅ Checklist Rules created:', checklistRules.length);

  // ===================== SCHEME MASTERS =====================
  const schemesData = [
    {
      code: 'MH_CAP_SUB_2023',
      name: 'Maharashtra Capital Subsidy Scheme',
      shortName: 'Capital Subsidy',
      description: 'Capital investment subsidy for new manufacturing units in Maharashtra. Up to 20% of fixed capital investment for units in D and D+ category districts.',
      category: 'CAPITAL_SUBSIDY' as const,
      benefitType: 'SUBSIDY',
      benefitValue: 'Up to 20% of Fixed Capital Investment (Max Rs.30 Lakhs for Micro, Rs.50 Lakhs for Small)',
      authority: 'Department of Industries, Maharashtra',
      isActive: true,
      eligibilityRules: {
        $and: [
          { $in: [{ var: 'entityType' }, ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED']] },
          { '>=': [{ var: 'totalInvestmentLakhs' }, 10] },
          { '<=': [{ var: 'totalInvestmentLakhs' }, 1000] },
          { $in: [{ var: 'sector' }, ['MANUFACTURING', 'FOOD_PROCESSING', 'TEXTILE', 'ENGINEERING', 'CHEMICAL', 'PHARMA']] }
        ]
      },
    },
    {
      code: 'MH_ELEC_DUTY_EXEMP',
      name: 'Electricity Duty Exemption Scheme',
      shortName: 'Electricity Duty Exemption',
      description: 'Exemption from electricity duty for new and expansion manufacturing units for 7 years from date of commencement.',
      category: 'ELECTRICITY_DUTY_EXEMPTION' as const,
      benefitType: 'TAX_EXEMPTION',
      benefitValue: '100% Electricity Duty Exemption for 7 years',
      authority: 'Energy Department, Maharashtra',
      isActive: true,
      eligibilityRules: {
        $and: [
          { $in: [{ var: 'businessStage' }, ['ESTABLISHMENT', 'EXPANSION']] },
          { '>=': [{ var: 'powerKW' }, 20] }
        ]
      },
    },
    {
      code: 'MH_INTEREST_SUB_MSME',
      name: 'Interest Subsidy Scheme for MSMEs',
      shortName: 'Interest Subsidy',
      description: '5% interest subsidy on term loans availed from nationalized banks for MSME units in Maharashtra.',
      category: 'INTEREST_SUBSIDY' as const,
      benefitType: 'INTEREST_SUBSIDY',
      benefitValue: '5% Interest Subsidy on Term Loan (Max Rs.10 Lakhs per year for 5 years)',
      authority: 'Directorate of Industries, Maharashtra',
      isActive: true,
      eligibilityRules: {
        $and: [
          { '===': [{ var: 'isMSME' }, true] },
          { '>=': [{ var: 'totalInvestmentLakhs' }, 5] },
          { '<=': [{ var: 'totalInvestmentLakhs' }, 500] }
        ]
      },
    },
    {
      code: 'MH_STAMP_DUTY_EXEMP',
      name: 'Stamp Duty Exemption (Industrial Areas)',
      shortName: 'Stamp Duty Exemption',
      description: 'Exemption from stamp duty on purchase/lease of land and buildings for industrial use in notified areas.',
      category: 'STAMP_DUTY_EXEMPTION' as const,
      benefitType: 'TAX_EXEMPTION',
      benefitValue: '100% Stamp Duty Exemption in D/D+ zones; 50% in C/C+ zones',
      authority: 'Revenue Department, Maharashtra',
      isActive: true,
      eligibilityRules: {
        $and: [
          { $in: [{ var: 'businessStage' }, ['PRE_ESTABLISHMENT', 'ESTABLISHMENT']] },
          { $in: [{ var: 'locationType' }, ['MIDC', 'NON_MIDC_INDUSTRIAL', 'INDUSTRIAL_PARK']] }
        ]
      },
    },
    {
      code: 'MH_WOMEN_ENTREPRENEUR',
      name: 'Women Entrepreneur Support Scheme',
      shortName: 'Women Entrepreneur',
      description: 'Special incentive package for women-led enterprises including additional 5% capital subsidy, priority processing, and mentorship support.',
      category: 'WOMEN_ENTREPRENEUR' as const,
      benefitType: 'MULTIPLE',
      benefitValue: 'Additional 5% Capital Subsidy + Priority Processing + Mentorship',
      authority: 'Women and Child Development & Industries Department',
      isActive: true,
      eligibilityRules: {
        $and: [
          { '===': [{ var: 'isWomenEntrepreneur' }, true] },
          { '>=': [{ var: 'totalInvestmentLakhs' }, 2] }
        ]
      },
    },
    {
      code: 'MH_MSME_INCENTIVE_2023',
      name: 'MSME Technology Upgradation Fund Scheme',
      shortName: 'MSME TUF',
      description: 'Credit linked capital subsidy for technology upgradation in MSME units. 15% subsidy on institutional finance for technology upgradation.',
      category: 'MSME_INCENTIVE' as const,
      benefitType: 'SUBSIDY',
      benefitValue: '15% Capital Subsidy on Technology Investment (Max Rs.15 Lakhs)',
      authority: 'MSME Development Institute, Maharashtra',
      isActive: true,
      eligibilityRules: {
        $and: [
          { '===': [{ var: 'isMSME' }, true] },
          { $in: [{ var: 'businessStage' }, ['EXPANSION', 'DIVERSIFICATION']] }
        ]
      },
    },
  ];

  for (const scheme of schemesData) {
    await prisma.schemeMaster.upsert({
      where: { code: scheme.code },
      update: {},
      create: {
        ...scheme,
        eligibilityRules: scheme.eligibilityRules as any,
      },
    });
  }
  console.log('✅ Scheme Masters created:', schemesData.length);

  // ===================== KNOWLEDGE CHUNKS (RAG) =====================
  const knowledgeChunks = [
    {
      title: 'Difference between CTE and CTO - MPCB',
      content: `Consent to Establish (CTE) and Consent to Operate (CTO) are two key environmental approvals from MPCB (Maharashtra Pollution Control Board).

CTE (Consent to Establish):
- Required BEFORE setting up/constructing an industry
- Applied at the planning/pre-construction stage
- Approves the proposed project from environmental angle
- Based on proposed layout, process, pollution control measures
- Valid until CTO is obtained (typically 5 years)
- Apply via MPCB online portal with project report, site plan, layout

CTO (Consent to Operate):
- Required AFTER construction, BEFORE starting operations
- Applied once plant is ready to operate
- Verifies that pollution control measures are actually installed
- Requires inspection by MPCB officer
- Renewable annually or as per conditions
- CTE must be obtained FIRST - CTO depends on CTE

Key Difference: CTE = Permission to BUILD. CTO = Permission to OPERATE.`,
      source: 'MPCB Official Guidelines',
      category: 'ENVIRONMENT_COMPLIANCE',
      language: 'en',
      metadata: { approvalCodes: ['MPCB_CTE', 'MPCB_CTO'], tags: ['MPCB', 'CTE', 'CTO', 'environment'] },
    },
    {
      title: 'CTE aur CTO mein antar (Hindi)',
      content: `CTE (Consent to Establish) aur CTO (Consent to Operate) - MPCB se prapt karne wale do mukhya parivesh anumati hain.

CTE (Sthapana ki Anumati):
- Udhyog STHAPIT karne se PEHLE zaruri hai
- Nirmaan shuru karne se pehle apply karein
- Parikalpana, layout aur pradushan niyantran upayon ki swikriti
- Parivesh portal par apply karein

CTO (Sancha;lan ki Anumati):
- Nirmaan POORN hone ke BAAD, utpadan shuru karne se PEHLE
- Vaastavik pradushan niyantran suvidhon ki jaanch ke baad
- MPCB adhikari dwara nirikshan zaruri
- CTE PEHLE praapt honi chahiye - CTO uske baad hi milti hai

Mukhya antar: CTE = Nirmaan ki anumati. CTO = Sancha;lan ki anumati.`,
      source: 'MPCB Guidelines (Hindi)',
      category: 'ENVIRONMENT_COMPLIANCE',
      language: 'hi',
      metadata: { approvalCodes: ['MPCB_CTE', 'MPCB_CTO'], tags: ['MPCB', 'CTE', 'CTO', 'paryavaran', 'hindi'] },
    },
    {
      title: 'Factory License - Who Needs It?',
      content: `Factory License (Registration and License) under Factories Act 1948 is required for:

1. Any factory using power and employing 10 or more workers
2. Any factory NOT using power but employing 20 or more workers

Issued by: DISH (Directorate of Industrial Safety and Health), Maharashtra

Key Process:
1. Submit Form 1 to DISH before beginning manufacturing
2. Plans submitted must include factory layout, machinery arrangement, escape routes
3. Annual renewal required
4. Factory Inspector visits for inspection before license issuance

Documents Required:
- Approved factory plan from licensed structural engineer
- Structural stability certificate
- Form 1 duly filled
- List of machinery/equipment
- Electricity load sanction

SLA: 45 working days from submission

Penalty for non-compliance: Imprisonment up to 2 years + fine up to Rs.2 lakhs per Factories Act.`,
      source: 'DISH Maharashtra, Factories Act 1948',
      category: 'INDUSTRIAL_SAFETY',
      language: 'en',
      metadata: { approvalCodes: ['FACTORY_LICENSE'], tags: ['Factory', 'DISH', 'Factories Act', 'license'] },
    },
    {
      title: 'Fire NOC - Requirements and Process',
      content: `Fire No Objection Certificate (NOC) is issued by Maharashtra Fire Services.

When is Fire NOC Required:
- Buildings/structures with height > 9 meters
- Industries handling flammable/hazardous substances
- Large investment projects (>Rs.5 crore)
- Food processing plants with commercial kitchens
- Any unit with significant fire risk

Documents Required:
- Approved building plan from local authority
- Fire escape plan showing evacuation routes
- Fire fighting equipment specification (sprinklers, extinguishers, hydrants)
- Smoke detection system details
- Location plan

Process:
1. Submit application with documents
2. Fire Officer inspects premises
3. Fire NOC issued if compliant, or deficiency notice sent
4. Annual renewal required

SLA: 21 days from application submission

Common Reasons for Rejection:
- Inadequate fire exits/escape routes
- No/insufficient fire fighting equipment
- Blocked emergency exits
- Non-compliant building plan`,
      source: 'Maharashtra Fire Services Guidelines',
      category: 'FIRE_SAFETY',
      language: 'en',
      metadata: { approvalCodes: ['FIRE_NOC'], tags: ['Fire', 'NOC', 'safety', 'fire fighting'] },
    },
    {
      title: 'Pollution Categories - White, Green, Orange, Red',
      content: `Maharashtra Pollution Control Board classifies industries into 4 categories based on pollution potential:

WHITE Category (No Pollution):
- Negligible environmental impact
- Examples: Agarbatti, Tailoring, Candle making, Flour mill
- Exempt from CTE/CTO requirements
- No MPCB consent needed

GREEN Category (Low Pollution):
- Low pollution, easily controllable
- Examples: Dairy products, Bakery, Electronic assembly, Furniture
- CTE may be required in MIDC/Industrial areas
- Simpler application process

ORANGE Category (Medium Pollution):
- Moderate pollution potential
- Examples: Rubber processing, Food processing with effluent, Textile dyeing, Printing inks
- CTE mandatory before establishment
- ETP (Effluent Treatment Plant) may be required

RED Category (High Pollution):
- High pollution, strict controls required
- Examples: Pharmaceutical, Chemical, Tannery, Electroplating, Sugar
- CTE mandatory before any construction
- Full ETP, APC required
- Regular MPCB inspection
- Hazardous Waste Authorization may be required

How to determine your category:
1. Check MPCB industry category list
2. Based on product, process, and waste generated
3. Self-declaration with MPCB verification
4. Conservative: when in doubt, assume higher category`,
      source: 'MPCB Industry Categorization Guidelines',
      category: 'POLLUTION_CATEGORIES',
      language: 'en',
      metadata: { tags: ['Pollution', 'White', 'Green', 'Orange', 'Red', 'MPCB', 'categories'] },
    },
    {
      title: 'Pradushan Shreni - Shwet, Hara, Nrangi, Laal (Hindi)',
      content: `Maharashtra Pradushan Niyantran Mandal (MPCB) udhyogon ko 4 shreniyon mein vargikrit karti hai:

SHWET (WHITE) - Koi Pradushan Nahi:
- Naganya pradushan prabhav
- Udaharan: Agarbatti, Darji, Momaabatti, Aata chakki
- CTE/CTO ki zarurat nahi

HARA (GREEN) - Kam Pradushan:
- Kam pradushan, asaani se niyantrit
- Udaharan: Dairy, Bakery, Electronics assembly
- MIDC mein CTE zaruri ho sakti hai

NARANGI (ORANGE) - Madhyam Pradushan:
- Madhyam pradushan sambhavana
- Udaharan: Rubber, Khadya processing, Textile dyeing
- CTE anivarya - nirmaan se pehle

LAAL (RED) - Ucch Pradushan:
- Ucch pradushan, sakht niyantran zaruri
- Udaharan: Pharmaceutical, Chemical, Chham
- CTE anivarya, ETP zaruri
- HW Authorization bhi zaruri ho sakti hai`,
      source: 'MPCB Guidelines (Hindi)',
      category: 'POLLUTION_CATEGORIES',
      language: 'hi',
      metadata: { tags: ['Pradushan', 'Shreni', 'MPCB', 'hindi'] },
    },
    {
      title: 'MIDC - What is it and How to Get Plot Allotment',
      content: `MIDC (Maharashtra Industrial Development Corporation) is a government body that develops industrial areas and provides infrastructure to industries.

Benefits of MIDC Location:
- Ready industrial infrastructure (roads, water, drainage, power)
- Simplified clearances through single window
- Property security and maintenance
- MIDC water supply and treatment
- Nearby industrial community and vendors

MIDC Plot Allotment Process:
1. Apply online at midc.maharashtra.gov.in
2. Submit project report, financial details, employment projections
3. MIDC Committee reviews application
4. Plot offered based on availability and sector preference
5. Payment of premium and signing of tripartite agreement
6. Plot possession granted

Key Documents:
- Detailed project report (DPR)
- Financial projections (3-5 years)
- Promoter KYC documents
- Entity registration certificate
- Bank solvency certificate

Timeline: 30-60 days from application to allotment (may vary)

Types of MIDC Schemes:
- General industries
- Food Park
- IT/Software Park
- Textile Park
- Export Processing Zone`,
      source: 'MIDC Official Guidelines',
      category: 'MIDC_RELATED',
      language: 'en',
      metadata: { approvalCodes: ['MIDC_ALLOTMENT'], tags: ['MIDC', 'plot', 'allotment', 'industrial area'] },
    },
    {
      title: 'Shop and Establishment Registration - Maharashtra',
      content: `Under Maharashtra Shops & Establishments (Regulation of Employment and Conditions of Service) Act 2017, all business establishments must register.

Who Must Register:
- ALL commercial establishments regardless of employee count
- Shops, offices, hotels, restaurants, factories (in commercial areas)
- Must register within 60 days of commencement

How to Register:
1. Apply online at mahakamgar.maharashtra.gov.in
2. Fill Form A with establishment details
3. Pay prescribed fee (based on employee count)
4. Certificate issued digitally within 7 days

Information Required:
- Establishment name and address
- Nature of business
- Number of employees
- Employer details

Certificate:
- Valid for 10 years (renewal required)
- Must be displayed prominently in establishment
- Digital certificate acceptable

Fees: Based on employee count (ranges from Rs.100 to Rs.10,000+)

Penalty: Non-registration attracts fine up to Rs.25,000`,
      source: 'Labour Department Maharashtra',
      category: 'LABOUR_COMPLIANCE',
      language: 'en',
      metadata: { approvalCodes: ['LABOUR_SHOPS_EST'], tags: ['Labour', 'Shop', 'Establishment', 'registration'] },
    },
    {
      title: 'Common Application Form (CAF) - How it Works',
      content: `UDYOG MARG's Common Application Form (CAF) is a revolutionary approach to industrial clearances.

What is CAF:
- Single form that collects ALL business and project information ONCE
- Same data reused across multiple department approvals automatically
- No need to re-enter same information for each department

How CAF Works:
1. Fill CAF once with: Promoter details, Entity details, Project details, Location, Financial details
2. System generates a comprehensive checklist of all required approvals
3. Apply to each approval - CAF data pre-fills automatically
4. Documents uploaded once  reused across multiple approvals
5. One-time verified data marked as VERIFIED_REUSABLE - never re-verified

CAF Sections:
- Section A: Promoter/Entrepreneur Details
- Section B: Entity/Company Details  
- Section C: Project Location Details
- Section D: Project Technical Details (Land, Power, Water, Machinery)
- Section E: Financial Details (Investment, Loan, Own Funds)
- Section F: Employment and Social Details

Readiness Score:
- Auto-calculated as you fill the form
- Profile: 25%, Project: 40%, Documents: 35%
- Green (>80%): Ready to submit
- Amber (60-80%): Almost ready
- Red (<60%): More information needed`,
      source: 'UDYOG MARG Platform Help',
      category: 'PLATFORM_HELP',
      language: 'en',
      metadata: { tags: ['CAF', 'Common Application Form', 'how it works', 'guide'] },
    },
    {
      title: 'SLA - Service Level Agreement for Approvals',
      content: `SLA (Service Level Agreement) defines the maximum time within which a department must process your application.

SLA Timelines (Maharashtra Standard):
- Shop & Establishment: 7 days
- Fire NOC: 21 days
- Water NOC (MIDC): 21 days
- Factory License (DISH): 45 days
- MPCB CTE/CTO: 30 days
- MIDC Plot Allotment: 60 days
- Land Use Conversion: 90 days
- EPF/ESIC Registration: 15 days

What Happens if SLA Breaches:
1. System automatically marks application as SLA BREACHED
2. Escalation to HOD (Department Head) immediately
3. After 24 hours: Escalated to DIC (District Industries Centre)
4. After 48 hours: Escalated to State Admin (MSIS)
5. You receive real-time notification at every escalation

Your Rights on SLA Breach:
- File a grievance with urgency marking
- Receive compensation/explanation as per Maharashtra Right to Services Act
- Escalation ensures quicker action

Tracking SLA:
- ON TRACK: Within SLA timeline
- AT RISK: Less than 24 hours remaining
- BREACHED: Timeline expired

Dashboard shows live SLA countdown for every approval.`,
      source: 'Maharashtra Right to Services Act, UDYOG MARG Help',
      category: 'PROCESS_HELP',
      language: 'en',
      metadata: { tags: ['SLA', 'Service Level', 'timeline', 'breach', 'escalation'] },
    },
    {
      title: 'Risk Score - Understanding Your Application Risk Level',
      content: `UDYOG MARG automatically calculates a Risk Score for your application to help prioritize processing.

Risk Score Calculation (0-100):
- Pollution Category: White(0), Green(10), Orange(40), Red(70)
- Hazardous Substances: Yes(+15), No(0)
- Ecologically Sensitive Area: Yes(+10)
- Investment: <25L(0), 25L-1Cr(5), 1Cr-5Cr(10), 5Cr-10Cr(15), >10Cr(20)
- Building Height > 15m: +5
- High Water/Power Usage: +5
- Employees > 500: +5

Risk Levels:
- LOW (0-30): Fast-track eligible, simpler scrutiny
- MEDIUM (31-60): Standard processing, possible desk scrutiny
- HIGH (61-100): Detailed scrutiny, mandatory inspection

Fast-Track Eligibility:
- LOW risk score
- All documents pre-validated
- No hazardous substances
- Profile complete

Benefits of Low Risk:
- Faster processing
- Desk approval (no physical inspection)
- Priority in officer queue

Note: Risk score is for processing purpose only, not a judgment on your business.`,
      source: 'UDYOG MARG Risk Engine Documentation',
      category: 'PROCESS_HELP',
      language: 'en',
      metadata: { tags: ['risk score', 'risk level', 'fast track', 'scrutiny'] },
    },
    {
      title: 'Joint Inspection - Unique Feature',
      content: `Joint Inspection is a unique feature of UDYOG MARG that coordinates inspections across multiple departments.

Problem it Solves:
- Traditional: 3 departments visit separately = 3 different dates, 3 shut-downs, entrepreneur visits 3 times
- UDYOG MARG: All 3 departments visit TOGETHER on ONE date

How Joint Inspection Works:
1. System detects multiple departments need inspection for same application
2. System suggests a common inspection slot
3. Officer availability is checked to prevent conflicts
4. Joint Inspection is scheduled
5. ONE shared report uploaded
6. Report automatically linked to all relevant approvals

Departments that commonly do Joint Inspection:
- MPCB + DISH + Fire (most common combination)
- MPCB + Revenue (for environmental clearance + land)

Benefits:
- Saves entrepreneur time (one visit instead of many)
- Reduces business disruption
- Faster coordinated decision
- Consistent report across departments

How to Request:
- Entrepreneur can request joint inspection from application page
- Department officers can also initiate
- System auto-suggests when multiple inspections pending`,
      source: 'UDYOG MARG Joint Inspection Feature',
      category: 'PLATFORM_HELP',
      language: 'en',
      metadata: { tags: ['joint inspection', 'inspection', 'coordination', 'departments'] },
    },
    {
      title: 'Udyam Registration - MSME Classification',
      content: `Udyam Registration is the official registration for Micro, Small and Medium Enterprises (MSMEs) in India, replacing old UDYOG AADHAAR.

Classification:
Micro Enterprise:
- Investment < Rs.1 Crore AND Turnover < Rs.5 Crore

Small Enterprise:
- Investment < Rs.10 Crore AND Turnover < Rs.50 Crore

Medium Enterprise:
- Investment < Rs.50 Crore AND Turnover < Rs.250 Crore

Benefits of Udyam Registration:
- Priority sector lending by banks
- Lower interest rates on loans
- Government procurement preference (25% reserved for MSMEs)
- MSME schemes eligibility (subsidies, incentives)
- Delayed payment protection under MSMED Act
- Maharashtra-specific MSME incentives

How to Register:
1. Visit udyamregistration.gov.in
2. Use Aadhaar of proprietor/partner/director
3. Self-declaration of investment and turnover
4. Certificate issued immediately (digital)
5. No documents required - purely self-declaration

MSME Schemes in Maharashtra:
- Interest Subsidy Scheme
- Capital Subsidy for Technology Upgradation
- Quality Certification Assistance
- Marketing Assistance`,
      source: 'MSME Ministry, Government of India',
      category: 'MSME_HELP',
      language: 'en',
      metadata: { tags: ['MSME', 'Udyam', 'registration', 'micro', 'small', 'medium'] },
    },
    {
      title: 'GST Registration - When and How',
      content: `GST (Goods and Services Tax) registration is mandatory for businesses crossing threshold limits.

When GST Registration is Mandatory:
- Annual turnover > Rs.40 Lakhs (goods, most states)
- Annual turnover > Rs.20 Lakhs (services, most states)
- Maharashtra: Follow standard thresholds
- Interstate supply (any amount)
- E-commerce operators (any amount)
- Casual taxable persons

When Voluntary Registration is Beneficial:
- Input tax credit (ITC) on purchases
- Credibility with large buyers who require GST invoices
- Government contract eligibility

How to Register:
1. Apply on GST portal (gst.gov.in)
2. PAN mandatory for registration
3. Business documents, bank account, address proof needed
4. ARN (Application Reference Number) generated
5. GST officer may approve or seek clarification
6. GSTIN issued within 3-7 working days (auto-approved if no issues)

Documents Required:
- PAN of entity/promoter
- Aadhaar of promoter/director
- Bank account details
- Address proof of business
- MOA/AOA or partnership deed`,
      source: 'GSTN, Government of India',
      category: 'TAX_COMPLIANCE',
      language: 'en',
      metadata: { tags: ['GST', 'registration', 'GSTIN', 'tax'] },
    },
    {
      title: 'Grievance Redressal - UDYOG MARG',
      content: `UDYOG MARG provides a comprehensive grievance redressal system for entrepreneurs.

When to File Grievance:
- Application stuck without response beyond SLA
- Officer demanding unofficial payments
- Unjustified rejection without proper reasons
- Repeated queries on already-answered matters
- Department not communicating for long periods

Grievance Categories:
- SLA Breach (Application overdue)
- Corruption/Misconduct
- Technical Glitch
- Wrong Rejection
- Harassment

Grievance SLA:
- LOW Priority: 15 days
- MEDIUM Priority: 7 days
- HIGH Priority: 3 days
- CRITICAL Priority: 24 hours

Escalation Levels:
L1: Department HOD (Immediate on filing)
L2: DIC (District Industries Centre) - after 24 hours breach
L3: State Admin / MSIS - after 48 hours breach
L4: Mantralaya Level - for critical unresolved cases

How to File:
1. Go to Grievances section
2. Select application (if related)
3. Choose priority and category
4. Describe issue with attachments
5. Unique ticket number generated (GRV-YYYYMMDD-XXXX)
6. Real-time updates on your dashboard

Track Status: All communications visible on Grievance Detail page`,
      source: 'UDYOG MARG Grievance Module',
      category: 'PLATFORM_HELP',
      language: 'en',
      metadata: { tags: ['grievance', 'complaint', 'redressal', 'escalation'] },
    },
    {
      title: 'Compliance Calendar - Post-Approval Requirements',
      content: `After receiving approvals, entrepreneurs must comply with renewal and ongoing compliance requirements.

Key Compliance Items:
MPCB CTO Renewal:
- Annual renewal with latest compliance certificate
- ETP performance report submission
- Water/Air quality monitoring reports

Factory License Renewal:
- Annual renewal before expiry
- Accident/incident reporting
- Form 21/22 submission to DISH

Fire NOC Renewal:
- Annual renewal
- Fire drill records
- Equipment maintenance certificates

Labour Compliances:
- Monthly PF/ESI returns
- Annual returns under various labour acts
- Minimum wages compliance

UDYOG MARG Compliance Calendar Features:
- Auto-created on approval
- Reminder notifications: 30, 15, 7, 3, 1 days before due date
- SMS + In-app notifications
- Easy renewal application from compliance page
- Status tracking (TRACKING, DUE, OVERDUE)

Penalty for Non-Compliance:
- CTO expiry without renewal: Factory may be sealed
- Factory License expiry: Operations must stop
- Labour non-compliance: Fines under respective acts

Stay ahead with the Compliance Calendar dashboard.`,
      source: 'UDYOG MARG Compliance Module',
      category: 'COMPLIANCE',
      language: 'en',
      metadata: { tags: ['compliance', 'renewal', 'calendar', 'post-approval'] },
    },
    {
      title: 'Food Processing Industry - Special Requirements',
      content: `Food Processing is a key sector in Maharashtra. Special requirements apply.

Key Approvals for Food Processing:
1. Factory License (DISH) - If 10+ workers
2. FSSAI License (Central/State based on turnover)
3. MPCB CTE/CTO (if effluent generated)
4. Fire NOC (if applicable)
5. Shop & Establishment Registration

FSSAI License Types:
- Basic Registration: Turnover < Rs.12 Lakhs/year (State Dept)
- State License: Turnover Rs.12L - Rs.20Cr (FSSAI State)
- Central License: Turnover > Rs.20 Cr (FSSAI Central)

MPCB for Food Processing:
- Dairy, fruit processing, cold storage  Green Category
- Meat processing, fish  Orange Category
- Alcohol/Distillery  Red Category

Key Documents for Food Processing:
- FSSAI application and license
- Food safety management plan (HACCP)
- Water testing report (potable water)
- Pest control arrangement
- Staff medical fitness certificates

Maharashtra Food Park (MOFPA):
- Special food parks with shared infrastructure
- Common facility centers (cold chain, testing labs)
- Subsidized plots and utilities
- Apply through Industries Department`,
      source: 'FSSAI, MPCB, Industries Department Maharashtra',
      category: 'SECTOR_SPECIFIC',
      language: 'en',
      metadata: { tags: ['food processing', 'FSSAI', 'sector specific'] },
    },
    {
      title: 'Investment and Project Cost - Classification',
      content: `Understanding investment classification helps determine applicable schemes and approvals.

Investment Buckets for Maharashtra:
Micro (MSME):
- Plant & Machinery + Equipment Investment < Rs.1 Crore
- OR Service sector investment < Rs.1 Crore

Small (MSME):  
- Plant & Machinery Investment: Rs.1 Crore - Rs.10 Crore

Medium (MSME):
- Plant & Machinery Investment: Rs.10 Crore - Rs.50 Crore

Large Industry:
- Investment > Rs.50 Crore

Mega Project:
- Fixed Capital Investment > Rs.750 Crore (as per GR)

For Risk Score Calculation:
- Investment includes: Plant & Machinery + Building & Civil Works
- Working capital NOT included in investment for classification

For Maharashtra Incentives:
- D/D+ Category Districts: Higher subsidy percentages
- MIDC location: Stamp duty exemption available
- Higher investment = Higher scrutiny (risk score increases)

Financial Documents Needed:
- Project Cost Statement (itemized)
- Means of Finance (own funds + loan)
- Bank sanction letter (if applicable)
- Techno-economic feasibility report (for large projects)`,
      source: 'Maharashtra Industrial Policy 2019, MSME Ministry',
      category: 'INVESTMENT_GUIDE',
      language: 'en',
      metadata: { tags: ['investment', 'project cost', 'MSME', 'classification', 'schemes'] },
    },
    {
      title: 'Environmental Impact Assessment (EIA)',
      content: `Environmental Impact Assessment may be required for certain categories of projects.

When EIA is Required:
- Red category industries with investment > Rs.5 Crore
- Projects in ecologically sensitive areas
- Coastal regulation zone projects
- Large infrastructure projects

EIA Process:
1. Screening (Is EIA required?)
2. Scoping (Define study parameters)
3. Baseline data collection (6-12 months)
4. Impact assessment and mitigation measures
5. Public consultation (mandatory for Category A)
6. Submit to SEIAA (State EIA Authority)/MoEF
7. Appraisal and Environmental Clearance (EC)

Types:
- Category A: Central government (MoEF&CC), EIA mandatory
- Category B1: State SEIAA, EIA mandatory  
- Category B2: State SEIAA, EIA may be waived

Maharashtra SEIAA: State Environment Impact Assessment Authority

If EC Required: Must be obtained BEFORE applying for MPCB CTE

Timeline: 6 months to 2+ years (depending on complexity)

This is an important step that must be done FIRST for large/ecologically sensitive projects.`,
      source: 'EIA Notification 2006, Maharashtra SEIAA',
      category: 'ENVIRONMENT_COMPLIANCE',
      language: 'en',
      metadata: { tags: ['EIA', 'Environmental Impact Assessment', 'SEIAA', 'environmental clearance'] },
    },
    {
      title: 'Online Portals for Maharashtra Industrial Clearances',
      content: `Key online portals for industrial clearances in Maharashtra:

1. Udyog Marg (This Platform):
   - Single window for all clearances
   - udyogmarg.maharashtra.gov.in

2. MAHA Aaple Sarkar / Maha e-Seva:
   - Various government services
   - aaplesarkar.mahaonline.gov.in

3. MPCB Online:
   - CTE/CTO applications
   - mpcb.gov.in/online

4. DISH Portal:
   - Factory Registration
   - mahakamgar.maharashtra.gov.in

5. MIDC Portal:
   - Plot allotment, services
   - midc.maharashtra.gov.in

6. Maharashtra Udyog Mitra:
   - Investment facilitation
   - udyogmitra.maharashtra.gov.in

7. GST Portal:
   - gst.gov.in

8. Udyam Registration:
   - udyamregistration.gov.in

9. FSSAI Portal:
   - foscos.fssai.gov.in

10. MSEDCL (Power):
    - mahadiscom.in

Keep these portals bookmarked. UDYOG MARG helps navigate and track all submissions in one place.`,
      source: 'Maharashtra Government Portals',
      category: 'PLATFORM_HELP',
      language: 'en',
      metadata: { tags: ['portals', 'online', 'government', 'websites', 'resources'] },
    },
    {
      title: 'Maharashtra Districts - Industrial Zones',
      content: `Maharashtra has diverse industrial zones across districts. Key industrial districts:

Pune Division:
- Pune: IT, Automotive, Engineering, Electronics
  Key Areas: Pimpri-Chinchwad, Bhosari MIDC, Ranjangaon MIDC
- Nashik: Wine, Engineering, Pharma, Agro-processing
  Key Areas: Satpur MIDC, Ambad MIDC

Konkan Division:
- Mumbai: BFSI, IT, Services, Small Manufacturing
- Raigad: Chemicals, Petrochemicals, Pharma
  Key Areas: Taloja, Patalganga, Roha MIDC
- Thane: Chemicals, Engineering, Pharma
  Key Areas: Dombivli MIDC, Ambernath MIDC

Aurangabad Division:
- Aurangabad: Automotive (Skoda, Bajaj), Pharma
  Key Areas: Chikalthana MIDC, Shendra MIDC
  
Nagpur Division:
- Nagpur: Agro-processing, Textiles, IT, Mining
  Key Areas: Butibori MIDC, Hingna MIDC

Kolhapur Division:
- Kolhapur: Engineering, Foundry, Sugar, Textiles
  Key Areas: Shiroli MIDC, Kagal MIDC

Investment Incentives by Zone:
- Zone A (Mumbai, Pune, Thane): Minimal incentives
- Zone B: 20% incentive package
- Zone C/D: 30-45% incentive package
- D+ category districts: Maximum incentives`,
      source: 'Maharashtra Industries Department, MIDC District Guide',
      category: 'DISTRICT_INFO',
      language: 'en',
      metadata: { tags: ['districts', 'industrial zones', 'MIDC', 'Maharashtra geography'] },
    },
    {
      title: 'MAHA-MITRA: Your AI Regulatory Assistant',
      content: `MAHA-MITRA is UDYOG MARG's AI-powered regulatory knowledge assistant.

What MAHA-MITRA Can Help With:
- Explain any approval (CTE, CTO, Factory License, etc.)
- Tell you which approvals apply to your project
- Guide you through documentation requirements
- Answer compliance questions
- Explain government schemes and eligibility
- Translate answers in Hindi and Marathi
- Provide act and rule references

How MAHA-MITRA Works:
1. You ask a question (in English, Hindi, or Marathi)
2. MAHA-MITRA searches its knowledge base (RAG)
3. Uses AI to provide accurate, sourced answers
4. Shows the source document/act for every answer
5. Provides confidence level
6. If logged in, can give personalized answers based on YOUR application

MAHA-MITRA Guardrails:
- Never provides false legal advice
- Always shows sources and citations
- Recommends professional consultation for complex matters
- Will not guess on compliance-critical matters

Limitations:
- Provides information, not legal opinion
- Rules may change - always verify with official sources
- For application-specific guidance, consult your assigned officer

Sample Questions to Ask:
- "CTE aur CTO mein kya antar hai?" (Hindi)
- "What documents are needed for Factory License?"
- "Is my food processing unit exempt from MPCB?"
- "What schemes am I eligible for?"`,
      source: 'UDYOG MARG MAHA-MITRA Documentation',
      category: 'PLATFORM_HELP',
      language: 'en',
      metadata: { tags: ['MAHA-MITRA', 'AI', 'chatbot', 'regulatory', 'assistant'] },
    },
  ];

  for (const chunk of knowledgeChunks) {
    await prisma.knowledgeChunk.create({
      data: {
        ...chunk,
        metadata: chunk.metadata as any,
      },
    });
  }
  console.log('✅ Knowledge Chunks created:', knowledgeChunks.length);

  // ===================== DEMO APPLICATION =====================
  const entrepreneur = users['entrepreneur.demo@mahsetu.in'];
  const demoApp = await prisma.application.create({
    data: {
      applicationNo: 'APP-MH-PUN-2025-000001',
      userId: entrepreneur.id,
      districtId: districts['Pune'].id,
      businessName: 'Sharma Food Industries Pvt Ltd',
      entityType: 'PRIVATE_LIMITED',
      businessStage: 'PRE_ESTABLISHMENT',
      sector: 'FOOD_PROCESSING',
      subSector: 'Fruit & Vegetable Processing',
      locationType: 'MIDC',
      talukaName: 'Haveli',
      addressLine1: 'Plot No. 45, Bhosari MIDC',
      addressLine2: 'Pune',
      pincode: '411026',
      projectDetailsJson: {
        landAreaSqm: 5000,
        builtUpAreaSqm: 3000,
        buildingHeight: 12,
        powerKW: 500,
        waterRequirementKLD: 50,
        totalInvestmentLakhs: 200,
        plantMachineryInvestmentLakhs: 120,
        buildingInvestmentLakhs: 80,
        estimatedEmployees: 80,
        pollutionCategory: 'ORANGE',
        hasHazardousSubstances: false,
        ecologicallySensitive: false,
        sector: 'FOOD_PROCESSING',
        subSector: 'Fruit & Vegetable Processing',
        products: ['Tomato Puree', 'Fruit Juice', 'Pickles'],
        annualTurnoverProjectedLakhs: 600,
      },
      riskScore: 50,
      riskLevel: 'MEDIUM',
      requiresDetailedScrutiny: false,
      fastTrackEligible: false,
      overallStatus: 'SUBMITTED',
      currentStage: 'UNDER_PROCESS',
      readinessScore: 85,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      timeline: [
        {
          action: 'APPLICATION_CREATED',
          by: 'Rajesh Sharma',
          byId: entrepreneur.id,
          at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          note: 'Application created via UDYOG MARG',
        },
        {
          action: 'APPLICATION_SUBMITTED',
          by: 'Rajesh Sharma',
          byId: entrepreneur.id,
          at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          note: 'Application submitted for processing',
        },
      ],
    },
  });

  // Create ApplicationApprovals for demo
  const approvalSpecs = [
    { code: 'MPCB_CTE', status: 'UNDER_SCRUTINY', slaDays: 30, assignedEmail: 'mpcb.officer@mahsetu.in' },
    { code: 'FACTORY_LICENSE', status: 'SUBMITTED', slaDays: 45, assignedEmail: 'dish.officer@mahsetu.in' },
    { code: 'FIRE_NOC', status: 'SUBMITTED', slaDays: 21, assignedEmail: 'fire.officer@mahsetu.in' },
    { code: 'LABOUR_SHOPS_EST', status: 'APPROVED', slaDays: 7, assignedEmail: 'labour.officer@mahsetu.in' },
    { code: 'EPF_REGISTRATION', status: 'SUBMITTED', slaDays: 15, assignedEmail: 'labour.officer@mahsetu.in' },
  ];

  for (const spec of approvalSpecs) {
    const master = approvalMasters[spec.code];
    if (!master) continue;
    const assignedOfficer = users[spec.assignedEmail];
    const submittedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const slaDueAt = new Date(submittedAt.getTime() + spec.slaDays * 24 * 60 * 60 * 1000);

    await prisma.applicationApproval.create({
      data: {
        applicationId: demoApp.id,
        approvalMasterId: master.id,
        departmentId: master.departmentId,
        assignedOfficerId: assignedOfficer?.id,
        status: spec.status as any,
        slaStatus: 'ON_TRACK',
        slaDays: spec.slaDays,
        slaDueAt,
        startedAt: spec.status !== 'SUBMITTED' ? submittedAt : null,
        completedAt: spec.status === 'APPROVED' ? new Date() : null,
        workflowHistory: [
          {
            action: 'SUBMIT',
            by: 'Rajesh Sharma',
            byId: entrepreneur.id,
            at: submittedAt.toISOString(),
            fromStatus: 'DRAFT',
            toStatus: 'SUBMITTED',
          },
          ...(spec.status !== 'SUBMITTED' ? [{
            action: 'ASSIGN',
            by: assignedOfficer?.name || 'System',
            byId: assignedOfficer?.id || null,
            at: new Date(submittedAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            fromStatus: 'SUBMITTED',
            toStatus: 'ASSIGNED',
          }] : []),
        ],
      },
    });
  }

  console.log('✅ Demo Application created with approvals');
  console.log('\n🎉 SEED COMPLETE!\n');
  console.log('Demo Credentials (all use OTP: 123456):');
  console.log('  Entrepreneur:  entrepreneur.demo@mahsetu.in');
  console.log('  MPCB Officer:  mpcb.officer@mahsetu.in');
  console.log('  DISH Officer:  dish.officer@mahsetu.in');
  console.log('  Fire Officer:  fire.officer@mahsetu.in');
  console.log('  Labour Officer: labour.officer@mahsetu.in');
  console.log('  DIC Officer:   dic.pune@mahsetu.in');
  console.log('  State Admin:   admin.msis@mahsetu.in');
  console.log('  Grievance:     grievance@mahsetu.in');
}

main()
  .catch((e) => {
    console.error(' Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
