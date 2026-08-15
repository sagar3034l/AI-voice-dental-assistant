import { APPOINTMENT_TYPES } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import DoctorInfo from "./DoctorInfo";


interface BookedConfirmationStepProps {
    selectedDentistId: string;
    selectedDate: string | Date;       // Adjust type as per your use case
    selectedTime: string;              // Adjust type as per your use case
    selectedType: string;              // Adjust type as per your use case
    isBooking: boolean;
    onBack: () => void;
    onModify: () => void;
    confirm: () => void;
}
function BookedConfirmationStep(
    { 
        selectedDentistId,
        selectedDate,
        selectedTime,
        selectedType,
        isBooking,
        onBack,
        onModify,
        confirm,
     }: BookedConfirmationStepProps) {

    const appointmentType = APPOINTMENT_TYPES.find((t) => t.id === selectedType)
    return (
        <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                   <Button variant="ghost" onClick={onBack}>
                        <ChevronLeftIcon className="w-4 h-4 mr-2"/>
                   </Button>
                   <h2>Confirm your appointment</h2> 
              </div>
              <Card className="max-w-2xl">
                 <CardHeader>Appointment Summary</CardHeader>
                 <CardContent className="space-y-4">
                        {/* doctor info */}
                        <DoctorInfo doctorId={selectedDentistId} /> 
                        {/* appointment details */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">Appointment type</p>
                                <p className="font-medium">{appointmentType?.name}</p>
                            </div>
                            <div>
                                 <p className="text-sm text-muted-foreground">Duration</p>   
                                 <p className="font-medium">{appointmentType?.duration}</p>   
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">
                                    {new Date(selectedDate).toLocaleDateString("en-US",{
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                            <div>
                               <p className="text-sm text-muted-foreground">Time</p>
                               <p className="font-medium">{selectedTime}</p>         
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">Dental Centre</p>         
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Cost</p>
                                <p className="font-medium">{appointmentType?.price}</p>       
                            </div>
                        </div>
                 </CardContent>
                </Card>  
                <div className="flex gap-4">
                     <Button variant="outline" onClick={onModify}>
                        Modify Appointment
                     </Button>
                     <Button onClick={confirm} className="bg-primary" disabled={isBooking}>
                        {isBooking ? "Booking..." : "Confirm Booking"}
                     </Button>               
                </div>
        </div>
    )
}

export default BookedConfirmationStep
