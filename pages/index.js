import { Suspense, lazy, useState } from 'react'
import Loading from '@/components/Loading'
import NewTweet from '@/components/NewTweet'
import Trends from '@/components/Trends'
import WhoToFollow from '@/components/WhoToFollow'
import withAuth from '@/hocs/withAuth'
const Tweets = lazy(() => import('@/components/Tweets'))

const Home = ({ myProfile }) => {
  const [newTweet, setNewTweet] = useState(null)

  const addTweet = (tweet) => {
    setNewTweet(tweet)
  }

  return (
    <div className='flex justify-center pt-6 w-full space-x-5'>
      <div className='flex flex-col space-y-5 max-w-3xl w-[70%] md:w-[60%]'>
        <NewTweet profile={myProfile} addTweet={addTweet} />
        <Suspense fallback={<Loading />}>
          <Tweets profile={myProfile} newTweet={newTweet} />
        </Suspense>
      </div>
      <div className='hidden max-w-[20rem] space-y-5 md:flex md:flex-col md:w-[30%]'>
        <Trends profile={myProfile} />
        <WhoToFollow myProfile={myProfile} />
      </div>
    </div>
  )
}

export default withAuth(Home)