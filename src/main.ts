import { BN } from "@coral-xyz/anchor";
import { SoundworkBidSDK, SoundworkListSDK } from "@jimii/soundwork-sdk";
import { LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { buyerKeypair, connection, nftMint, setBuyerProvider, setSellerProvider, userKeypair } from "./helpers";

let buyerProvider = setBuyerProvider();
let bidSDK = new SoundworkBidSDK(buyerProvider, connection);


let sellerProvider = setSellerProvider();
let listSDK = new SoundworkListSDK(sellerProvider, connection);


async function createListing() {
    let ix = await listSDK.createListing(nftMint, 1);
    let tx = new Transaction().add(ix);
    let txSig = await sendAndConfirmTransaction(sellerProvider.connection, tx, [
        userKeypair,
    ]);


    console.log(
        `create listing tx: https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    );
}


async function mainPlace() {
    let now = new Date();
    let expire_ts = now.setFullYear(now.getFullYear() + 1); // ! should default to a year

    let ix = await bidSDK.placeBid(
        nftMint,
        new BN(1 * LAMPORTS_PER_SOL),
        new BN(expire_ts),
    );
    let tx = new Transaction().add(ix);
    let txSig = await sendAndConfirmTransaction(buyerProvider.connection, tx, [
        buyerKeypair,
    ]);

    console.log(
        `create bid tx: https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    );
}

async function mainDelete() {
    let ix = await bidSDK.deleteBid(nftMint);
    let tx = new Transaction().add(ix);
    let txSig = await sendAndConfirmTransaction(buyerProvider.connection, tx, [buyerKeypair])


    console.log(
        `delete bid tx: https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    );
}

// async function deleteListing() {
//     let ix = await listSDK.deleteListing(nftMint);
//     let tx = new Transaction().add(ix);
//     let txSig = await sendAndConfirmTransaction(sellerProvider.connection, tx, [userKeypair])

//     console.log(
//         `delete listing tx: https://explorer.solana.com/tx/${txSig}?cluster=devnet`
//     );
// }

// createListing()
//     .then(() => "success creating a listing")
//     .catch((err) => console.error("error creating listing: ", err))

// mainPlace()
//     .then(() => "success placing a bid")
//     .catch((err) => console.error("error placing: ", err))

// mainDelete()
//     .then(() => "success deleting bid")
//     .catch((err) => console.error("error placing: ", err))


// deleteListing()
//     .then(() => "success deleting bid")
//     .catch((err) => console.error("error placing: ", err))

