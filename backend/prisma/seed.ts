import { PrismaClient, Role, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with rich dummy data...');

  // Clean existing data
  await prisma.applicationHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Companies
  const company1 = await prisma.user.create({
    data: {
      email: 'hr@techcorp.id',
      password: hashedPassword,
      name: 'TechCorp Indonesia',
      role: Role.COMPANY,
    },
  });

  const company2 = await prisma.user.create({
    data: {
      email: 'careers@indodigital.co.id',
      password: hashedPassword,
      name: 'IndoDigital Media Group',
      role: Role.COMPANY,
    },
  });

  const company3 = await prisma.user.create({
    data: {
      email: 'recruitment@nusantara-fintech.com',
      password: hashedPassword,
      name: 'Nusantara FinTech Global',
      role: Role.COMPANY,
    },
  });

  console.log('✅ Created 3 Company Accounts.');

  // 2. Create Job Seekers
  const seeker1 = await prisma.user.create({
    data: {
      email: 'budi@gmail.com',
      password: hashedPassword,
      name: 'Budi Santoso',
      role: Role.JOB_SEEKER,
    },
  });

  const seeker2 = await prisma.user.create({
    data: {
      email: 'siti.rahma@yahoo.com',
      password: hashedPassword,
      name: 'Siti Rahmawati',
      role: Role.JOB_SEEKER,
    },
  });

  const seeker3 = await prisma.user.create({
    data: {
      email: 'ahmad.rizky@gmail.com',
      password: hashedPassword,
      name: 'Ahmad Rizky Pratama',
      role: Role.JOB_SEEKER,
    },
  });

  console.log('✅ Created 3 Job Seeker Accounts.');

  // 3. Create Jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Full Stack Developer (React + Node.js)',
      description: 'Bertanggung jawab membangun aplikasi web backend (Node.js/Express) dan frontend (React/TypeScript). Pengalaman REST API dan Prisma ORM diutamakan.',
      companyName: company1.name,
      location: 'Jakarta Selatan (Hybrid)',
      salary: 'Rp 12.000.000 - Rp 18.000.000',
      jobType: 'Full-time',
      companyId: company1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Frontend Engineer (React + TS)',
      description: 'Mendesain dan mengimplementasikan UI/UX modern, responsif, dan performan tinggi menggunakan Vite, React, TailwindCSS, dan TypeScript.',
      companyName: company1.name,
      location: 'Bandung (Remote)',
      salary: 'Rp 10.000.000 - Rp 15.000.000',
      jobType: 'Remote',
      companyId: company1.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'Backend Node.js Engineer',
      description: 'Mengembangkan microservices, integrasi PostgreSQL, Redis, dan pengujian unit API backend.',
      companyName: company1.name,
      location: 'Jakarta Pusat',
      salary: 'Rp 11.000.000 - Rp 16.000.000',
      jobType: 'Contract',
      companyId: company1.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'Senior UI/UX Designer',
      description: 'Membuat wireframe, prototype interaktif di Figma, serta melakukan usability testing untuk aplikasi mobile dan web perbankan digital.',
      companyName: company2.name,
      location: 'Surabaya (Hybrid)',
      salary: 'Rp 9.000.000 - Rp 14.000.000',
      jobType: 'Full-time',
      companyId: company2.id,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'DevOps & Cloud Infrastructure Engineer',
      description: 'Mengelola cluster Kubernetes, CI/CD pipeline dengan GitHub Actions, serta monitoring infrastruktur AWS cloud.',
      companyName: company3.name,
      location: 'Jakarta Barat (Remote)',
      salary: 'Rp 18.000.000 - Rp 25.000.000',
      jobType: 'Remote',
      companyId: company3.id,
    },
  });

  const job6 = await prisma.job.create({
    data: {
      title: 'QA Automation Engineer',
      description: 'Menulis skrip otomatisasi pengujian API dan E2E menggunakan Playwright/Cypress dan Jest.',
      companyName: company3.name,
      location: 'Tangerang',
      salary: 'Rp 8.500.000 - Rp 12.000.000',
      jobType: 'Full-time',
      companyId: company3.id,
    },
  });

  console.log('✅ Created 6 Sample Job Postings.');

  // 4. Create Applications & History Logs
  // App 1: Budi -> Full Stack Developer (TechCorp) - REVIEWING
  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      seekerId: seeker1.id,
      status: ApplicationStatus.REVIEWING,
    },
  });

  await prisma.applicationHistory.createMany({
    data: [
      {
        applicationId: app1.id,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        changedById: seeker1.id,
        notes: 'Melamar lowongan pekerjaan ini.',
      },
      {
        applicationId: app1.id,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.REVIEWING,
        changedById: company1.id,
        notes: 'Berkas CV dan portofolio sedang ditinjau tim HR TechCorp.',
      },
    ],
  });

  // App 2: Budi -> Frontend Engineer (TechCorp) - SHORTLISTED
  const app2 = await prisma.application.create({
    data: {
      jobId: job2.id,
      seekerId: seeker1.id,
      status: ApplicationStatus.SHORTLISTED,
    },
  });

  await prisma.applicationHistory.createMany({
    data: [
      {
        applicationId: app2.id,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        changedById: seeker1.id,
        notes: 'Melamar pekerjaan.',
      },
      {
        applicationId: app2.id,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.REVIEWING,
        changedById: company1.id,
        notes: 'Ditinjau oleh Lead Frontend.',
      },
      {
        applicationId: app2.id,
        fromStatus: ApplicationStatus.REVIEWING,
        toStatus: ApplicationStatus.SHORTLISTED,
        changedById: company1.id,
        notes: 'Kandidat masuk daftar pendek untuk wawancara teknis.',
      },
    ],
  });

  // App 3: Siti -> Senior UI/UX Designer (IndoDigital) - ACCEPTED
  const app3 = await prisma.application.create({
    data: {
      jobId: job4.id,
      seekerId: seeker2.id,
      status: ApplicationStatus.ACCEPTED,
    },
  });

  await prisma.applicationHistory.createMany({
    data: [
      {
        applicationId: app3.id,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        changedById: seeker2.id,
        notes: 'Melamar lowongan UI/UX.',
      },
      {
        applicationId: app3.id,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.SHORTLISTED,
        changedById: company2.id,
        notes: 'Portofolio desain luar biasa.',
      },
      {
        applicationId: app3.id,
        fromStatus: ApplicationStatus.SHORTLISTED,
        toStatus: ApplicationStatus.ACCEPTED,
        changedById: company2.id,
        notes: 'Selamat! Penawaran kerja (Offering letter) telah dikirim.',
      },
    ],
  });

  // App 4: Ahmad -> DevOps (Nusantara FinTech) - APPLIED
  const app4 = await prisma.application.create({
    data: {
      jobId: job5.id,
      seekerId: seeker3.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.applicationHistory.create({
    data: {
      applicationId: app4.id,
      fromStatus: null,
      toStatus: ApplicationStatus.APPLIED,
      changedById: seeker3.id,
      notes: 'Melamar lowongan DevOps.',
    },
  });

  console.log('✅ Created 4 Applications with detailed Audit Trail Histories.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
