import { useAvailableDoctors } from '@/hooks/use-doctors'
import Image from 'next/image';
import React from 'react'

function DoctorInfo({doctorId}:{doctorId: string}) {
    const {data: doctors=[]} = useAvailableDoctors();
    const doctor = doctors.find((doc)=>doc.id === doctorId);

    if(!doctor) return null;
  return (
    <div className='flex items-center gap-4'>
        <Image 
         src={doctor.imageUrl!}
         alt='image-of-doctor'
         width={48}
         height={48}
         className='w-12 h-12 rounded-full object-cover'
         unoptimized
         />
         <div>
            <h3>{doctor.name}</h3>
            <p className='text-sm text-muted-foreground'>{doctor.speciality || "General Dentistry"}</p>
         </div>
    </div>
  )
}

export default DoctorInfo