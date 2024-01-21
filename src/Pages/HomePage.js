import { useState, useEffect } from 'react';
import LoadingBox from '../components/LoadingBox';
import NFTCard from '../components/NFTCard';

function HomePage({NFTPlace}) {
    const[nfts, setNFTs] = useState();

    const loadProducts = async () => {
        if(NFTPlace == null)
            return;

        const items = [];
        const size = await NFTPlace.listingCounter();
        for (var i = 0; i < size; i++) {
            const item = await NFTPlace.listings(i);
            if(item.id == 0) 
                break;

            if(!item.sold && !item.cancelled)
                items.push(item)
        }

        setNFTs(items);
    }

    useEffect(() => { loadProducts() }, [NFTPlace]);
        
    return nfts ? 
        nfts.length > 0 ? 
        (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-8">
                {
                    nfts.map((nft) => (
                        <div key={nft.id} className="mb-3">
                            <NFTCard nft={nft}></NFTCard>
                        </div>
                    ))
                }
            </div>
        ) : 
        (
            <div className="text-center text-lg mt-8">No products</div>
        ) : 
    (
        <div className="text-center mt-8"><LoadingBox /></div>
    );
}

export default HomePage;