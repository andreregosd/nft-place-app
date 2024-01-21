import { useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from "ethers";
import { toWei } from '../utils/utils.js';
import { nftAbi } from '../constants/constants.js';

function SellPage({NFTPlace, signer}) {
    const [nftAddress, setNftAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState(0);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if(nftAddress.length != 42 || nftAddress.substr(0, 2) != '0x'){
            toast.error("Invalid address");
            return;
        }

        try {
            const nftContract = await new ethers.Contract(nftAddress, nftAbi, signer);
            let tx = await nftContract.approve(NFTPlace.target, tokenId);
            tx.wait();
            
            let trx = await NFTPlace.listNFT(nftAddress, tokenId, toWei(price));
            trx.wait();
        }
        catch(e){
            toast.error("An error ocurred");
            console.log(e);
            return;
        }

        toast.success("NFT listed");
    }

    const validateAndSetTokenId = (value) => {
        let pattern = /^[0-9]*$/;
        if(value != "" && !pattern.test(value))
            return;
        setTokenId(value);
    }

    const validateAndSetPrice = (value) => {
        let pattern = /^[0-9]+(\.)?[0-9]*$/;
        if(value != "" && !pattern.test(value))
            return;
        setPrice(value);
    }

    return (
        <div className="max-w-lg mx-auto p-10 custom-text-color border bg-white custom-border rounded-lg shadow relative top-10">
            <form onSubmit={submitHandler}>
                <h5 class="text-xl font-medium mb-6">Sell your NFT</h5>
                <div className="form-group mb-4">
                    <label className="block mb-2 text-sm font-medium">NFT address</label>
                    <input 
                        type="text" 
                        value={nftAddress} 
                        onChange={ (e) => setNftAddress(e.target.value) } 
                        className="bg-gray-50 border custom-border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </input>
                </div>
                <div className="form-group mb-4">
                <label className="block mb-2 text-sm font-medium">Token ID</label>
                    <input 
                        type="text" 
                        value={tokenId} 
                        onChange={ (e) => validateAndSetTokenId(e.target.value) } 
                        className="bg-gray-50 border custom-border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </input>
                </div>
                <div className="form-group mb-4">
                    <label className="block mb-2 text-sm font-medium">Price</label>
                    <input 
                        type="text" 
                        value={price} 
                        onChange={ (e) => validateAndSetPrice(e.target.value) } 
                        className="bg-gray-50 border custom-border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </input>
                </div>
                <button type="submit" className="custom-text-color mt-2 custom-background2 text-white font-bold py-2 px-4 rounded">
                    List NFT
                </button>
            </form>
        </div>
    );
}

export default SellPage;