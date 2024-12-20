import { Address, Dictionary, toNano } from '@ton/core';
import { FifteenMain } from '../wrappers/FifteenMain';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fifteenMain = provider.open(
        FifteenMain.createFromConfig(
            {
                owner: Address.parse("UQCDqft28gjtWLjUCcNcMzHO5xjkalmawSSUlDO_IEuX63Ro"),       // Owner address
                profit: toNano(0),       // 0 - owner profit         
                interest: 0,             // 10 - current interest in %
                deposit: toNano(0),      // 0   get contract balance - profit
                fund: toNano(55),        // 55  TON => 55  | 27.5 | 13.75 | 6.875  
                bid: toNano(0.5),        // 0.5 TON => 0.5 | 0.25 | 0.125 | 0.0625
                bid_rate: 1,             // 1 => 1/1, 1/2, 1/4, 1/8
                stopped: false,          // game over? when fund < 6.875 TON
                warming: true,           // warming mode?
                last_time: 60000        // minimum time result for get prize
                //    player_codes: 0       // Dictionary<bigint, Cell> // player contract
            }, 
        await compile('FifteenMain')));

    await fifteenMain.sendDeploy(provider.sender(), toNano('0.5'));

    await provider.waitForDeploy(fifteenMain.address);

    // run methods on `fifteenMain`
}
