import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { toEther } from '../utils/utils.js';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox.js';

function NftPage({NFTPlace}) {
    const params = useParams();
    const { collection, tokenId } = params;

    const [nft, setNft] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [imageURL, setImageURL] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const update = async () => { await updateInfo(); setLoading(false); }
        update();
        
    }, []);

    const updateInfo = async () => {
        let nft = await NFTPlace.getActiveListing(collection, tokenId);
        setNft(nft);
        console.log("token uri:");
        console.log(nft.tokenURI);
        const tokenURL = nft.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const tokenURIResponse = await (await fetch(tokenURL)).json();
        setImageURL(tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
        setName(tokenURIResponse.name);
        setDescription(tokenURIResponse.description);
    }

    const buy = async () => {
        try {
            let trx = await NFTPlace.buyNFT(nft.collection, nft.tokenId, {value: nft.price});
            await trx.wait();
        }
        catch(e){
            toast.error("An error ocurred");
            console.log(e);
            return;
        }

        toast.success("NFT bought");
    }

    return !loading ? (
        <div className="grid grid-cols-5 gap-10 mt-8">
            <div className="left-side col-span-2 border custom-border bg-white rounded p-10">
                <img className="object-contain object-top w-full max-h-96" src={imageURL} alt="" />
            </div>
            <div className="right-side col-span-3 custom-text-color">
                <p className="font-bold text-lg">{nft.name}</p>
                <p className="font-bold text-5xl pt-2 pb-4">{name}</p>
                <p className="font-light text-lg">Owned by {nft.seller}</p>
                <p className="font-normal text-lg border-t custom-border2 my-8 py-4">{description}</p>
                <p className="mt-3 font-normal">Price</p>
                <p className="mb-4 font-normal text-2xl">{toEther(nft.price)} ETH</p>
                <button className="custom-text-color custom-background2 text-white font-bold py-2 px-4 rounded" onClick={ () => buy() }>
                    Buy NFT
                </button>
            </div>
        </div>
    ) : (<LoadingBox />);
}

export default NftPage;