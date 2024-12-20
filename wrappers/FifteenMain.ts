import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Dictionary, 
    Sender, 
    SendMode, 
    Slice} from '@ton/core';
import { SandboxContract, TreasuryContract } from '@ton/sandbox';

//export type FifteenMainConfig = {};
export interface WinnersBoard {
    player: Address;      // Player address
    result: bigint;       // Ms 60000 - 10min
    date: bigint;         // UnixTime Now()
    userid: bigint;       // Telegram UserID
    paid: bigint;         // Paid TONs
}


export interface FifteenMainConfig {
    //owner: Sender; //SandboxContract<TreasuryContract>; // Address;       // Owner address
    owner:  Address;       // Owner address
    profit: bigint;       // 0 - owner profit         
    interest: number;     // 10 - current interest in %
    deposit: bigint;      // 0   get contract balance - profit
    fund: bigint;         // 55  TON => 55  | 27.5 | 13.75 | 6.875  
    bid: bigint;          // 0.5 TON => 0.5 | 0.25 | 0.125 | 0.0625
    bid_rate: number;     // 1 => 1/1, 1/2, 1/4, 1/8
    stopped: boolean;     // game over? when fund < 6.875 TON
    warming: boolean;     // warming mode?
    last_time: number;    // minimum time result for get prize
//    player_codes: number; //Dictionary<number, Cell>; // player contract
}

export function fifteenMainConfigToCell(config: FifteenMainConfig): Cell {
    return beginCell()
    .storeAddress(config.owner)
    .storeCoins(config.profit)
    .storeInt(config.interest,8)
    .storeCoins(config.deposit)
    .storeCoins(config.fund)
    .storeCoins(config.bid)
    .storeInt(config.bid_rate,8)
    .storeBit(config.stopped)
    .storeBit(config.warming)
    .storeInt(config.last_time,32)
    //.storeUint(config.player_codes,32) //.storeDict()
    .endCell();
}

export class FifteenMain implements Contract {
    constructor(
        readonly address: Address, 
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new FifteenMain(address);
    }

    static createFromConfig(config: FifteenMainConfig, code: Cell, workchain = 0) {
        const data = fifteenMainConfigToCell(config);
        const init = { code, data };
        return new FifteenMain(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getBalance(provider: ContractProvider) {
        const result = await provider.get('current_balance', []);
        return result.stack.readNumber();
    }

    async getStateBalance(provider: ContractProvider): Promise<bigint> {
        const state = await provider.getState()
        return state.balance
    }

    async getOwner(provider: ContractProvider) {
        const result = await provider.get('get_owner', []);
        return result.stack.readAddress();
    }

    async getState(provider: ContractProvider) {
        const result = await provider.get('get_state', []);
        return result.stack;
    }

}
