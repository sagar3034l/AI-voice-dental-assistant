import { useAvailableDoctors } from "@/hooks/use-doctors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DoctorCardsLoading } from "./DoctorCardsLoading";

interface doctorSelectionStepProps {
  selectedDentistId: string | null,
  onSelectDentist: (dentistId: string) => void;
  onContinue: () => void;
}

function DoctorSelectionStep({ selectedDentistId, onContinue, onSelectDentist }: doctorSelectionStepProps) {
  const { data: doctors = [], isLoading } = useAvailableDoctors();
  if (isLoading) return (
     <div className="space-y-6">
        <h2>Choose Your Dentist</h2>
        <DoctorCardsLoading />
     </div>
  )
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose your dentist</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id}
            className={`cursor-pointer transition-all hover:shaodow-lg ${selectedDentistId === doc.id ? "ring-2 ring-primary" :
                ""
              }`}
            onClick={() => onSelectDentist(doc.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Image
                  src={doc?.imageUrl}
                  alt={doc.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {doc.speciality || "General Dentistry"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({doc.appointmentCount} appointments)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>DentWise</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
                <span>{doc.phone}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {doc.bio || "Experienced dental professional providing quality care."}
              </p>
              <Badge variant="secondary">Licensed Professional</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedDentistId && (
        <div className="flex justify-end">
          <Button onClick={onContinue}>
            Continue to Time Selection
          </Button>
        </div>
      )}
    </div>
  )
}

export default DoctorSelectionStep