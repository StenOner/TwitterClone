import { useState } from 'react'
import NewTweet from '../components/NewTweet'
import Trends from '../components/Trends'
import Tweets from '../components/Tweets'
import Retweets from '../components/Retweets'
import WithAuth from '../hocs/WithAuth'

const Home = ({ myProfile }) => {
  const [newTweet, setNewTweet] = useState(null)

  const addTweet = (tweet) => {
    setNewTweet(tweet)
  }

  return (
    <div className='flex w-[85%] justify-center pt-4'>
      <div className='flex flex-col w-1/2 space-y-6'>
        <NewTweet profile={myProfile} addTweet={addTweet} />
        <Retweets profile={myProfile} />
        <Tweets profile={myProfile} newTweet={newTweet} />
      </div>
      <div className='flex flex-col'>
        <Trends />
      </div>
    </div>
  )
}

export default WithAuth(Home)