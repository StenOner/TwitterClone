import { memo } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const ImageMediaContent = memo(({ src, className, style, alt }) => {
    const imageIsLocal = /(^\/)|(^blob:)|(^https*:\/\/)/g.test(src)

    return (
        <>
            <LazyLoadImage
                src={`${!imageIsLocal && src?.length > 0 ? IMAGE_BASE_URL : ''}${src}`}
                className={className}
                style={style ?? {}}
                alt={alt ?? ''} />
        </>
    )
})

export default ImageMediaContent