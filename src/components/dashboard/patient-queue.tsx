'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { PatientWithWaitTime, Priority } from '@/lib/types';
import { cn, formatWaitTime } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PatientQueueProps {
  patients: PatientWithWaitTime[];
  onUpdatePriority: (patientId: string, priority: Priority) => void;
}

const priorityVariantMap: Record<Priority, 'destructive' | 'default' | 'secondary' | 'outline'> = {
  Critical: 'destructive',
  High: 'default',
  Medium: 'secondary',
  Low: 'outline',
};

const priorityColorClass: Record<Priority, string> = {
    Critical: "bg-red-100 dark:bg-red-900/30",
    High: "bg-teal-100/60 dark:bg-teal-900/30",
    Medium: "bg-amber-100/60 dark:bg-amber-900/30",
    Low: "bg-gray-100 dark:bg-gray-800/30",
};


export function PatientQueue({ patients, onUpdatePriority }: PatientQueueProps) {
  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader>
        <CardTitle>Patient Queue</CardTitle>
        <CardDescription>Live view of patients sorted by triage priority.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <Table>
            <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                <TableHead className="w-[80px]">Token</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Symptoms</TableHead>
                <TableHead className="text-right">Wait Time</TableHead>
                <TableHead className="w-[120px] text-center">Priority</TableHead>
                <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.length > 0 ? (
                patients.map((patient) => (
                    <TableRow key={patient.id} className={cn("transition-colors", priorityColorClass[patient.priority])}>
                    <TableCell className="font-medium">{patient.tokenNumber}</TableCell>
                    <TableCell>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.age} years old</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">{patient.symptoms}</TableCell>
                    <TableCell className="text-right">{formatWaitTime(patient.estimatedWaitTime)}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={priorityVariantMap[patient.priority]} className="capitalize">
                        {patient.priority}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onUpdatePriority(patient.id, 'Critical')}>Set as Critical</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdatePriority(patient.id, 'High')}>Set as High</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdatePriority(patient.id, 'Medium')}>Set as Medium</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdatePriority(patient.id, 'Low')}>Set as Low</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No patients in the queue.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
