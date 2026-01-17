import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    twitterHandle?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    twitterHandle,
    type = 'website',
}) => {
    // Map generic type to valid Twitter Card type
    const twitterCardType = type === 'website' || type === 'article' ? 'summary_large_image' : 'summary';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            {title && <title>{title} | Latis</title>}
            {description && <meta name="description" content={description} />}

            {/* End standard metadata tags */}

            {/* Facebook tags */}
            {type && <meta property="og:type" content={type} />}
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            {/* End Facebook tags */}

            {/* Twitter tags */}
            {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
            <meta name="twitter:card" content={twitterCardType} />
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            {/* End Twitter tags */}
        </Helmet>
    );
};

export default SEO;
