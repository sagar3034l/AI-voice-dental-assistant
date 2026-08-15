import ActivityOverview from '@/components/dashboards/ActivityOverview'
import MainActions from '@/components/dashboards/MainActions'
import WelcomeSection from '@/components/dashboards/WelcomeSection'
import Navbar from '@/components/Navbar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'


async function dashboard() {
  const user = await currentUser()

  if (!user) redirect('/')

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
        <WelcomeSection />  
        <MainActions />
        <ActivityOverview />
      </div>
    </div>
  )
}

export default dashboard
