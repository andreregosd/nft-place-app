import { useState, useEffect } from 'react';
import { toEther } from '../utils/utils.js';
import { Link } from 'react-router-dom';

function NFTCard(props){
    const { nft } = props;
    const [name, setName] = useState();
    const [imageURL, setImageURL] = useState();
    
    useEffect(() => {
        updateInfo();
    }, []);

    const updateInfo = async () => {
        const tokenURL = nft.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const tokenURIResponse = await (await fetch(tokenURL)).json();
        setImageURL(tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
        setName(tokenURIResponse.name);
    }

    return (
        <div className="nft-card max-w-full bg-white border hover:border-4 custom-border rounded-lg shadow transition-all">
            <Link to={`/nft/${nft.collection}/${nft.tokenId}`}>
                <img className="object-contain object-top h-48 w-full" src={imageURL} alt="" />
            </Link>
            <div className="p-4">
                <Link className="" to={`/nft/${nft.collection}/${nft.tokenId}`}>
                    <p className="font-bold text-sm custom-text-color">{nft.name}</p>
                </Link>
                <Link className="" to={`/nft/${nft.collection}/${nft.tokenId}`}>
                    <h5 className="mb-2 text-xl font-base tracking-tight custom-text-color">{name}</h5>
                </Link>
                <p className="mt-3 text-sm font-bold custom-text-color underline">{toEther(nft.price)} ETH</p>
            </div>
        </div>
      );
}

export default NFTCard;