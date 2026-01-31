import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Zap } from 'lucide-react';

interface AdminPanelProps {
  onPatientSurge: () => void;
  onStaffDrop: () => void;
}

export function AdminPanel({ onPatientSurge, onStaffDrop }: AdminPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Simulation</CardTitle>
        <CardDescription>
          Trigger system-wide mutations to test queue resilience.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={onPatientSurge} variant="outline">
          <Zap className="mr-2 h-4 w-4" />
          Simulate Patient Surge
        </Button>
        <Button onClick={onStaffDrop} variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Simulate Staff Drop
        </Button>
      </CardContent>
    </Card>
  );
}
