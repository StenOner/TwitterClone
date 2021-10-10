import { useEffect, useState } from 'react'
import { HeartIcon } from '@heroicons/react/outline'
import { v4 as uuidv4 } from 'uuid'
import dateFormat from 'dateformat'
import useHttpToken from '../hooks/use-http-token'
import WithAuth from '../hocs/WithAuth'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const Comment = ({ profile, comment }) => {
    const [mediacontents, setMediacontents] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        sendRequest({ url: `tweets-comments-mediacontents/tweets-comments/${comment._id}` }, ({ data }) => {
            setMediacontents(data.tweetCommentMediacontents)
        })
    }, [sendRequest, setMediacontents])

    return (
        <div className='flex flex-col bg-white rounded-xl mb-2 space-y-2 text-sm'>
            <div className='flex space-x-4'>
                <img src={profile?.picture ? `${IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={44} />
                <div className='flex flex-col space-y-1'>
                    <div className='flex space-x-2 items-center'>
                        <span className='font-semibold capitalize'>
                            {profile.fullName}
                        </span>
                        <span className='text-gray-400 text-xs'>
                            {dateFormat(new Date(comment.createdAt), 'dd mmmm "at" HH:MM')}
                        </span>
                    </div>
                    <div className='flex w-full'>
                        <span>
                            {comment.content}
                        </span>
                    </div>
                    {mediacontents.length > 0 && (
                        <div className='flex w-full space-x-2'>
                            {mediacontents.map((mediacontent) => (
                                <img key={uuidv4()} src={`${IMAGE_BASE_URL}${mediacontent.content}`} />
                            ))}
                        </div>)}
                    <div className='flex w-full space-x-4 text-gray-400'>
                        <div className='flex flex-row space-x-1 py-2 cursor-pointer items-center hover:bg-gray-100'>
                            <HeartIcon className='h-4' />
                            <span className='hidden sm:flex'>Like</span>
                        </div>
                        <div className='flex flex-row items-center'>
                            <span>
                                {0} Likes
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WithAuth(Comment)
