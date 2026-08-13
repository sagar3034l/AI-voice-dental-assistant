import ActivityOverview from '@/components/dashboards/ActivityOverview'
import MainActions from '@/components/dashboards/MainActions'
import WelcomeSection from '@/components/dashboards/WelcomeSection'
import Navbar from '@/components/Navbar'


function dashboard() {
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