import { toNano } from '@ton/core';
import { FifteenMain } from '../wrappers/FifteenMain';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fifteenMain = provider.open(FifteenMain.createFromConfig({}, await compile('FifteenMain')));

    await fifteenMain.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(fifteenMain.address);

    // run methods on `fifteenMain`
}
