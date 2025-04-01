// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdChain {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 collectedAmount;
        string imageUrl;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _imageUrl
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[campaignCount];
        require(
            campaign.deadline < block.timestamp,
            "Deadline must be in the future"
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.deadline = _deadline;
        campaign.collectedAmount = 0;
        campaign.imageUrl = _imageUrl;

        campaignCount++;
        return campaignCount - 1;
    }

    function donateCamapaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.collectedAmount += amount;
            campaign.donators.push(msg.sender);
            campaign.donations.push(amount);
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        for (uint i = 0; i < campaignCount; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
