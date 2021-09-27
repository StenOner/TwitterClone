import { useRef } from 'react'
import { PhotographIcon } from '@heroicons/react/outline'

const PROFILE_IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const NewComment = ({ profile, tweet }) => {
    const commentInputRef = useRef()

    return (
        <div className='flex w-full items-center'>
            <img src={profile?.picture ? `${PROFILE_IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={36} />
            <input ref={commentInputRef} className='w-full ml-4' placeholder='Tweet your reply' />
            <PhotographIcon className='h-6 ml-auto cursor-pointer' />
        </div>
    )
}

export default NewComment
