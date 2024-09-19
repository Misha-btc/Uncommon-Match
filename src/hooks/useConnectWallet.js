import { useCallback } from 'react';
import { getAddress, AddressPurpose, BitcoinNetworkType } from 'sats-connect';

// Кастомный хук для подключения кошелька
const useConnectWallet = () => {

  const connectWallet = useCallback(async () => {
    try {
      return new Promise((resolve, reject) => {
        getAddress({
          payload: {
            purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
            message: "We need access to your wallet addresses to proceed.",
            network: {
              type: BitcoinNetworkType.Mainnet
            },
          },
          onFinish: (response) => {
            if (!response || !response.addresses) {
              reject({ success: false, error: 'Invalid response from wallet' });
              return;
            }
            const paymentAddressItem = response.addresses.find(
              (address) => address.purpose === AddressPurpose.Payment
            );
            const ordinalsAddressItem = response.addresses.find(
              (address) => address.purpose === AddressPurpose.Ordinals
            );

            resolve({
              success: true,
              paymentAddress: paymentAddressItem?.address,
              ordinalsAddress: ordinalsAddressItem?.address,
              paymentAddressType: paymentAddressItem?.addressType,
              ordinalsAddressType: ordinalsAddressItem?.addressType,
              paymentPublicKey: paymentAddressItem?.publicKey,
              ordinalsPublicKey: ordinalsAddressItem?.publicKey,
              networkType: response.addresses[0]?.network?.type || BitcoinNetworkType.Mainnet
            });
          },
          onCancel: () => {
            reject({ success: false, error: 'User canceled the request' });
          },
        });
      });
    } catch (err) {
      console.error('Error connecting wallet:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return { connectWallet };
};

export default useConnectWallet;