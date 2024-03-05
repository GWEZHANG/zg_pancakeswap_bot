/* 
Pancakeswap Sniper Trading Bot
Buy new bep20 tokens as soon as they launch on Pancakeswap.
*/
const ethers = require('ethers');
const addresses = {
WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
USDT: '0x55d398326f99059ff775485246999027b3197955',
pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
factoryAddress:'0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
recipient: '0x7628615ed89F38D2C479cCBE8102ab612Af0b7B4', // 你的BEP20钱包地址   ***
contractAddress: '0x9eaf5369c9a9809bad8716591f9b2f68124ccd63', // 准备购买的土狗合约地址  ***
contractCreator: '' // 扫描池子开启交易时的合约创建者地址（单纯买卖不用管这个参数）
}
 
const investmentAmount = '1'; // 买入金额，单位与28行代码一致，const tokenIn = addresses.USDT目前为USDT，将USDT修改为WBNB即为BNB交易对  ***
const profitXAmount = 2; //盈利倍数（单纯买卖不用设置）
const sellXamount = 1; // sell all（默认全部卖出）
const myGasLimit = 500000;//此处可提高gas
//const mnemonic = ''; // Wallet secret recovery phrase
const privateKey = 'e09d8b4cb7d2db2a2308599e7a1d7e48ce8e0c0a4bb49283e5c769a55d0a4fd1'; //  钱包私钥    ***
const myGasPrice = ethers.utils.parseUnits('5', 'gwei');
const myGasPriceForApproval = ethers.utils.parseUnits('5', 'gwei');
const node = 'wss://alpha-holy-snowflake.bsc.discover.quiknode.pro/c21403b518058e0a5fa88f209bb02a8700c9b506/';//wss://bsc-ws-node.nariox.org:443
//const wallet = new ethers.Wallet.fromMnemonic(mnemonic);
const wallet = new ethers.Wallet(privateKey);
const wsProvider = new ethers.providers.WebSocketProvider(node);
const account = wallet.connect(wsProvider); 
const tokenIn = addresses.USDT;
const BNBTEMP = addresses.WBNB;
const tokenOut = addresses.contractAddress;
const amountIn = ethers.utils.parseUnits(investmentAmount, 'ether');
const amountOutMin = ethers.utils.parseUnits('0','0');
var count = 0;
var sellCount = 0;
let pancakeFactoryABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

let pancakeAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const pancakeRouter = new ethers.Contract(
addresses.pancakeRouter,
pancakeAbi,
account
);
const pancakeFactory = new ethers.Contract(
	addresses.factoryAddress,
	pancakeFactoryABI,
	account
	);
let tokenAbi = [
	'function approve(address spender, uint amount) public returns(bool)',
	'function balanceOf(address account) external view returns (uint256)',
	'function decimals() external view returns (uint8)',
	'event Transfer(address indexed from, address indexed to, uint amount)',
	'function transfer(address to, uint amount) returns (bool)'
];

let contract = new ethers.Contract(addresses.contractAddress, tokenAbi, account);
//买入
const buy = async () =>{
	removeListeners();
	if (count == 0){
		count++;
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--正在买入--');
	const tx = await pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
		amountIn,
		amountOutMin,
		[tokenIn,BNBTEMP,tokenOut],
		addresses.recipient,
		Math.floor(Date.now() / 1000) + 60 * 4, 
		{
		value: 0,
		gasPrice: myGasPrice,
		gasLimit: myGasLimit
		}
		).catch(function(e){
			console.log('--买入失败，原因如下--');
			console.log(e);
			
		  });
		const receipt = await tx.wait();
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--自动买入成功--');
		approve();
		//process.exit(); 
		//checkForProfit();
	}
}

const removeListeners = async() =>{
	wsProvider.removeAllListeners("Pending" ,()=>{

    });
}
//授权
const approve = async () =>{
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--开始授权--');
	const valueToapprove = ethers.utils.parseUnits('1000000000000000000000000', 'ether');
	const tx = await contract.approve(
      pancakeRouter.address, 
      valueToapprove,
      {
          gasPrice: myGasPriceForApproval,
          gasLimit: 210000
      }
    );
    console.log('After Approve');
    const receipt = await tx.wait(); 
    console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--授权完成--');
    //console.log(receipt);
    //scanPair();
	checkForProfit();
	
}
//卖出
const sell = async () =>{
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--开始卖出--');
	if (sellCount == 0){
		sellCount++;
		let bal = await contract.balanceOf(addresses.recipient);
		const amountt = await pancakeRouter.getAmountsOut(bal,[tokenOut,BNBTEMP,tokenIn]);
		const amountsOutMin = amountt[1].sub(amountt[1].div(2)).div(sellXamount);
	    const tx = await pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
		amountt[0].div(sellXamount).toString(),
		amountsOutMin,
		[tokenOut,BNBTEMP,tokenIn],
		addresses.recipient,
		Math.floor(Date.now() / 1000) + 60 * 3, 
		{
		gasPrice: myGasPrice,
		gasLimit: myGasLimit
		}
		);
		const receipt = await tx.wait();
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--卖出成功--');
		//console.log(receipt);
		process.exit(); 
	}		
}

