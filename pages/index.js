import { useState } from 'react'
import NewTweet from '@/components/NewTweet'
import Trends from '@/components/Trends'
import Tweets from '@/components/Tweets'
import WhoToFollow from '@/components/WhoToFollow'
import withAuth from '@/hocs/withAuth'

const Home = ({ myProfile }) => {
  const [newTweet, setNewTweet] = useState(null)

  const addTweet = (tweet) => {
    setNewTweet(tweet)
  }

  return (
    <div className='flex justify-center pt-4 w-full'>
      <div className='flex flex-col space-y-6 max-w-3xl w-[70%] md:w-[60%]'>
        <NewTweet profile={myProfile} addTweet={addTweet} />
        <Tweets profile={myProfile} newTweet={newTweet} />
      </div>
      <div className='hidden max-w-sm md:flex md:flex-col md:w-[30%]'>
        <Trends profile={myProfile} />
        <WhoToFollow myProfile={myProfile} />
      </div>
    </div>
  )
}

export default withAuth(Home)