import { memo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ImageMediaContent from './ImageMediaContent'

const ImageGallery = ({ images }) => {
    return (
        <>
            {images.map((image) => (
                <ImageMediaContent
                    key={uuidv4()}
                    src={image.content}
                    className='max-w-full max-h-40' />
            ))}
        </>
    )
}

export default memo(ImageGallery)