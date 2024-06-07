import { ethers } from 'ethers';

export const fetchEventFromTx = (txReciept: ethers.ContractReceipt, eventName: string) =>
  txReciept.events?.find(x => x.event === eventName);
