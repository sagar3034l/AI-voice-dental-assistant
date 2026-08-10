import { Gender } from '@/app/generated/prisma/enums'
import { useCreateDoctor } from '@/hooks/use-doctors';
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { formatPhoneNumber } from '@/lib/utils';

interface DialogProps {
    isOpen: boolean,
    onClose: ()=> void
}

function AddDoctorDialog({isOpen,onClose}:DialogProps) {
    const [newDoctor,setNewDoctor] = useState({
         name: "",
         email: "",
         phone: "",
         speciality: "",
         gender: "MALE" as Gender,
         isActive: true
    });

    const createDoctorMutation = useCreateDoctor();

    const handlePhoneChange = (val:string) => {
        const formatedValue = formatPhoneNumber(val)
        setNewDoctor({...newDoctor,phone:formatedValue})
    };
    const handleSave = () => {
       createDoctorMutation.mutate({...newDoctor}, {
         onSuccess: ()=> {
           handleClose();
         }
       })
    };

    const handleClose = () => {
      onClose()
      setNewDoctor({
        name: "",
         email: "",
         phone: "",
         speciality: "",
         gender: "MALE" as Gender,
         isActive: true
      })
    };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
             Add a new doctor
          </DialogTitle>
          <DialogDescription>
            Add a new doctor
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='new-name'>
                Name
              </Label>
              <Input
                id='new-name'
                value={newDoctor.name}
                onChange={(e)=>setNewDoctor({...newDoctor, name:e.target.value})}
                placeholder='Dr. john Smith'
               />
            </div>
            <div className='space-y-2'>
              <Label>
                 Speciality
              </Label>
              <Input
                id='new-speciality'
                value={newDoctor.speciality}
                onChange={(e)=> setNewDoctor({...newDoctor, speciality: e.target.value})}
                placeholder='General dentistry'
               />
            </div>
            </div>
            <div className='space-y-2'>
              <Label>
                 Email
              </Label>
              <Input
                id='email'
                value={newDoctor.email}
                onChange={(e)=> setNewDoctor({...newDoctor, email: e.target.value})}
                placeholder='doctor@example.com'
               />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='new-phone'>
                  Phone
              </Label>
              <Input
                id='new-phone'
                value={newDoctor.phone}
                onChange={(e)=> handlePhoneChange(e.target.value)}
                placeholder='(555) 123-4257'
               />
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='new-gender'>Gender</Label>

                  <Select
                   value={newDoctor.gender || ""}
                   onValueChange={(value)=> setNewDoctor({...newDoctor,gender: value as Gender})}
                  >
                    <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">
                        Male
                      </SelectItem>
                      <SelectItem value="FEMALE">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='new-student'>Status</Label>
                  <Select
                   value={newDoctor.isActive ? "active" : "inactive"}
                   onValueChange={(value)=>{
                      setNewDoctor({...newDoctor, isActive: value === "active"})
                   }} 
                  >
                    <SelectTrigger>
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
        </div>
        <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                 Cancel
              </Button>   
              <Button onClick={handleSave}  className="bg-primary hover:bg-primary/90"
               disabled={!newDoctor.name || !newDoctor.email || !newDoctor.speciality || createDoctorMutation.isPending}
              >
                 {createDoctorMutation.isPending ? "adding..." : "Add doctor"}
              </Button>   
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddDoctorDialog