import jwtDecode from 'jwt-decode'
import { UserAddIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import useHttpToken from '../../../hooks/use-http-token'

const BASE_PROFILE = {
    _id: '',
    fullName: '',
    picture: '',
    banner: '',
    bio: '',
    birthDate: new Date(),
    createdAt: new Date(),
    state: true
}

const Profile = ({ profileID }) => {
    const [myProfile, setMyProfile] = useState(BASE_PROFILE)
    const [profile, setProfile] = useState(BASE_PROFILE)
    const [profileFollowers, setProfileFollowers] = useState([])
    const [profileFollowing, setProfileFollowing] = useState([])
    const { isLoading, error, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profileID) return
        sendRequest({ url: `profile/${profileID}` }, ({ data }) => {
            setProfile(data.profile)
        })
    }, [profileID, setProfile])

    useEffect(() => {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
        const { _id: userID } = jwtDecode(token)
        sendRequest({ url: `profile-by-user/${userID}` }, ({ data }) => {
            setMyProfile(data.profile)
        })
    }, [setMyProfile])

    useEffect(() => {
        if (!profileID) return
        sendRequest({ url: `profile-followers/${profileID}` }, ({ data }) => {
            setProfileFollowers(data.profileFollowers)
        })
        sendRequest({ url: `profile-following/${profileID}` }, ({ data }) => {
            setProfileFollowing(data.profileFollowing)
        })
    }, [profileID, setProfileFollowers, setProfileFollowing])

    const followProfile = () => {
        sendRequest({ method: 'POST', url: 'profile-follow/new', body: { followingProfileID: profile._id, followerProfileID: myProfile._id, state: true } }, ({ data }) => {
            setProfileFollowers((prevState) => {
                return [...prevState, data.profileFollow]
            })
            alert(data.message)
        })
    }

    return (
        <div className='flex flex-col'>
            <div className='max-h-[7.5rem] sm:max-h-[10rem] md:max-h-[15rem] lg:max-h-[22.5rem]'>
                <img src='/images/default_banner.png' className='max-h-full' width='100%' />
            </div>
            <div className='absolute left-[50%] top-[2.5rem] h-[6rem] w-[6rem] z-[1000] sm:left-[12%] sm:top-[5rem] sm:h-[6rem] sm:w-[6rem] md:left-[12%] md:top-[9rem] md:h-[7.5rem] md:w-[7.5rem] lg:left-[12%] lg:top-[14rem] lg:h-[10.5rem] lg:w-[10.5rem]'>
                <img src='/images/default_profile_normal.png' className='rounded-lg max-h-full relative left-[-42%] sm:left-0' width='100%' />
            </div>
            <div className='absolute flex py-2 bg-white rounded-lg w-[85%] left-[10%] top-[6rem] sm:left-[9%] sm:top-[8rem] md:left-[10%] md:top-[13rem] lg:left-[10%] lg:top-[19rem]'>
                <div className='flex flex-col w-full space-y-2 items-center mt-12 sm:items-start sm:mt-0 sm:mr-10 sm:py-4 sm:ml-32 md:ml-40 lg:ml-52'>
                    <div className='flex items-center justify-center w-full m:justify-start'>
                        <span className='capitalize font-bold text-lg '>
                            {profile.fullName}
                        </span>
                        <span className='hidden ml-6 sm:block'>
                            <b>{profileFollowing.length}</b> following
                        </span>
                        <span className='hidden ml-6 sm:block'>
                            <b>{profileFollowers.length}</b> followers
                        </span>
                        <button className='hidden ml-auto space-x-1 items-center px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200 sm:flex' onClick={followProfile}>
                            <UserAddIcon className='h-5' />
                            <span>Follow</span>
                        </button>
                    </div>
                    <div className='flex justify-evenly px-10 w-full sm:hidden'>
                        <span>
                            <b>{profileFollowing.length}</b> following
                        </span>
                        <span>
                            <b>{profileFollowers.length}</b> followers
                        </span>
                    </div>
                    <div className='flex px-10 text-center text-gray-500 sm:text-left sm:pl-0'>
                        Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                    </div>
                    <div className='flex sm:hidden'>
                        <button className='flex space-x-1 items-center px-10 py-2 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'
                            onClick={followProfile}>
                            <UserAddIcon className='h-5' />
                            <span>Follow</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    return {
        props: {
            profileID: params.profileID
        },
        revalidate: 10
    }
}