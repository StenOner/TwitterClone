import { Suspense } from 'react'
import ExploreTweets from '@/components/ExploreTweets'
import Loading from '@/components/Loading'
import withAuth from '@/hocs/withAuth'

const Explore = ({ myProfile }) => {
    return (
        <div className='flex w-full pt-6'>
            <Suspense fallback={<Loading />}>
                <ExploreTweets profile={myProfile} />
            </Suspense>
        </div>
    )
}

export default withAuth(Explore)
