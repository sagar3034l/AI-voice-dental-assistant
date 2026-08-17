"use client"

import { AppointmentConfirmationModal } from "@/components/appointments/AppointmentConfirmationModal";
import BookedConfirmationStep from "@/components/appointments/BookedConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionSteps from "@/components/appointments/TimeSelectionSteps";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useBookAppointments, useUserAppointment } from "@/hooks/use-appointments";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarClock, CalendarX2, Clock3, Loader2, Stethoscope } from "lucide-react";
import { useState } from "react"
import { toast } from 'sonner'

function AppointmentPage() {
    const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [showConfirmed, setShowConfirmed] = useState(false)
    const [bookedAppointments, setBookedAppointments] = useState<any>(null);

    const bookeAppointmetMutation = useBookAppointments();
    const { data: userAppointments = [], isLoading: userAppointmentsLoading } = useUserAppointment();

    console.log(userAppointments)


    const handleSelectDentist = (doctorId: string) => {
        setSelectedDentistId(doctorId);
        setSelectedDate("");
        setSelectedTime("");
        setSelectedType("");
    }
    const handleBookAppointMent = async () => {
        if (!selectedDentistId || !selectedDate || !selectedTime || !selectedType) {
            toast.error("Please select all required fields before confirming the appointment");
            return;
        }
        const appointmentType = APPOINTMENT_TYPES.find((t) => t.id === selectedType)

        bookeAppointmetMutation.mutate({
            doctorId: selectedDentistId,
            date: selectedDate,
            time: selectedTime,
            reason: appointmentType?.name
        }, {
            onSuccess: async (appointment) => {
                setBookedAppointments(appointment)

                try {
                    const emailResponse = await fetch("/api/send-appointment-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userEmail: appointment.patientEmail,
                            doctorName: appointment.doctorName,
                            appointmentDate: format(new Date(appointment.date), "EEEE, MMMM d, yyyy"),
                            appointmentTime: appointment.time,
                            appointmentType: appointmentType?.name,
                            duration: appointmentType?.duration,
                            price: appointmentType?.price,
                        }),
                    });

                    if (!emailResponse.ok) console.error("Failed to send confirmation email");
                } catch (error) {
                    console.error("Error sending confirmation email:", error);
                }

                setShowConfirmed(true);
                setSelectedDentistId(null);
                setSelectedDate("")
                setSelectedTime("")
                setSelectedType("")
                setCurrentStep(1)
            },
            onError: (error) => toast.error(`Failed to book appointment,${error.message}`)
        },
        )
    }


    return (
        <>
            <Navbar />
            <div className="max-w-7xl px-6 py-8 pt-24">
                {/* header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Book an appointment
                    </h1>
                    <p className="text-muted-foreground">Find and book with verified dentists in your area</p>
                </div>
                <ProgressSteps currentStep={currentStep} />
                {currentStep === 1 && (
                    <DoctorSelectionStep
                        selectedDentistId={selectedDentistId}
                        onContinue={() => setCurrentStep(2)}
                        onSelectDentist={handleSelectDentist}
                    />
                )}
                {currentStep === 2 && selectedDentistId && (
                    <TimeSelectionSteps
                        selectedDentistId={selectedDentistId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                        onDateChange={setSelectedDate}
                        onTimeChange={setSelectedTime}
                        onTypeChange={setSelectedType}
                    />
                )}

                {currentStep === 3 && selectedDentistId && (
                    <BookedConfirmationStep
                        selectedDentistId={selectedDentistId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        isBooking={bookeAppointmetMutation.isPending}
                        onBack={() => setCurrentStep(2)}
                        onModify={() => setCurrentStep(2)}
                        confirm={handleBookAppointMent}
                    />
                )}
            </div>

            {bookedAppointments && (
                <AppointmentConfirmationModal
                   open={showConfirmed}
                   onOpenChange={setShowConfirmed}
                   appointmentDetails={{
                    doctorName: bookedAppointments.doctorName,
                    appointmentDate: format(new Date(bookedAppointments.date),"EEEE, MMMM d, yyyy"),
                    appointmentTime: bookedAppointments.time,
                    userEmail: bookedAppointments.patientEmail
                   }}
                 />
            )}

            <div className="max-w-7xl px-6 pb-12">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Your appointments</h2>
                        <p className="text-sm text-muted-foreground">
                            Review your upcoming and past visits in one place.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarClock className="size-4" />
                        <span>{userAppointments.length} total</span>
                    </div>
                </div>

                {userAppointmentsLoading ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Loading your appointments...
                        </CardContent>
                    </Card>
                ) : userAppointments?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
                                <CalendarX2 className="size-7 opacity-60" />
                            </div>
                            <p className="text-base font-medium text-foreground">No appointments yet</p>
                            <p className="mt-1 max-w-md text-sm">
                                Your booked appointments will show up here once you schedule your first visit.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {userAppointments.map((appointment: any) => (
                            <Card key={appointment.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Stethoscope className="size-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold">{appointment.doctorName}</h3>
                                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {appointment.status}
                                                </span>
                                            </div>
                                            <CardDescription>{appointment.reason || "General consultation"}</CardDescription>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarClock className="size-4" />
                                                    {new Date(`${appointment.date}T00:00:00`).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock3 className="size-4" />
                                                    {appointment.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground md:text-right">
                                        <p className="font-medium text-foreground">
                                            {appointment.duration} min
                                        </p>
                                        <p>Booked for you</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default AppointmentPage