const checkForProfit = async() =>{
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--开始检查上涨--');
	let bal = await contract.balanceOf(addresses.recipient);
	let dec = await contract.decimals();
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'余额：'+bal* Math.pow(10, -dec));

	var myval = setInterval(async function(){
		
		const amount = await pancakeRouter.getAmountsOut(bal,[tokenOut,BNBTEMP, tokenIn]);
		
		const profitDesired = amountIn.mul(profitXAmount);
		
		const currentValue = amount[2];
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'当前价值（USDT）:', ethers.utils.formatUnits(currentValue),'期望价值（USDT）:', ethers.utils.formatUnits(profitDesired));
		if (currentValue.gte(profitDesired)){
			sell();
			clearInterval(myval);
			
		}
		
		
		},500);
	// contract.on("Transfer", async(from, to, value, event) => {
		
	// 	const amount = await pancakeRouter.getAmountsOut(bal,[tokenOut,BNBTEMP, tokenIn]);
		
	// 	const profitDesired = amountIn.mul(profitXAmount);
		
	// 	const currentValue = amount[2];
	// 	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'当前价值（USDT）:', ethers.utils.formatUnits(currentValue),'期望价值（USDT）:', ethers.utils.formatUnits(profitDesired));
	// 	if (currentValue.gte(profitDesired)){
	// 		sell();
	// 	}
		
	// }); 
}
	
const scanMempool = function(){
	console.log('--开始扫描交易--');
	wsProvider.on("Pending", (tx)  =>{
		wsProvider.getTransaction(tx).then(function(transaction){
			console.log('--正在扫描，请稍等...--');
			if (transaction != null) {
				//console.log(transaction);
				if (transaction.from.toLowerCase() == addresses.contractCreator.toLowerCase() && transaction.to.toLowerCase() == addresses.pancakeRouter.toLowerCase()){
					console.log('--开始买入--');
					buy();
				}
			}
		}).catch(function(e){
			console.log(e);
		}); 
	}); 
}
/*
时间转换  console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss'));
*/
const formatter = function(thistime, fmt) {
	let $this = new Date(thistime)
	let o = {
	  'M+': $this.getMonth() + 1,
	  'd+': $this.getDate(),
	  'h+': $this.getHours(),
	  'm+': $this.getMinutes(),
	  's+': $this.getSeconds(),
	  'q+': Math.floor(($this.getMonth() + 3) / 3),
	  'S': $this.getMilliseconds()
	}
	if (/(y+)/.test(fmt)) {
	  fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
	  if (new RegExp('(' + k + ')').test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
	  }
	}
	return fmt
  }

  /* 
 停止程序 
  */
const exitBot = function(){
	
	process.exit(); 
}
//检查LP
const scanPair = async () =>{
	
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--开始扫描LP--');
	const flg = '0x0000000000000000000000000000000000000000';
	let pairAddress = '';
	const pragramNum = 100000;
	let f = 1;
	while(1 == f)
	{
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+"--正在检查LP,请稍等...--");
		pairAddress = await pancakeFactory.getPair(addresses.WBNB,addresses.contractAddress);
		if(flg != pairAddress)
		{
			console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+"--LP已添加，检查流动性--");
			let bal;
			let balance;
			const dec = await contract.decimals();
			while(true)
			{
				bal = await contract.balanceOf(pairAddress);
				balance = bal* Math.pow(10, -dec);
				if(balance > pragramNum){
					console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--流动性已添加，LP余额为：'+bal* Math.pow(10, -dec)+',进行买入--');
					//exitBot();
					f = 2;
					buy();
					break;
				}
				console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--流动性未添加，LP余额为：'+bal* Math.pow(10, -dec));
			}
		}

		
	}


}
/*
挂单卖出
*/
const mySell = async() =>{
	const invest = '7';//买入金额
	const beishu= 2;//上涨倍数
	const Inamount = ethers.utils.parseUnits(invest, 'ether');
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'--开始检查上涨--');
	let bal = await contract.balanceOf(addresses.recipient);
	let dec = await contract.decimals();
	console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'余额：'+bal* Math.pow(10, -dec));

	var myval = setInterval(async function(){
		
		const amount = await pancakeRouter.getAmountsOut(bal,[tokenOut,BNBTEMP, tokenIn]);
		
		const profitDesired = Inamount.mul(beishu);
		
		const currentValue = amount[2];
		console.log(formatter(new Date(), 'yyyy-MM-dd hh:mm:ss')+'当前价值（USDT）:', ethers.utils.formatUnits(currentValue),'期望价值（USDT）:', ethers.utils.formatUnits(profitDesired));
		if (currentValue.gte(profitDesired)){
			sell();
			clearInterval(myval);
			
		}
		
		
		},500);
}

//待实现功能  貔貅前卖出  费率被修改前卖出  大额单出逃前卖出（监控合约调用此类方法）



//scanPair();
buy();

//mySell();
//sell();

