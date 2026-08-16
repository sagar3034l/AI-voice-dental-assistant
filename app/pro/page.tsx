import Navbar from "@/components/Navbar";
import { PricingTable } from "@clerk/nextjs";
import { currentUser,auth } from "@clerk/nextjs/server"
import { CrownIcon } from "lucide-react";
import { redirect } from "next/navigation";




async function propage(){
    const user = await currentUser();

    if(!user)redirect("/")

    const {has} = await auth()

    const hasProPlan = has({plan: "ai_basics"}) || has({plan:"ai_pro"})
    return (
       <>
         <Navbar /> 
         <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
            <div className="mb-12 overflow-hidden">
               <div className="flex items-center justify-between bg-linear-to-br from-primary/10 to-background rounded-3xl p-8 border border-primary/20">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border-primary/20">
                          <div className="w-2 h-2 bg-primary rounded-xl animate-pulse"></div>
                          <span className="text-sm font-medium text-primary">Upgrade to pro</span>
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold mb-2">Unlock Premium AI dental Care</h1>
                        <p>
                          Get Unlimited AI consultations , advance featuers, and priority support to take your dental health to the next level
                        </p>
                      </div>
                   </div>
                   <div className="hidden lg:block">
                      <div className="h-32 w-32 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <CrownIcon className="size-16 text-primary" />
                      </div>
                   </div>
               </div>
            </div>
            {/* Pricing section */}
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-3xl font-bold">Choose your plan</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Select the perfect plan for your dental care needs. All plans include secure access and bank-level encryption
                  </p>
              </div>
              <PricingTable newSubscriptionRedirectUrl="/pro" />
            </div>
         </div>
       </>
      )      
  }

export default propage;