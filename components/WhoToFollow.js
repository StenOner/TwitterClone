import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import MiniProfile from './MiniProfile'
import useHttpToken from '@/hooks/use-http-token'

const WhoToFollow = ({ myProfile }) => {
    const [profiles, setProfiles] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!myProfile?._id) return
        sendRequest({ url: `who-to-follow/${myProfile._id}` }, ({ data }) => {
            setProfiles(data.profiles)
        })
    }, [myProfile, sendRequest])

    const deleteProfile = (profile) => {
        setProfiles((prevState) => {
            return prevState.filter((prev) => prev._id !== profile._id)
        })
    }

    return (
        <div className='flex flex-col w-full bg-white rounded-xl px-5 py-3'>
            <span className='font-semibold'>Who to Follow</span>
            <hr className='my-2' />
            <div className='flex flex-col space-y-6'>
                {profiles.map((profile, i) => (
                    <React.Fragment key={uuidv4()}>
                        <MiniProfile myProfile={myProfile} profile={profile} deleteProfileOnFollow={(profile) => deleteProfile(profile)} />
                        {i < profiles.length - 1 && (<hr />)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default WhoToFollow