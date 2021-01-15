import { QRCode } from 'react-qrcode-logo';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { useGetDitoBalance } from '../../hooks/useGetDitoBalance';
import Card from '../../components/Card';
import { useGetCommunity } from '../../hooks/useGetCommunity';
import { useGetSkillWallet } from '../../hooks/useGetSkillWallet';

function QR() {
  const { data: userInfo } = useGetUserInfo();
  const { data: skillWallet } = useGetSkillWallet();
  const { data: ditoBalance } = useGetDitoBalance();
  const { data: community } = useGetCommunity();

  return (
    <div className="flex flex-col w-full h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center p-8 bg-denim md:w-1/2">
        <div className="flex items-center justify-center w-56 h-56 p-4 bg-ripe-lemon rounded-xl">
          {skillWallet ? (
            <QRCode
              value={JSON.stringify(skillWallet)}
              logoImage="/isologo.svg"
              logoWidth={60}
              logoHeight={60}
              bgColor="transparent"
              size={180}
            />
          ) : (
            'Loading QR code.'
          )}
        </div>
        <Card className="p-2 mt-10 bg-white">
          Scan Wallet’s QR-Code to verify new member.
        </Card>
      </div>
      <div className="flex items-center justify-center p-8 md:w-1/2">
        <Card className="flex flex-col items-center justify-center">
          <h3 className="text-2xl">Accepting Community</h3>
          <Card filled className="my-4">
            <p>{community ? community.communityInfo.name : '...'}</p>
          </Card>
          <h3 className="mb-4 text-2xl">Accepting Member</h3>
          <div className="flex items-center justify-around w-full p-4 bg-black rounded-xl">
            <p className="flex flex-col items-center justify-center text-white">
              <span className="text-4xl">👨</span>
              <span>{userInfo ? userInfo.username : '...'}</span>
            </p>
            <div className="flex flex-col items-center justify-start w-1/2 p-3 text-white">
              <span>DiTo</span>
              <img src="/dito-tokens.svg" />
              <h2 className="font-bold">
                {ditoBalance === -1
                  ? 'Loading dito balance...'
                  : ditoBalance || 0}
              </h2>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default QR;
