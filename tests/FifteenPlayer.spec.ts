import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FifteenPlayer } from '../wrappers/FifteenPlayer';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FifteenPlayer', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FifteenPlayer');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fifteenPlayer: SandboxContract<FifteenPlayer>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fifteenPlayer = blockchain.openContract(
            FifteenPlayer.createFromConfig(
                {
                    id: 1000,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await fifteenPlayer.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fifteenPlayer.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fifteenPlayer are ready to use
    });

    it('should get Player ID', async () => {
        const playerID = await fifteenPlayer.getID();
        console.log('Player ID:',playerID);
    });        


    // it('should increase counter', async () => {
    //     const increaseTimes = 3;
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i + 1}/${increaseTimes}`);

    //         const increaser = await blockchain.treasury('increaser' + i);

    //         const counterBefore = await fifteenPlayer.getCounter();

    //         console.log('counter before increasing', counterBefore);

    //         const increaseBy = Math.floor(Math.random() * 100);

    //         console.log('increasing by', increaseBy);

    //         const increaseResult = await fifteenPlayer.sendIncrease(increaser.getSender(), {
    //             increaseBy,
    //             value: toNano('0.05'),
    //         });

    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: fifteenPlayer.address,
    //             success: true,
    //         });

    //         const counterAfter = await fifteenPlayer.getCounter();

    //         console.log('counter after increasing', counterAfter);

    //         expect(counterAfter).toBe(counterBefore + increaseBy);
    //     }
    // });
});
