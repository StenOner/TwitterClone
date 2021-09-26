import { GlobeIcon, PhotographIcon } from '@heroicons/react/outline'
import { useRef } from 'react'
import useHttpToken from '../hooks/use-http-token'

const PROFILE_IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const NewTweet = ({ profile }) => {
    const tweetCommentRef = useRef()
    const { error, isLoading, sendRequest } = useHttpToken()

    const tweet = () => {
        const comment = tweetCommentRef.current.value
        const tweetBody = {
            profileID: profile._id,
            content: comment,
            state: true
        }
        sendRequest({ method: 'POST', url: 'tweet/new', body: tweetBody }, ({ data }) => {
            alert(data.message)
        })
    }

    return (
        <div className='flex flex-col w-full bg-white rounded-xl px-5 py-3'>
            <span>Tweet something</span>
            <hr className='my-2' />
            <div className='flex space-x-4'>
                <img src={profile?.picture ? `${PROFILE_IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={44} />
                <div className='flex flex-col w-full space-y-1'>
                    <textarea ref={tweetCommentRef} className='w-full' rows={3} placeholder='Whats Hapenning' style={{ 'resize': 'none' }}></textarea>
                    <div className='flex w-full items-center'>
                        <span className='text-blue-500 items-center cursor-pointer'>
                            <PhotographIcon className='h-8' />
                        </span>
                        <span className='flex text-blue-500 items-center space-x-1 ml-2 cursor-pointer'>
                            <GlobeIcon className='h-8' />
                            <span>Everyone can reply</span>
                        </span>
                        <button className='flex space-x-1 items-center ml-auto py-1 sm:px-2 md:px-6 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'
                            onClick={tweet}>
                            Tweet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewTweet
