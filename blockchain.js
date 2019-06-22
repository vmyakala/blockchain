 const sha256 = require('sha256');
 const currentUrl = process.argv[4];

 Blockchain = function() 
{
	this.chain = [];
	this.pendingTransactions = [];
	this.currentUrl = currentUrl;
	this.networkNodes = [];
	this.createNewBlock(8, '0', '0'); //genesis block
}

Blockchain.prototype.createNewTransaction = function(amount, sender, receiver)
{
	const newTransaction = 
	{
		amount: amount,
		sender: sender,
		receiver: receiver
	};

	this.pendingTransactions.push(newTransaction);
	return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, currentHash)
{
	const newBlock = 
	{
		index: this.chain.length +1,
		timeStamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		previousBlockHash: previousBlockHash,
		currentHash: currentHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);
	return newBlock;
}

Blockchain.prototype.getLastBlock = function()
{
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createHash = function(nonce, previousBlockHash, currentBlockData)
{	
	//console.log("this is nonce:" +nonce);
	const stringData = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(stringData);
	//console.log("this is hash:" +hash);
	return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData)
{
	let nonce = 0;
	let hash = this.createHash(nonce, previousBlockHash, currentBlockData);
	while(hash.substring(0, 4) != '0000')
	{
		nonce++;
		hash = this.createHash(nonce, previousBlockHash, currentBlockData);
	}
	//console.log(nonce);
	//console.log(hash);
	return nonce;
}

module.exports = Blockchain;