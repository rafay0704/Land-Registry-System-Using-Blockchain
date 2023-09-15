// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract landregistry {
    address payable contractOwner;

    constructor() {
        contractOwner = payable(msg.sender);
    }

    receive() external payable {
        msg.sender;
        msg.value;
    }

    struct Landreg {
        uint id;
        uint area;
        string landAddress;
        uint landPrice;
        string allLatitudeLongitude;
        uint propertyPID;
        string physicalSurveyNumber;
        string document;
        string landpic;
        bool isforSell;
        address payable ownerAddress;
        bool isLandVerified;
      
    }

    struct User {
        address id;
        string name;
        uint age;
        string city;
        string cinc;
        string document;
        string email;
        bool isUserVerified;
        string profilePic;
    }
    struct LandInspector {
        uint id;
        address _addr;
        string name;
        uint cnic;
        uint age;
        string designation;
        string city;
    }
    struct LandRequest {
        uint reqId;
        address payable sellerId;
        address payable buyerId;
        uint landId;
        string buyerMessage; // New field for the buyer's message
        reqStatus requestStatus;
        bool isPaymentDone;
    }

    enum reqStatus {
        requested,
        accepted,
        rejected,
        paymentdone,
        commpleted
    }

    uint public inspectorsCount;
    uint public userCount;
    uint public landsCount;
    uint public documentId;
    uint public requestCount;
    mapping(address => bool) public rejectedUsers;
    mapping(address => LandInspector) public InspectorMapping;
    mapping(uint => address[]) allLandInspectorList;
    mapping(address => bool) RegisteredInspectorMapping;
    mapping(address => User) public UserMapping;
    mapping(uint => address) AllUsers;
    mapping(uint => address[]) allUsersList;
    mapping(address => bool) RegisteredUserMapping;
    mapping(address => uint[]) MyLands;
    mapping(uint => Landreg) public lands;
    mapping(uint => LandRequest) public LandRequestMapping;
    mapping(address => uint[]) MyReceivedLandRequest;
    mapping(address => uint[]) MySentLandRequest;
    mapping(uint => uint[]) allLandList;
    mapping(uint => uint[]) paymentDoneList;
    mapping(address => mapping(uint => bool)) public userLandRequestSent;

    function isContractOwner(address _addr) public view returns (bool) {
        if (_addr == contractOwner) return true;
        else return false;
    }

    function changeContractOwner(address _addr) public {
        require(msg.sender == contractOwner, "you are not contractOwner");
        contractOwner = payable(_addr);
    }

    //-----------------------------------------------LandInspector-----------------------------------------------

    event LandRejected(uint indexed landId, address indexed inspector);

    function rejectAndRemoveLand(uint _landId) public {
        require(
            isLandInspector(msg.sender),
            "Only land inspectors can reject a land"
        );
        require(
            lands[_landId].isLandVerified == false,
            "Land is already verified"
        );
        // Emit the LandRejected event
        emit LandRejected(_landId, msg.sender);
        // Remove the land from the owner's account
        address owner = lands[_landId].ownerAddress;
        uint[] storage ownerLands = MyLands[owner];
        for (uint i = 0; i < ownerLands.length; i++) {
            if (ownerLands[i] == _landId) {
                ownerLands[i] = ownerLands[ownerLands.length - 1];
                ownerLands.pop();
                break;
            }
        }
        // Remove the land from the allLandList
        uint[] storage landList = allLandList[1];
        for (uint i = 0; i < landList.length; i++) {
            if (landList[i] == _landId) {
                landList[i] = landList[landList.length - 1];
                landList.pop();
                break;
            }
        }
        // Delete the land from the lands mapping
        delete lands[_landId];
    }

    function addLandInspector(
        address _addr,
        string memory _name,
        uint _cnic,
        uint _age,
        string memory _designation,
        string memory _city
    ) public returns (bool) {
        require(msg.sender == contractOwner, "You are not contractOwner");
        require(RegisteredInspectorMapping[_addr] == false, "New address");
        RegisteredInspectorMapping[_addr] = true;
        allLandInspectorList[1].push(_addr);
        InspectorMapping[_addr] = LandInspector(
            inspectorsCount,
            _addr,
            _name,
            _cnic,
            _age,
            _designation,
            _city
        );
        return true;
    }

    function ReturnAllLandIncpectorList()
        public
        view
        returns (address[] memory)
    {
        return allLandInspectorList[1];
    }

    function removeLandInspector(address _addr) public {
        require(msg.sender == contractOwner, "You are not contractOwner");
        require(RegisteredInspectorMapping[_addr], "Land Inspector not found");
        RegisteredInspectorMapping[_addr] = false;
        uint len = allLandInspectorList[1].length;
        for (uint i = 0; i < len; i++) {
            if (allLandInspectorList[1][i] == _addr) {
                allLandInspectorList[1][i] = allLandInspectorList[1][len - 1];
                allLandInspectorList[1].pop();
                break;
            }
        }
    }

    function isLandInspector(address _id) public view returns (bool) {
        if (RegisteredInspectorMapping[_id]) {
            return true;
        } else {
            return false;
        }
    }

    //-----------------------------------------------User-----------------------------------------------
    // Add a modifier to check if the sender is not a land inspector
    modifier notLandInspector() {
        require(
            !isLandInspector(msg.sender),
            "Land inspector cannot register as user"
        );
        _;
    }

    function isUserRejected(address _addr) public view returns (bool) {
        return rejectedUsers[_addr];
    }

    function isUserRegistered(address _addr) public view returns (bool) {
        if (RegisteredUserMapping[_addr]) {
            return true;
        } else {
            return false;
        }
    }

    function registerUser(
        string memory _name,
        uint _age,
        string memory _city,
        string memory _cinc,
        string memory _document,
        string memory _profilePic,
        string memory _email
    ) public notLandInspector {
        if (RegisteredUserMapping[msg.sender] == true) {
            return;
        } else {
            rejectedUsers[msg.sender] = false;
            RegisteredUserMapping[msg.sender] = true;
            userCount++;
            allUsersList[1].push(msg.sender);
            AllUsers[userCount] = msg.sender;
            UserMapping[msg.sender] = User(
                msg.sender,
                _name,
                _age,
                _city,
                _cinc,
                _document,
                _email,
                false,
                _profilePic
            );
        }
    }

    function verifyUser(address _userId) public {
        require(!isUserRejected(_userId), "This user is rejected");
        require(isLandInspector(msg.sender));
        UserMapping[_userId].isUserVerified = true;

        rejectedUsers[_userId] = false;
    }

    function rejectUser(address _userId) public {
        require(isLandInspector(msg.sender));

        // Set the user verification status to false and mark them as rejected
        UserMapping[_userId].isUserVerified = false;
        rejectedUsers[_userId] = true;
        // Delete the user's data from the mappings
        RegisteredUserMapping[_userId] = false;
        // Remove the user from the allUsersList and MyLands mappings
        uint len = allUsersList[1].length;
        for (uint i = 0; i < len; i++) {
            if (allUsersList[1][i] == _userId) {
                allUsersList[1][i] = allUsersList[1][len - 1];
                allUsersList[1].pop();
                break;
            }
        }
        len = MyLands[_userId].length;
        for (uint i = 0; i < len; i++) {
            uint landId = MyLands[_userId][i];
            delete lands[landId];
            for (uint j = 0; j < allLandList[1].length; j++) {
                if (allLandList[1][j] == landId) {
                    allLandList[1][j] = allLandList[1][
                        allLandList[1].length - 1
                    ];
                    allLandList[1].pop();
                    break;
                }
            }
        }
        delete MyLands[_userId];
    }

    function isUserVerified(address id) public view returns (bool) {
        return UserMapping[id].isUserVerified;
    }

    function ReturnAllUserList() public view returns (address[] memory) {
        return allUsersList[1];
    }

    function addLand(
        uint _area,
        string memory _address,
        uint _landPrice,
        string memory _allLatiLongi,
        uint _propertyPID,
        string memory _surveyNum,
        string memory _document,
        string memory _landpic
    ) public {
        require(isUserVerified(payable(msg.sender)));
        landsCount++;
        lands[landsCount] = Landreg(
            landsCount,
            _area,
            _address,
            _landPrice * 10 ** 18 / 10 ** 18,
            _allLatiLongi,
            _propertyPID,
            _surveyNum,
            _document,
            _landpic,
            false,
            payable(msg.sender),
            false
        );
        MyLands[msg.sender].push(landsCount);
        allLandList[1].push(landsCount);
    }

    // emit AddingLand(landsCount);
    function setProfilePic(string memory _profilePic) public {
        require(
            RegisteredUserMapping[msg.sender] == true,
            "User not registered"
        );
        UserMapping[msg.sender].profilePic = _profilePic;
    }

    function getUserProfilePic(address id) public view returns (string memory) {
        require(RegisteredUserMapping[id] == true, "User not registered");
        return UserMapping[id].profilePic;
    }

    function ReturnAllLandList() public view returns (uint[] memory) {
        return allLandList[1];
    }

    function verifyLand(uint _id) public {
        require(isLandInspector(msg.sender));
        lands[_id].isLandVerified = true;
    }

    function isLandVerified(uint id) public view returns (bool) {
        return lands[id].isLandVerified;
    }

    function myAllLands(address id) public view returns (uint[] memory) {
        return MyLands[id];
    }

    function makeItforSell(uint id) public {
        require(lands[id].ownerAddress == msg.sender);
        lands[id].isforSell = true;
    }

    function chnageLandPrice(uint _landId, uint _price) public {
        require(lands[_landId].ownerAddress == msg.sender);

        bool hasPendingRequest = false;
        for (uint i = 0; i < MyReceivedLandRequest[msg.sender].length; i++) {
            uint requestId = MyReceivedLandRequest[msg.sender][i];
            if (
                LandRequestMapping[requestId].landId == _landId &&
                (LandRequestMapping[requestId].requestStatus ==
                    reqStatus.accepted ||
                    LandRequestMapping[requestId].requestStatus ==
                    reqStatus.paymentdone)
            ) {
                hasPendingRequest = true;
                break;
            }
        }

        require(
            !hasPendingRequest,
            "Land has a accepted request or payment done"
        );
        lands[_landId].landPrice = _price * 10 ** 18/10 ** 18;
    }

    function requestforBuy(uint _landId, string memory _message) public {
        require(
            isUserVerified(msg.sender) && isLandVerified(_landId),
            "User not verified or land not verified"
        );
        require(
            !userLandRequestSent[msg.sender][_landId],
            "Request for this land already sent by the user"
        );

        requestCount++;
        LandRequestMapping[requestCount] = LandRequest(
            requestCount,
            lands[_landId].ownerAddress,
            payable(msg.sender),
            _landId,
            _message, // Include the buyer's message
            reqStatus.requested,
            false
        );

        userLandRequestSent[msg.sender][_landId] = true;
        MyReceivedLandRequest[lands[_landId].ownerAddress].push(requestCount);
        MySentLandRequest[msg.sender].push(requestCount);
    }

    function myReceivedLandRequests() public view returns (uint[] memory) {
        return MyReceivedLandRequest[msg.sender];
    }

    function mySentLandRequests() public view returns (uint[] memory) {
        return MySentLandRequest[msg.sender];
    }

    function acceptRequest(uint _requestId) public {
        require(LandRequestMapping[_requestId].sellerId == msg.sender);
        LandRequestMapping[_requestId].requestStatus = reqStatus.accepted;
        userLandRequestSent[LandRequestMapping[_requestId].buyerId][
            LandRequestMapping[_requestId].landId
        ] = false;
    }

    function rejectRequest(uint _requestId) public {
        require(LandRequestMapping[_requestId].sellerId == msg.sender);

        bool paymentDone = false;
        if (
            LandRequestMapping[_requestId].requestStatus ==
            reqStatus.paymentdone
        ) {
            paymentDone = true;
        }

        require(
            !paymentDone,
            "Payment already done for this land, cannot reject"
        );

        LandRequestMapping[_requestId].requestStatus = reqStatus.rejected;
        userLandRequestSent[LandRequestMapping[_requestId].buyerId][
            LandRequestMapping[_requestId].landId
        ] = false;
    }

    function requesteStatus(uint id) public view returns (bool) {
        return LandRequestMapping[id].isPaymentDone;
    }

    function landPrice(uint id) public view returns (uint) {
        return lands[id].landPrice;
    }

    // event Purchase(
    //     address indexed buyer,
    //     address indexed seller,
    //     uint landPrice,
    //     uint amountPaid
    // );

    
    //  function makePayment(
    //     address payable _receiver,
    //     uint _requestId
    // ) public payable {
    //     if (
    //         LandRequestMapping[_requestId].buyerId == msg.sender &&
    //         LandRequestMapping[_requestId].requestStatus ==
    //         reqStatus.accepted &&
    //         LandRequestMapping[_requestId].sellerId == _receiver &&
    //         msg.value == lands[LandRequestMapping[_requestId].landId].landPrice
    //     ) {
    //         LandRequestMapping[_requestId].requestStatus = reqStatus
    //             .paymentdone;
    //         LandRequestMapping[_requestId].isPaymentDone = true;
    //         paymentDoneList[1].push(_requestId);
    //         _receiver.transfer(msg.value);
    //         emit Purchase(
    //             msg.sender,
    //             _receiver,
    //             lands[LandRequestMapping[_requestId].landId].landPrice,
    //             msg.value
    //         );
    //         userLandRequestSent[msg.sender][
    //             LandRequestMapping[_requestId].landId
    //         ] = false;
    //     } else {
    //         revert();
    //     }
    // }
 event Purchase(address indexed buyer, address indexed seller, uint landPrice, uint amountPaid);

        function makePayment(address payable _receiver, uint _requestId) public payable {
    if(LandRequestMapping[_requestId].buyerId == msg.sender && 
            LandRequestMapping[_requestId].requestStatus == reqStatus.accepted &&
            LandRequestMapping[_requestId].sellerId == _receiver && 
            msg.value == lands[LandRequestMapping[_requestId].landId].landPrice)
            {
    LandRequestMapping[_requestId].requestStatus = reqStatus.paymentdone;
    LandRequestMapping[_requestId].isPaymentDone = true;
    paymentDoneList[1].push(_requestId);
    _receiver.transfer(msg.value);
    
    emit Purchase(msg.sender,_receiver,lands[LandRequestMapping[_requestId].landId].landPrice,msg.value);
    }
    else{
        revert();
    }
    
}

    function returnPaymentDoneList() public view returns (uint[] memory) {
        return paymentDoneList[1];
    }

    function cancelLandSale(uint _landId) public {
        require(
            lands[_landId].ownerAddress == msg.sender,
            "Only the land owner can cancel the sale"
        );
        require(lands[_landId].isforSell == true, "The land is not for sale");

        // Check if there's a request with payment done for this land
        bool paymentDone = false;
        for (uint i = 0; i < MyReceivedLandRequest[msg.sender].length; i++) {
            uint requestId = MyReceivedLandRequest[msg.sender][i];
            if (
                LandRequestMapping[requestId].landId == _landId &&
                LandRequestMapping[requestId].requestStatus ==
                reqStatus.paymentdone
            ) {
                paymentDone = true;
                break;
            }
        }

        require(
            !paymentDone,
            "Payment already done for this land, cannot cancel"
        );

        // Remove the land from the landsGallery (allLandList[1])
        uint len = allLandList[1].length;
        for (uint i = 0; i < len; i++) {
            if (allLandList[1][i] == _landId) {
                allLandList[1][i] = allLandList[1][len - 1];
                allLandList[1].pop();
                break;
            }
        }

        // Change the status of the land to not for sale
        lands[_landId].isforSell = false;

        // Cancel all sent and received requests for the land
        len = MySentLandRequest[msg.sender].length;
        for (uint i = 0; i < len; i++) {
            uint requestId = MySentLandRequest[msg.sender][i];
            if (LandRequestMapping[requestId].landId == _landId) {
                LandRequestMapping[requestId].requestStatus = reqStatus
                    .rejected;
                userLandRequestSent[LandRequestMapping[requestId].buyerId][
                    _landId
                ] = false;
                break;
            }
        }

        len = MyReceivedLandRequest[msg.sender].length;
        for (uint i = 0; i < len; i++) {
            uint requestId = MyReceivedLandRequest[msg.sender][i];
            if (LandRequestMapping[requestId].landId == _landId) {
                LandRequestMapping[requestId].requestStatus = reqStatus
                    .rejected;
                userLandRequestSent[LandRequestMapping[requestId].buyerId][
                    _landId
                ] = false;
                break;
            }
        }
    }

   function transferOwnership(
    uint _requestId,
    string memory documentUrl
) public returns (bool) {
    require(isLandInspector(msg.sender));
    if (LandRequestMapping[_requestId].isPaymentDone == false) {return false;}
    
     documentId++;
    // Update the request status to completed
    LandRequestMapping[_requestId].requestStatus = reqStatus.commpleted;

    // Add the land to the buyer's list of owned lands
    MyLands[LandRequestMapping[_requestId].buyerId].push(
        LandRequestMapping[_requestId].landId
    );

    // Remove the land from the seller's list of owned lands
    uint len = MyLands[LandRequestMapping[_requestId].sellerId].length;
    for (uint i = 0; i < len; i++) {
        if (
            MyLands[LandRequestMapping[_requestId].sellerId][i] ==
            LandRequestMapping[_requestId].landId
        ) {
            MyLands[LandRequestMapping[_requestId].sellerId][i] = MyLands[
                LandRequestMapping[_requestId].sellerId
            ][len - 1];
            MyLands[LandRequestMapping[_requestId].sellerId].pop();
            break;
        }
    }

    // Update the land details
    lands[LandRequestMapping[_requestId].landId].document = documentUrl;
    lands[LandRequestMapping[_requestId].landId].isforSell = false;
    lands[LandRequestMapping[_requestId].landId].ownerAddress = LandRequestMapping[_requestId].buyerId;

   

    return true;
}



    function getTotalLands() public view returns (uint) {
        return landsCount;
    }

    function getTotalUnverifiedUsers() public view returns (uint) {
        uint unverifiedUsers = 0;
        for (uint i = 0; i < userCount; i++) {
            address userAddress = AllUsers[i + 1];
            if (!UserMapping[userAddress].isUserVerified) {
                unverifiedUsers++;
            }
        }
        return unverifiedUsers;
    }

    function getTotalVerifiedUsers() public view returns (uint) {
        uint verifiedUsers = 0;
        for (uint i = 0; i < userCount; i++) {
            address userAddress = AllUsers[i + 1];
            if (UserMapping[userAddress].isUserVerified) {
                verifiedUsers++;
            }
        }
        return verifiedUsers;
    }

    function getTotalPaymentDoneLands() public view returns (uint) {
        return paymentDoneList[1].length;
    }

    function getTotalRequests() public view returns (uint) {
        return requestCount;
    }

    function getTotalRegisteredLands() public view returns (uint) {
        return landsCount;
    }

    function getTotalUnverifiedLands() public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= landsCount; i++) {
            if (!lands[i].isLandVerified) {
                count++;
            }
        }
        return count;
    }
}
