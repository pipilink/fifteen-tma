import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FifteenMainConfig = {};

export function fifteenMainConfigToCell(config: FifteenMainConfig): Cell {
    return beginCell().endCell();
}

export class FifteenMain implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

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

}
