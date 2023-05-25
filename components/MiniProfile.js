import { UserPlusIcon } from '@heroicons/react/24/outline'
import { Suspense, lazy, useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from './Loading'
import useHttpToken from '@/hooks/use-http-token'
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const MiniProfile = ({ myProfile, profile, deleteProfileOnFollow }) => {
    const [profileFollowers, setProfileFollowers] = useState([])
    const [isBeingFollowed, setIsBeingFollowed] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `profiles-followers/${profile._id}` }, ({ data }) => {
            setProfileFollowers(data.profileFollowers)
        })
    }, [profile, sendRequest, setProfileFollowers])

    const followProfile = (profileID) => {
        const followProfileBody = {
            followingProfileID: profileID,
            followerProfileID: myProfile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'profiles-follows', body: followProfileBody }, ({ data }) => {
            setProfileFollowers((prevState) => {
                return [...prevState, data.profileFollow]
            })
            setIsBeingFollowed(true)
            deleteProfileOnFollow(profile)
        })
    }

    return (
        <div className='flex flex-col w-full space-y-4'>
            <div className='flex justify-between max-h-[3rem]'>
                <Suspense fallback={<Loading />}>
                    <ImageMediaContent
                        src={profile.picture ?? '/images/default_profile_normal.png'}
                        className='rounded-lg max-h-[3rem]'
                        alt='Profile image' />
                </Suspense>
                <div className='flex flex-col'>
                    <Link href={`/profile/${profile._id}`} className='font-semibold'>
                        {profile.fullName}
                    </Link>
                    <span>{profileFollowers.length} follower{profileFollowers.length !== 1 ? 's' : ''}</span>
                </div>
                {!isBeingFollowed && <button className='flex space-x-1 items-center px-2 py-1 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profile._id)}>
                    <UserPlusIcon className='h-5' />
                    <span className='hidden lg:flex'>Follow</span>
                </button>}
            </div>
            <div className='flex'>
                {profile.bio}
            </div>
            <div className='flex'>
                <Suspense fallback={<Loading />}>
                    <ImageMediaContent
                        src={profile.banner ?? '/images/default_banner.png'}
                        className='rounded-md h-32 w-full'
                        alt='Profile banner' />
                </Suspense>
            </div>
        </div>
    )
}

export default MiniProfile