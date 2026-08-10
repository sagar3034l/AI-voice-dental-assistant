import { useGetDoctors } from '@/hooks/use-doctors'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Edit, EditIcon, Icon, MailIcon, PhoneIcon, PlusIcon, Stethoscope, StethoscopeIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import AddDoctorDialog from './AddDoctorDialog';
import EditDoctorDialog from './EditDoctorDialog';
import { Doctor } from '@/app/generated/prisma/browser';

function DoctorsManagement() {
    const { data: doctors = [] } = useGetDoctors();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

    const handleEditDoctor = (doctor:Doctor) => { 
        setSelectedDoctor(doctor);
        setIsEditDialogOpen(true)
    };

    const handleCloseEditDoctor = () => { 
        setIsEditDialogOpen(false)
        setSelectedDoctor(null)
    };

    return (
        <div>
            <Card className='mb-12'>
                <CardHeader className='flex items-center justify-between'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <StethoscopeIcon className='size-5 text-primary' />
                            Doctors Management
                        </CardTitle>
                        <CardDescription>
                            Manage and oversee all doctors in your practice
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                        <PlusIcon className='mr-2 size-4' />
                        Add doctor
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {doctors.map((doc) => (
                            <div key={doc.id} className='flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50'>
                                <div className='flex items-center gap-4'>
                                    <img
                                        src={doc.imageUrl}
                                        alt='doctor-image'
                                        className='size-12 rounded-full object-cover ring-2 ring-background' 
                                    />

                                    <div>
                                        <div className='font-semibold'>
                                            {doc.name}
                                        </div>
                                        <div className='text-sm text-muted-foreground'>
                                            {doc.speciality}
                                            <span className='ml-2 px-2 py-0.5 bg-muted rounded text-xs'>
                                                {doc.gender === "MALE" ? "Male" : "Female"}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-4 mt-1'>
                                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                                <MailIcon className='h-3 w-3' />
                                                {doc.email}
                                            </div>
                                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                                <PhoneIcon className='h-3 w-3' />
                                                {doc.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                             <div className='flex items-center gap-3'>
                                <div className='text-center'>
                                    <div className='font-semibold text-primary'>
                                        {doc.appointmentCount}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Appointments
                                    </div>
                                </div>
                                {doc.isActive ? (
                                   <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                                        Active
                                   </Badge> 
                                ): (
                                    <Badge variant="secondary">Inactive</Badge>
                                )}
                                <Button
                                 size="sm"
                                 variant="outline"
                                 className="h-8 px-3"
                                 onClick={()=>handleEditDoctor(doc)}
                                 >
                                    <EditIcon className='size-4 mr-1'>
                                        Edit
                                    </EditIcon>
                                </Button>
                                
                             </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <AddDoctorDialog isOpen={isAddDialogOpen} onClose={()=> setIsAddDialogOpen(false)} />

                <EditDoctorDialog
                  isOpen={isEditDialogOpen} 
                  onClose={handleCloseEditDoctor}
                  doctor={selectedDoctor}
                  key={selectedDoctor?.id}
                 />    
            </Card>
        </div>
    )
}

export default DoctorsManagement
