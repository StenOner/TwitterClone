import { Suspense, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ExploreSort from '@/components/ExploreSort'
import ExploreSearch from '@/components/ExploreSearch'
import Loading from '@/components/Loading'
import Tweet from '@/components/Tweet'
import useHttpToken from '@/hooks/use-http-token'

const SORT_MODES = {
    top: 'top',
    latest: 'latest',
    people: 'people',
    media: 'media',
}

const ExploreTweets = ({ profile }) => {
    const [tweets, setTweets] = useState([])
    const [filteredTweets, setFilteredTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets` }, ({ data }) => {
            setTweets(data.tweetsInfo)
            setFilteredTweets(data.tweetsInfo)
        })
    }, [profile, sendRequest])

    const searchTweetsHandler = (searchTerm) => {
        const filtered = tweets.filter((tweet) => Object.keys(tweet).some((key) => {
            if (typeof tweet[key] !== 'string') return false
            return tweet[key].toLowerCase().includes(searchTerm.toLowerCase())
        }))
        setFilteredTweets(filtered)
    }

    const sortTweetsHandler = (filterMode) => {
        switch (filterMode) {
            case SORT_MODES.top:
                setFilteredTweets([...tweets].sort((a, b) => b.likes.length - a.likes.length))
                break
            case SORT_MODES.latest:
                setFilteredTweets([...tweets].sort((a, b) => b.createdAt - a.createdAt))
                break
            case SORT_MODES.people:
                setFilteredTweets([...tweets].sort((a, b) => b.profileID.followers.length - a.profileID.followers.length))
                break
            case SORT_MODES.media:
                setFilteredTweets([...tweets].sort((a, b) => b.mediaContents.length - a.mediaContents.length))
                break
            default:
                throw Error('Unkown sort mode.')
        }
    }
    return (
        <div className='flex justify-center w-full space-x-5'>
            <div className='hidden max-w-[20rem] md:flex md:flex-col md:w-[30%]'>
                <ExploreSort sortTweets={sortTweetsHandler} />
            </div>
            <div className='flex flex-col space-y-5 max-w-3xl w-[70%] md:w-[60%]'>
                <ExploreSearch searchTweet={searchTweetsHandler} />
                <div className='flex flex-col w-full space-y-5'>
                    {filteredTweets.map(tweet => (
                        <Suspense key={uuidv4()} fallback={<Loading />}>
                            <Tweet profile={profile} tweet={tweet} />
                        </Suspense>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExploreTweets