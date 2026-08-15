"use client"

import { bookAppointMent, getAppointments, getBookedTimeSlots, getUserAppointments } from "@/lib/actions/appointments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useGetAppointments(){
    const result = useQuery({
        queryKey: ['getAppointments'],
        queryFn: getAppointments,
    })
    return result
}

export function useBookedTimeSlots(doctorId: string, date: string){
    return useQuery({
        queryKey: ["getBookedTimeSlots"],
        queryFn: ()=>getBookedTimeSlots(doctorId!,date),
        enabled: !!doctorId && !!date
    })
}


export function useBookAppointments(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bookAppointMent,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["getAppointments"]})
            queryClient.invalidateQueries({queryKey:["appointments"]})
        },
        onError: (error) => console.error("Failed to book appointment", error)
    })
}

export function useUserAppointment(){
    const result = useQuery({
        queryKey: ["appointments"],
        queryFn: getUserAppointments
    })

    return result
}


