import { useEffect, useState } from 'react'
import useHttpToken from '../hooks/use-http-token'

const PROFILE_IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const Tweets = ({ profile }) => {
    const [tweets, setTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets-by-profile/${profile._id}` }, ({ data }) => {
            setTweets(data.tweets)
        })
    }, [profile, sendRequest, setTweets])

    return (
        <div className='flex flex-col w-full bg-white rounded-xl px-5 py-3'>
            <ul>
                {tweets.map(tweet => (
                    <li>
                        {tweet.content}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Tweets
