"use client"

import { createDoctor, getAvailableDoctors, getDoctors, updateDoctor } from '@/lib/actions/doctors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  })
  return result;
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["getDoctors"]})
    },
    onError: () => console.log("Error while creating doctor")
  })
}

export function useUpdateDoctor(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:['getDoctors']})
      queryClient.invalidateQueries({queryKey:['getAvailableDoctor']})
    },
    onError: (error)=> console.log("Failed to update doctor",error),
  })
}

export function useAvailableDoctors() {
    const result = useQuery({
      queryKey: ["getAvailableDoctors"],
      queryFn: getAvailableDoctors,
    })

    return result
}

