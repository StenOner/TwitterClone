import { Suspense, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Tweet from '@/components/Tweet'
import Loading from '@/components/Loading'
import useHttpToken from '@/hooks/use-http-token'

const Bookmarks = ({ myProfile }) => {
    const [tweets, setTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!myProfile?._id) return
        sendRequest({ url: `tweets-bookmarks/profiles/${myProfile._id}` }, ({ data }) => {
            setTweets(data.tweetsInfo)
        })
    }, [myProfile, sendRequest, setTweets])

    return (
        <div className='flex flex-col w-full space-y-6'>
            {tweets.map(tweet => (
                <Suspense key={uuidv4()} fallback={<Loading />}>
                    <Tweet profile={myProfile} tweet={tweet} />
                </Suspense>
            ))}
        </div>
    )
}

export default Bookmarks