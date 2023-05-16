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
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let token = null;

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
const DexAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
let dex = null;

const init = async () => {
  if (token) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  dex = new ethers.Contract(DexAddress, DexAbi, signer);
};

const getPrice = async () => {
  await init();
  const price = await dex.getPrice(1);
  document.getElementById("price").innerHTML = price.toString();
  return parseInt(price);
};

const getBalance = async () => {
  await init();
  const balance = await token.balanceOf(signer.getAddress());
  document.getElementById("balance").innerHTML = balance.toString();
};

const getToken = async () => {
  await init();
  const remaingToken = await dex.getRemaingToken();
  document.getElementById("token").innerHTML = remaingToken.toString();
};

const access = async () => {
  try {
    await init();
    const value = document.getElementById("token").value;
    await token.approve(DexAddress, parseInt(value));
  } catch (error) {
    console.log(error);
  }
};

const sell = async () => {
  try {
    await init();
    await dex.reciveToken();
  } catch (error) {
    console.log(error);
  }
};

const buy = async () => {
  try {
    await init();
    const value = document.getElementById("buy").value;

    const tokenAmoint = parseInt(value) * (await getPrice());
    const buy = await dex.buyToken(parseInt(value), {
      value: parseInt(tokenAmoint),
    });
    console.log(buy);
  } catch (error) {
    console.log(error);
  }
};
