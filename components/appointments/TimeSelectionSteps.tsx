import { useBookedTimeSlots } from "@/hooks/use-appointments"
import { APPOINTMENT_TYPES, getNext5Days, getTimeSlots } from "@/lib/utils"
import { Button } from "../ui/button"
import { ChevronLeftIcon, ClockIcon } from "lucide-react"
import { Card, CardContent } from "../ui/card"


interface timeSelectionProps {
    selectedDentistId: string
    selectedDate: string
    selectedTime: string
    selectedType: string
    onBack: () => void
    onContinue: () => void
    onDateChange: (date: string) => void
    onTimeChange: (time: string) => void
    onTypeChange: (time: string) => void
}


function TimeSelectionSteps({
    selectedDentistId,
    selectedDate,
    selectedTime,
    onBack,
    onContinue,
    selectedType,
    onDateChange,
    onTimeChange,
    onTypeChange }: timeSelectionProps) {

    const availabelDays = getNext5Days();
    const availableTimeSlots = getTimeSlots();

    const { data: bookedTimeSlots = [] } = useBookedTimeSlots(selectedDentistId, selectedDate);

    const handleDateSelect = (date: string) => {
        onDateChange(date);
        // reset time when the date changes
        onTimeChange("")
    }

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}>
                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <h2 className="text-2xl font-semibold">Select date and time</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Appointment type selection */}
                <div className="space-y-4">
                    <div className="space-y-3">
                    <h3 className="text-lg font-medium">Appointements Type</h3>
                    {APPOINTMENT_TYPES.map((type) => (
                        <Card
                            key={type.id}
                            className={`cursor-pointer translate-all hover:shadow-sm ${selectedType === type.id ? 'ring-2 ring-primary' : ""
                                }`}
                            onClick={() => onTypeChange(type.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium">{type.name}</h4>
                                        <p className="text-sm text-muted-foreground">{type.duration}</p>
                                    </div>
                                    <span className="font-semibold text-primary">{type.price}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                </div>
                {/* Date and time selection */}
                <div className="space-y-4">
                     <h1 className="text-lg font-medium">Available dates</h1>
                        {/*Date selection  */}
                        <div className="grid grid-cols-2 gap-3">
                            {availabelDays.map((date)=> (
                                <Button 
                                className="h-auto p-3"
                                key={date}
                                variant={selectedDate === date ? "default" : "outline"}
                                onClick={()=> handleDateSelect(date)}
                                >
                                    <div className="text-center">
                                        <div className="font-medium">
                                            {new Date(date).toLocaleString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>


                        {/* Time selection */}
                        {selectedDate && (
                            <div className="space-y-3">
                                <h4 className="font-medium">Available Times</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {availableTimeSlots.map((time)=> {
                                        const isBooked = bookedTimeSlots.includes(time)
                                        return (
                                            <Button
                                              key={time}
                                              variant={selectedTime === time ? "default" : "outline"}
                                              onClick={()=> !isBooked && onTimeChange(time)}
                                              size="sm"
                                              disabled = {isBooked}
                                              className={isBooked ? "opacity-50 cursor-not-allowed": ""}
                                            >
                                                <ClockIcon className="w-3 h-3 mr-1" />
                                                {time}
                                                {isBooked && "(Booked)"}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                </div>
            </div>  
            {selectedType && selectedDate && (
               <div className="flex justify-end">
                 <Button
                  onClick={onContinue}
                 >
                    Continue
                </Button>
               </div>
            )}
        </div>
    )
}

export default TimeSelectionSteps