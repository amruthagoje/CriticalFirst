'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Patient, Priority } from '@/lib/types';
import { semanticTriage } from '@/ai/flows/semantic-triage';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(0, { message: 'Age must be a positive number.' }).max(120),
  symptoms: z.string().min(10, { message: 'Symptom description must be at least 10 characters.' }),
});

type PatientFormValues = z.infer<typeof formSchema>;

interface PatientRegistrationFormProps {
  onAddPatient: (patient: Omit<Patient, 'id' | 'tokenNumber' | 'registrationTime'>) => void;
}

export function PatientRegistrationForm({ onAddPatient }: PatientRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
      symptoms: '',
    },
  });

  async function onSubmit(values: PatientFormValues) {
    setIsSubmitting(true);
    try {
      // Online: AI-assisted triage
      const triageResult = await semanticTriage({ symptomDescription: values.symptoms });
      const priority = triageResult.priority;
      onAddPatient({ ...values, priority });
      form.reset();
    } catch (error) {
      console.error("AI Triage failed, using fallback:", error);
      // Offline fallback: rule-based (simplified here)
      const priorities: Priority[] = ['Low', 'Medium', 'High'];
      const randomPriority = priorities[Math.floor(Math.random() * 3)];
      onAddPatient({ ...values, priority: randomPriority });
      form.reset();
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>Enter patient details to add them to the queue.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 42" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptom Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe patient's symptoms..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Add to Queue'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
