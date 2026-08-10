"use server"

import { Gender } from "@/app/generated/prisma/enums"
import prisma from "../prisma"
import { generateAvatar } from "../utils"
import { revalidatePath } from "next/cache"

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include:{
                _count: {select: {appointment: true}}
            },
            orderBy: {createdAt:"desc"}
        })

        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount: doctor._count.appointment
        }))
    } catch (error) {
        console.error(error)
    }
}

interface CreateDoctorInput {
    name: string,
    email: string,
    phone: string | null,
    speciality: string,
    gender: Gender,
    isActive: boolean
}

export async function createDoctor(input:CreateDoctorInput) {
    try {
        if(!input.name || !input.email){
            throw new Error("Name and email is missing");
        }
        const doctor = await prisma.doctor.create({
            data:{
                ...input,
                imageUrl: generateAvatar(input.name,input.gender)
            }
        })
        revalidatePath("/admin")
        return doctor
    } catch (error:any) {
        console.error(error)

        if(error?.code === "p2002"){
            throw new Error("A doctor with this email already exists")
        }

        throw new Error("Error creating doctor")
    }
}

interface UpdateDoctorInput extends Partial<CreateDoctorInput>
{
    id: string
}

export async function updateDoctor(input: UpdateDoctorInput) {
    try {
        // validate
        if(!input.name || !input.email){
            throw new Error("Name and email are required")
        }

        const currentDoctor = await prisma.doctor.findUnique({
            where: {id: input.id}, select: {email: true}
        })

        if(!currentDoctor){
            throw new Error("Doctor not found")
        }

        if(input.email !== currentDoctor.email){
            const existingDoctor = await prisma.doctor.findUnique({
                where: {email: input.email}
            })

            if(existingDoctor){
                throw new Error("A doctor with this email alrady exists")
            }
        }
        
        const doctor = await prisma.doctor.update({
            where: {id: input.id},
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                speciality: input.speciality,
                gender: input.gender,
                isActive: input.isActive
            }
        }) 

        return doctor;

    } catch (error) {
        console.error(error)
        throw new Error("Update failed")
    }
}