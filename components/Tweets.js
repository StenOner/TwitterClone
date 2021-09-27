import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useHttpToken from '../hooks/use-http-token'
import Tweet from './Tweet'


const Tweets = ({ profile, newTweet }) => {
    const [tweets, setTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets-by-profile/${profile._id}` }, ({ data }) => {
            setTweets(data.tweets)
        })
    }, [profile, sendRequest, setTweets])

    useEffect(() => {
        if (!newTweet) return
        setTweets((prevState) => {
            return [newTweet, ...prevState]
        })
    }, [setTweets, newTweet])

    return (
        <div className='flex flex-col w-full space-y-6'>
            {tweets?.map(tweet => (
                <Tweet key={uuidv4()} profile={profile} tweet={tweet} />
            ))}
        </div>
    )
}

export default Tweets
