import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';
import NoGSNCommunityAbi from '../utils/NoGSNCommunity.json';
import { getCommunityById } from '../api';
import { useMagic } from '../components/Store';
import { useGetUserInfo } from './useGetUserInfo';

export const useGetCommunityInfo = () => {
  const magic = useMagic();
  const { data: userInfo } = useGetUserInfo();

  return useQuery(
    'communityInfo',
    async function getCommunityInfo() {
      const didToken = await magic.user.getIdToken();
      const communityInfo = await getCommunityById(
        didToken,
        userInfo.communityID,
      );
      const communityAddress = communityInfo.addresses.find(
        a => a.blockchain === 'ETH',
      ).address;
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

      const contractAddress = communityAddress;
      const contractABI = NoGSNCommunityAbi.abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider,
      );

      // Send transaction to smart contract to update message and wait to finish
      const [nUsers, investedBalanceInfo] = await Promise.all([
        contract.numberOfMembers(),
        contract.getInvestedBalanceInfo(),
      ]);

      const numberOfMembers = BigNumber.from(nUsers).toNumber();
      const liquidityPoolBalance =
        Math.round(
          (Number(
            ethers.utils.formatUnits(investedBalanceInfo.investedBalance, 18),
          ) +
            Number.EPSILON) *
            100,
        ) / 100;

      return {
        communityInfo,
        communityAddress,
        numberOfMembers,
        liquidityPoolBalance,
      };
    },
    { enabled: !!userInfo },
  );
};