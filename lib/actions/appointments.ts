"use server"

import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma"
import { AppointmentStatus } from "@/app/generated/prisma/enums";


function transformAppointments(appointment: any) {
    return {
        ...appointment,
        patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName}`.trim(),
        patientEmail: appointment.user.email,
        doctorName: appointment.doctor.name,
        doctorImageUrl: appointment.doctor.imageUrl || "",
        date: appointment.date.toISOString().split("T")[0]
    }
}

export async function getAppointments() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return appointments.map(transformAppointments)
    } catch (error) {
        console.log("Error fetching appointments", error)
        throw new Error("Error fetching appointments")
    }
}

export async function getUserAppointments() {
    try {
        const { userId } = await auth();

        if (!userId) return []

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        })

        if (!user) return []

        const appointments = await prisma.appointment.findMany({
            where: { userId: user.id },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                doctor: { select: { name: true, imageUrl: true } }
            },
            orderBy: [{ date: "asc" }, { time: "asc" }]
        })
        return appointments.map(transformAppointments)
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function getUserAppointmentStats() {
    try {
        const { userId } = await auth();

        if (!userId) return {
            totalAppointments: 0,
            completedAppointments: 0
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        })
        if (!user) {
            return {
                totalAppointments: 0,
                completedAppointments: 0
            }
        }

        // this calls are run in parellal instead of waiting
        const [totalCount, completedCount] = await Promise.all([
            prisma.appointment.count({
                where: {
                    userId: user.id
                }
            }),
            prisma.appointment.count({
                where: {
                    userId: user.id,
                    status: "COMPLETED"
                }
            })
        ]);

        return {
            totalAppointments: totalCount,
            completedAppointments: completedCount
        }

    } catch (error) {
        console.error(error)
        return {
            totalAppointments: 0,
            completedAppointments: 0
        }
    }
}


export async function getBookedTimeSlots(doctorId: string, date: string) {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: new Date(date),
                status: {
                    in: ["CONFIRMED", "COMPLETED"]
                }
            },
            select: { time: true }
        })

        return appointments.map((appointment) => appointment.time)
    } catch (error) {
        console.error(error)
    }
}

interface BookAppointmentInput {
    doctorId: string
    date: string,
    time: string,
    reason?: string
}

export async function bookAppointMent(input: BookAppointmentInput) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("You are not authorized by this application")

        if (!input.doctorId || !input.date || !input.time) {
            throw new Error("All this field are required");
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });

        if (!user) throw new Error("User not found in the database you are a fake user");

        const newAppointMent = await prisma.appointment.create({
            data: {
                userId: user.id,
                doctorId: input.doctorId,
                date: new Date(input.date),
                time: input.time,
                reason: input.reason || "Genral consultant",
                status: "CONFIRMED"
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                doctor: { select: { name: true, imageUrl: true } }
            }
        })
        return transformAppointments(newAppointMent)
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw error
    }
}

export async function updateAppointmentStatus(input: { id: string, status: AppointmentStatus }) {
    try {
        const appointment = await prisma.appointment.update({
            where: { id: input.id },
            data: {
                status: input.status
            },
        })

        return appointment;
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw error
    }
}
