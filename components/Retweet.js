import { useState } from 'react'
import { BookmarkIcon, ChatBubbleLeftIcon, HeartIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import dateFormat from 'dateformat'

const ReTweet = ({ myProfile, retweet: retweetData }) => {
    const [retweet, setRetweet] = useState(retweetData)

    return (
        <div className='flex flex-col bg-white rounded-xl p-6 space-y-4'>
            <div className='flex space-x-4'>
                <LazyLoadImage
                    src={myProfile?.picture ? `${PROFILE_IMAGE_BASE_URL}${myProfile.picture}` : '/images/default_profile_normal.png'}
                    alt='Profile image'
                    className='rounded-lg max-h-[44px]' />
                <div className='flex flex-col justify-between'>
                    <span className='font-semibold capitalize'>
                        {myProfile.fullName}
                    </span>
                    <span className='text-gray-400 text-xs'>
                        {dateFormat(new Date(retweet.createdAt), 'dd mmmm "at" HH:MM')}
                    </span>
                </div>
            </div>
            <div className='flex w-full'>
                <span>
                    {retweet.content}
                </span>
            </div>
            <div className='flex w-full'>
                image
            </div>
            <div className='flex space-x-2 text-xs text-gray-400 justify-end'>
                <span>
                    Comments
                </span>
                <span>
                    Retweets
                </span>
                <span>
                    Saved
                </span>
            </div>
            <div className='flex justify-evenly'>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <ChatBubbleLeftIcon className='h-5' />
                    <span>Comments</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <ArrowPathIcon className='h-5' />
                    <span>Retweets</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <HeartIcon className='h-5' />
                    <span>Likes</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <BookmarkIcon className='h-5' />
                    <span>Saved</span>
                </div>
            </div>
        </div>
    )
}

export default ReTweet
