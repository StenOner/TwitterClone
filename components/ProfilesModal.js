import { Modal } from '@mui/material'
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { v4 as uuidv4 } from 'uuid'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const ProfilesModal = ({ title, isOpen, closeModal, myProfile, profiles, myProfileFollowing, followProfile }) => {
    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby='Modal for following profiles'
            aria-describedby='Profiles being followed by current profile'>
            <div className='absolute top-[20%] left-[40%] flex flex-col items-center overflow-y-auto w-[30%] p-4 max-h-[50%] bg-white rounded-lg'>
                <div className='flex w-full mb-2'>
                    <span className='font-semibold'>
                        {title}
                    </span>
                    <span className='ml-auto cursor-pointer' onClick={closeModal}>
                        <XMarkIcon className='h-6' />
                    </span>
                </div>
                <div className='flex flex-col w-full'>
                    {profiles.map(({ profileInfo }) => (
                        <div key={uuidv4()} className='flex mt-2 flex-col'>
                            <div className='flex'>
                                <div className='self-start max-w-[3rem]'>
                                    <LazyLoadImage
                                        src={profileInfo.picture ? `${IMAGE_BASE_URL}${profileInfo.picture}` : '/images/default_profile_normal.png'}
                                        className='rounded-lg max-h-full' />
                                </div>
                                <div className='flex flex-col ml-4 justify-between'>
                                    <Link href={`/profile/${profileInfo._id}`} className='font-semibold'>
                                        {profileInfo.fullName}
                                    </Link>
                                    <span className='text-xs'>
                                        {-1} followers
                                    </span>
                                </div>
                                {myProfile._id !== profileInfo._id && (<div className='ml-auto'>
                                    {!myProfileFollowing.some(_profile => _profile.followingProfileID._id === profileInfo._id) && (
                                        <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profileInfo._id)}>
                                            <UserPlusIcon className='h-5' />
                                            <span>Follow</span>
                                        </button>
                                    )}
                                    {myProfileFollowing.some(_profile => _profile.followingProfileID._id === profileInfo._id) && (
                                        <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                                            <span>Following</span>
                                        </button>
                                    )}
                                </div>)}
                            </div>
                            <div className='flex mt-2'>
                                <span className='text-lg text-gray-500'>
                                    {profileInfo.bio.length > 80 ? `${profileInfo.bio.substring(0, 80)}...` : profileInfo.bio}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default ProfilesModal