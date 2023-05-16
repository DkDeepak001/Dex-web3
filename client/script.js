const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer = null;
const tokenAbi = [
  "constructor(uint256 initalSupply)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
  "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];
const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const token = null;

const DexAbi = [
  "constructor(address _token, uint256 _tokenPrice)",
  "function buyToken(uint256 numbTokens) payable",
  "function getPrice(uint256 numbTokens) view returns (uint256)",
  "function getRemaingToken() view returns (uint256)",
  "function reciveToken()",
  "function token() view returns (address)",
  "function tokenPrice() view returns (uint256)",
  "function withDrawFunds()",
  "function withDrawToken()",
];
const DexAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const dex = null;

const init = async () => {
  if (token) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  dex = new ethers.Contract(DexAddress, DexAbi, signer);
};
