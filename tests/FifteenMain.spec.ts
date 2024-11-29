import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, fromNano, toNano } from '@ton/core';
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

        fifteenMain = blockchain.openContract(FifteenMain.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');
        console.log('deployer.getBalance:',fromNano(await deployer.getBalance())+ " TON");

        const deployResult = await fifteenMain.sendDeploy(deployer.getSender(), toNano('0.5'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fifteenMain.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fifteenMain are ready to use
    });
    
    it('should return balance', async () => {
        const currentBalance = await fifteenMain.getBalance();
        console.log("current balance:",fromNano(currentBalance)+ " TON");
    });
});
