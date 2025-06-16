import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract, isLoading: contractLoading } = useContract("0xa693D451df258E9D2388B9AebC4a090F209c6a0e");
  const { mutateAsync: createCampaign, isLoading: writeLoading } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useMetamask();

  // ✅ Publish Campaign
  const publishCampaign = async (form) => {
    if (!contract || !createCampaign || !address) {
      console.error("Contract not ready or wallet not connected.");
      return;
    }

    try {
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  // ✅ Get All Campaigns
  const getCampaigns = async () => {
    if (!contract || typeof contract.call !== "function") {
      console.error("Contract not available or call method is missing.");
      return [];
    }

    try {
      const campaigns = await contract.call("getCampaigns");

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }
  };

  // ✅ Get Campaigns for Logged-in User
  const getUserCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      return allCampaigns.filter((campaign) => campaign.owner === address);
    } catch (error) {
      console.error("Failed to get user campaigns:", error);
      return [];
    }
  };

  // ✅ Donate to Campaign
  const donate = async (pId, amount) => {
    if (!contract || typeof contract.call !== "function") {
      console.error("Contract not available or call method is missing.");
      return;
    }

    try {
      const data = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });

      return data;
    } catch (error) {
      console.error("Donation failed:", error);
      return null;
    }
  };

  // ✅ Get Donations for a Campaign
  const getDonations = async (pId) => {
    if (!contract || typeof contract.call !== "function") {
      console.error("Contract not available or call method is missing.");
      return [];
    }

    try {
      const donations = await contract.call("getDonators", [pId]);

      const numberOfDonations = donations[0]?.length || 0;
      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString()),
        });
      }

      return parsedDonations;
    } catch (error) {
      console.error("Failed to get donations:", error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        contractLoading,
        writeLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
