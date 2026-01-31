'use client';

import { useEffect } from 'react';
import { useQueue } from '@/hooks/use-queue';
import { PatientQueue } from '@/components/dashboard/patient-queue';
import { PatientRegistrationForm } from '@/components/dashboard/patient-registration-form';
import { AdminPanel } from '@/components/dashboard/admin-panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { BarChart, Users, AlertTriangle, Clock } from 'lucide-react';
import { formatWaitTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


export default function DashboardPage() {
  const { 
    patients, 
    isLoading,
    stats, 
    addPatient, 
    updatePriority, 
    simulatePatientSurge, 
    simulateStaffDrop,
    checkQueueAlerts,
  } = useQueue();
  
  useEffect(() => {
    const interval = setInterval(() => {
        checkQueueAlerts();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkQueueAlerts]);

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Avg. Wait Time" value={formatWaitTime(stats.avgWaitTime)} icon={Clock} />
        <StatCard title="Total Patients" value={stats.totalPatients.toString()} icon={BarChart} />
        <StatCard title="Critical Patients" value={stats.criticalCount.toString()} icon={AlertTriangle} variant={stats.criticalCount > 0 ? "destructive" : "default"} />
        <StatCard title="Active Staff" value={stats.staffCount.toString()} icon={Users} />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
           {isLoading ? <Skeleton className="h-[70vh] w-full" /> : <PatientQueue patients={patients} onUpdatePriority={updatePriority} />}
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <PatientRegistrationForm onAddPatient={addPatient} />
            <AdminPanel onPatientSurge={simulatePatientSurge} onStaffDrop={simulateStaffDrop} />
        </div>
      </div>
    </div>
  );
}
