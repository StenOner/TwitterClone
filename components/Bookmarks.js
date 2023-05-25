import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Tweet from './Tweet'
import useHttpToken from '@/hooks/use-http-token'

const Bookmarks = ({ myProfile }) => {
    const [tweetBookmarks, setTweetBookmarks] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!myProfile?._id) return
        sendRequest({ url: `tweets-bookmarks/profiles/${myProfile._id}` }, ({ data }) => {
            setTweetBookmarks(data.tweetBookmarks)
        })
    }, [myProfile, sendRequest, setTweetBookmarks])

    return (
        <div className='flex flex-col w-full space-y-6'>
            {tweetBookmarks.map(tweetBookmark => (
                <Tweet key={uuidv4()} profile={myProfile} tweet={tweetBookmark.tweetID} />
            ))}
        </div>
    )
}

export default Bookmarks