
'use client';

import { useState, useMemo, useCallback } from 'react';
import { initialPatients } from '@/lib/data';
import type { Patient, Priority, QueueStats, PatientWithWaitTime } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { monitorQueueAndAlert } from '@/ai/flows/realtime-queue-alerts';

const AVG_SERVICE_TIME = 15; // Average service time in minutes
const CRITICAL_WAIT_THRESHOLD = 20; // 20 minutes for critical patients

const priorityOrder: Record<Priority, number> = {
  Critical: 1,
  High: 2,
  Medium: 3,
  Low: 4,
};

export function useQueue() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [staffCount, setStaffCount] = useState(5);
  const { toast } = useToast();

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.registrationTime.getTime() - b.registrationTime.getTime();
    });
  }, [patients]);

  const patientsWithWaitTime = useMemo<PatientWithWaitTime[]>(() => {
    return sortedPatients.map((patient, index) => ({
      ...patient,
      estimatedWaitTime: (index * AVG_SERVICE_TIME) / Math.max(1, staffCount),
    }));
  }, [sortedPatients, staffCount]);

  const stats = useMemo<QueueStats>(() => {
    const totalWaitTime = patientsWithWaitTime.reduce((acc, p) => acc + p.estimatedWaitTime, 0);
    return {
      totalPatients: patients.length,
      avgWaitTime: patients.length > 0 ? totalWaitTime / patients.length : 0,
      criticalCount: patients.filter(p => p.priority === 'Critical').length,
      staffCount: staffCount,
    };
  }, [patients, patientsWithWaitTime, staffCount]);

  const addPatient = useCallback((newPatientData: Omit<Patient, 'id' | 'tokenNumber' | 'registrationTime'>) => {
    setPatients(prev => {
      const newPatient: Patient = {
        ...newPatientData,
        id: `p${prev.length + 10}`,
        tokenNumber: 100 + prev.length + 1,
        registrationTime: new Date(),
      };
      return [...prev, newPatient];
    });
    toast({
      title: "Patient Registered",
      description: `${newPatientData.name} has been added to the queue with ${newPatientData.priority} priority.`,
    })
  }, [toast]);

  const updatePriority = useCallback((patientId: string, priority: Priority) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, priority } : p));
    const patient = patients.find(p => p.id === patientId);
    if(patient) {
        toast({
            title: "Priority Updated",
            description: `${patient.name}'s priority has been changed to ${priority}.`,
        });
    }
  }, [patients, toast]);

  const simulatePatientSurge = useCallback(() => {
    const surgePatients: Patient[] = [
      { id: `p${patients.length + 20}`, tokenNumber: 201, name: 'Surge Patient A', age: 50, symptoms: 'Difficulty breathing', priority: 'Critical', registrationTime: new Date() },
      { id: `p${patients.length + 21}`, tokenNumber: 202, name: 'Surge Patient B', age: 33, symptoms: 'Broken arm', priority: 'High', registrationTime: new Date() },
      { id: `p${patients.length + 22}`, tokenNumber: 203, name: 'Surge Patient C', age: 41, symptoms: 'Migraine', priority: 'Medium', registrationTime: new Date() },
    ];
    setPatients(prev => [...prev, ...surgePatients]);
    toast({
        title: "Simulation: Patient Surge",
        description: "Patient volume has significantly increased.",
        variant: "destructive",
    });
  }, [patients.length, toast]);

  const simulateStaffDrop = useCallback(() => {
    setStaffCount(prev => Math.max(1, Math.floor(prev * 0.6)));
    toast({
        title: "Simulation: Staff Drop",
        description: "Staff availability reduced by 40%.",
        variant: "destructive",
    });
  }, [toast]);

  const checkQueueAlerts = useCallback(async () => {
    const queueDataForAI = sortedPatients
      .filter(p => p.priority === 'Critical')
      .map((p) => {
        const now = new Date().getTime();
        const registrationTime = p.registrationTime.getTime();
        const waitTime = (now - registrationTime) / (1000 * 60); // in minutes
        return {
          patientId: p.id,
          priority: p.priority,
          waitTime: Math.round(waitTime),
        };
      });

    if (queueDataForAI.length === 0) return;

    try {
      const result = await monitorQueueAndAlert({
        criticalPatientWaitTimeThreshold: CRITICAL_WAIT_THRESHOLD,
        queueData: queueDataForAI,
      });

      result.alerts?.forEach(alert => {
        const patient = patients.find(p => p.id === alert.patientId);
        toast({
          title: `🚨 Critical Alert for ${patient?.name || alert.patientId}`,
          description: alert.message,
          variant: "destructive",
          duration: 10000,
        });
      });
    } catch (error) {
      console.error("Error checking queue alerts:", error);
    }
  }, [sortedPatients, toast, patients]);


  return {
    patients: patientsWithWaitTime,
    stats,
    addPatient,
    updatePriority,
    simulatePatientSurge,
    simulateStaffDrop,
    checkQueueAlerts,
  };
}
