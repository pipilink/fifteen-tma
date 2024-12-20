import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, fromNano, toNano } from '@ton/core';
import { FifteenMain } from '../wrappers/FifteenMain';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FifteenMain', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FifteenMain');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fifteenMain: SandboxContract<FifteenMain>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer= await blockchain.treasury('deployer');

        fifteenMain = blockchain.openContract(FifteenMain.createFromConfig({
            owner:  Address.parse('UQCDqft28gjtWLjUCcNcMzHO5xjkalmawSSUlDO_IEuX63Ro'),       // Owner address
            profit: 0n,              // 0 - owner profit         
            interest: 10,            // 10 - current interest in %
            deposit: 0n,             // 0   get contract balance - profit
            fund: toNano(55),        // 55  TON => 55  | 27.5 | 13.75 | 6.875  
            bid: toNano(0.5),        // 0.5 TON => 0.5 | 0.25 | 0.125 | 0.0625
            bid_rate: 1,             // 1 => 1/1, 1/2, 1/4, 1/8
            stopped: false,          // game over? when fund < 6.875 TON
            warming: true,           // warming mode?
            last_time: 60000        // minimum time result for get prize
            // player_codes: 0          // Dictionary<bigint, Cell> // player contract
        }, code));

        const deployResult = await fifteenMain.sendDeploy(deployer.getSender(), toNano('0.5'));

        console.log('deployer.address:',deployer.address,'to:',fifteenMain.address);

        // expect(deployResult.transactions).toHaveTransaction({
        //     from: deployer.address,
        //     to: fifteenMain.address,
        //     deploy: true,
        //     success: true,
        // });

    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fifteenMain are ready to use
        // console.log(toNano("0.5"));
        // console.log(toNano("0.25"));
        // console.log(toNano("0.125"));
        // console.log(toNano("0.065"));

    });
    
    it('should return balance', async () => {
        const currentBalance = await fifteenMain.getBalance();
        console.log("current balance:",fromNano(currentBalance)+ " TON");
        
    });

    it('should return Owner', async () => {
        const currentOwner = await fifteenMain.getOwner();
        console.log("Owner:", currentOwner);
        // Address.parse('UQCDqft28gjtWLjUCcNcMzHO5xjkalmawSSUlDO_IEuX63Ro')
    });

    it('should return State', async () => {
        const currentState = await fifteenMain.getState();
        console.log("State:", currentState);
    });


});
