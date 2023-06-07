import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Tweet from './Tweet'
import useHttpToken from '@/hooks/use-http-token'

const Bookmarks = ({ myProfile }) => {
    const [tweetsInfo, setTweetsInfo] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!myProfile?._id) return
        sendRequest({ url: `tweets-bookmarks/profiles/${myProfile._id}` }, ({ data }) => {
            setTweetsInfo(data.tweetsInfo)
        })
    }, [myProfile, sendRequest, setTweetsInfo])

    return (
        <div className='flex flex-col w-full space-y-6'>
            {tweetsInfo.map(tweetInfo => (
                <Tweet key={uuidv4()} profile={myProfile} tweet={tweetInfo} />
            ))}
        </div>
    )
}

export default Bookmarks