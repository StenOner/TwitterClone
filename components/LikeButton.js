import { HeartIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import useHttpToken from '@/hooks/use-http-token'

const LikeButton = ({ profile, tweet, likes, addLike, deleteLike }) => {
    const [isLiked, setIsLiked] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (likes.some((_like) => _like.profileID._id === profile._id)) {
            setIsLiked(true)
            return
        }
        setIsLiked(false)
    }, [likes, profile, setIsLiked])

    const likeTweetHandler = () => {
        const tweetLikeBody = {
            tweetID: tweet._id,
            profileID: profile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-likes', body: tweetLikeBody }, ({ data }) => {
            addLike(data.tweetLike)
        })
    }

    const unlikeTweetHandler = () => {
        const tweetLikeID = likes.find((_like) => _like.profileID._id === profile._id)._id
        sendRequest({ method: 'DELETE', url: `tweets-likes/${tweetLikeID}` }, ({ data }) => {
            deleteLike(data.tweetLike._id)
        })
    }

    return (
        <div className={`${isLiked ? 'text-[#EB5757] ' : ''}flex flex-row space-x-2 py-2 px-6 cursor-pointer rounded-md hover:bg-gray-100`} onClick={isLiked ? unlikeTweetHandler : likeTweetHandler}>
            <HeartIcon className='h-5' />
            <span className='hidden lg:flex'>Like{isLiked ? 'd' : ''}</span>
        </div>
    )
}

export default LikeButton