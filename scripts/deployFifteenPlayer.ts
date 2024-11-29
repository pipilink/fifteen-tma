import { toNano } from '@ton/core';
import { FifteenPlayer } from '../wrappers/FifteenPlayer';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fifteenPlayer = provider.open(
        FifteenPlayer.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('FifteenPlayer')
        )
    );

    await fifteenPlayer.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(fifteenPlayer.address);

    console.log('ID', await fifteenPlayer.getID());
}
