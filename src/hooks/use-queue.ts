
'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Patient, Priority, QueueStats, PatientWithWaitTime } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { monitorQueueAndAlert } from '@/ai/flows/realtime-queue-alerts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


const AVG_SERVICE_TIME = 15; // Average service time in minutes
const CRITICAL_WAIT_THRESHOLD = 20; // 20 minutes for critical patients

const priorityOrder: Record<Priority, number> = {
  Critical: 1,
  High: 2,
  Medium: 3,
  Low: 4,
};

export function useQueue() {
  const firestore = useFirestore();
  const patientsCollection = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: patientsFromDb, isLoading } = useCollection<Patient>(patientsCollection);
  
  const [staffCount, setStaffCount] = useState(5);
  const { toast } = useToast();

  const patients = useMemo(() => patientsFromDb || [], [patientsFromDb]);

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.registrationTime).getTime() - new Date(b.registrationTime).getTime();
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
    const newPatient = {
        ...newPatientData,
        tokenNumber: 100 + (patients?.length || 0) + 1,
        registrationTime: new Date().toISOString(),
    };
    addDocumentNonBlocking(patientsCollection, newPatient);

    toast({
      title: "Patient Registered",
      description: `${newPatientData.name} has been added to the queue with ${newPatientData.priority} priority.`,
    })
  }, [patients, patientsCollection, toast]);

  const updatePriority = useCallback((patientId: string, priority: Priority) => {
    const patientDocRef = doc(firestore, 'patients', patientId);
    updateDocumentNonBlocking(patientDocRef, { priority });

    const patient = patients.find(p => p.id === patientId);
    if(patient) {
        toast({
            title: "Priority Updated",
            description: `${patient.name}'s priority has been changed to ${priority}.`,
        });
    }
  }, [firestore, patients, toast]);

  const simulatePatientSurge = useCallback(() => {
    const surgePatients: Omit<Patient, 'id'>[] = [
      { tokenNumber: 201, name: 'Surge Patient A', age: 50, symptomDescription: 'Difficulty breathing', priority: 'Critical', registrationTime: new Date().toISOString() },
      { tokenNumber: 202, name: 'Surge Patient B', age: 33, symptomDescription: 'Broken arm', priority: 'High', registrationTime: new Date().toISOString() },
      { tokenNumber: 203, name: 'Surge Patient C', age: 41, symptomDescription: 'Migraine', priority: 'Medium', registrationTime: new Date().toISOString() },
    ];
    surgePatients.forEach(p => {
        const patientWithToken = { ...p, tokenNumber: 100 + (patients?.length || 0) + 1 + Math.random() };
        addDocumentNonBlocking(patientsCollection, patientWithToken)
    });

    toast({
        title: "Simulation: Patient Surge",
        description: "Patient volume has significantly increased.",
        variant: "destructive",
    });
  }, [patients, patientsCollection, toast]);

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
        const registrationTime = new Date(p.registrationTime).getTime();
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
    isLoading,
    stats,
    addPatient,
    updatePriority,
    simulatePatientSurge,
    simulateStaffDrop,
    checkQueueAlerts,
  };
}
