import { MagicContext, UserInfoContext } from "../../components/Store";

import { useContext, useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { useForm } from "react-hook-form";


import Layout from "../../components/Layout";
import CommunityTreasuryForm from "../../components/treasury/CommunityTreasuryForm"
import CheckupCard from "../../components/community/CheckupCard"

import communityContractAbi from "../../utils/communityContractAbi.json";
import NoGSNCommunityAbi from "../../utils/NoGSNCommunity.json";

import { Router, useRouter } from "next/router";
function CommunityTreasury() {
    const [userInfo, setUserInfo] = useContext(UserInfoContext);
    const [magic] = useContext(MagicContext);
    const router = useRouter();
    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    const [communities, setCommunities] = useState([]);
    const [isJoining, setIsJoining] = useState(false);
    const [numOfMembers, setNumOfMembers] = useState(0);
    const [liquidityPoolBalance, setLiquidityPoolBalance] = useState(0);
    const [liquidityPoolAPY, setLiquidityPoolAPY] = useState(0);
    const [amountToInvest, setAmountToInvest] = useState(0);


    useEffect(() => {
        (async () => {
            await getCommunityInfo();
        })();
    }, []);

    async function getCommunityInfo() {
        await window.ethereum.enable();

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
            const signer = provider.getSigner();

            // Get user's Ethereum public address
            const address = await signer.getAddress();
            let contractAddress = ''

            console.log(userInfo)

            for (let communityContractAddress of userInfo.communityContract.addresses) {
                if (communityContractAddress.blockchain === 'ETH') contractAddress = communityContractAddress.address
            }

            const contractABI = NoGSNCommunityAbi.abi;
            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                provider
            );



            // Send transaction to smart contract to update message and wait to finish
            // const [nUsers, investedBalance] = await Promise.all([
            //     contract.numberOfMembers(),
            //     contract.getInvestedBalanceInfo()
            // ]);

            const numberOfMembersTX = await contract.numberOfMembers();

            console.log('here', numberOfMembersTX)


            const getInvestedBalanceTX = await contract.getInvestedBalanceInfo();

            console.log(
                BigNumber.from(nUsers).toNumber(),
                BigNumber.from(investedBalance).toNumber()
            );

            setNumOfMembers(BigNumber.from(nUsers).toNumber());
            setLiquidityPoolBalance(BigNumber.from(investedBalance).toNumber());
        } catch (err) {
            console.error(err);
        }
    }
    const onSubmit = (data) => {
        if (data["DAI"] === false && data["USDC"] === false) {
            setError("currency", { type: "manual", message: "You need to pick one currency to stake" })
            return;
        }
        if (data["DAI"] === true && data["USDC"] === true) {
            setError("currency", { type: "manual", message: "You can only pick one currency to stake" })
            return;
        }
        console.log(data)
    }

    return (
        <Layout
            navBar
            flex
            logo
            splash={{
                color: "blue",
                variant: "default",
                alignment: "left",
                isTranslucent: false,
                fullHeight: false
            }}
        >
            <div className="w-full">
                <div style={{ height: "90%" }} className="flex">
                    <div className="flex flex-col items-center w-full">
                        <h1 className="mt-5 underline text-black text-center text-4xl">
                            Community Treasury
                        </h1>
                        <form>
                            <CommunityTreasuryForm register={register} errors={errors} clearErrors={clearErrors} />
                        </form>

                    </div>
                    <CheckupCard />
                </div>
                <div className="flex border-t-2 justify-center border-gray-600">
                    <button type="button" onClick={handleSubmit(onSubmit)} className="border-2 mt-3 border-blue-600 text-2xl underline w-8/12">Stake and fund your community!</button>
                </div>
            </div>

        </Layout>
    );
}

export default CommunityTreasury;
