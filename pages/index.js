import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/solid'
import NewTweet from '../components/NewTweet'
import Trends from '../components/Trends'
import useHttpToken from '../hooks/use-http-token'
import Tweets from '../components/Tweets'

const Home = () => {
  const [profile, setProfile] = useState({})
  const { error, isLoading, sendRequest } = useHttpToken()

  useEffect(() => {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
    const { _id } = jwtDecode(token)
    sendRequest({ url: `profile-by-user/${_id}` }, ({ data }) => {
      setProfile(data.profile)
    })
  }, [setProfile])

  return (
    <div className='flex w-[85%] justify-center pt-4'>
      <div className='flex flex-col w-1/2 space-y-6'>
        <NewTweet profile={profile} />
        <div className='flex space-x-2 text-sm text-gray-400'>
          <RefreshIcon className='h-5' />
          <span>{profile.fullName} Retweeted</span>
        </div>
        <Tweets profile={profile} />
      </div>
      <div className='flex flex-col'>
        <Trends />
      </div>
    </div>
  )
}

export default Home