import { Cl } from "@stacks/transactions";
import { describe, expect, test } from "vitest";

const accounts = simnet.getAccounts();
const deployer = simnet.deployer;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;
const wallet4 = accounts.get('wallet_4')!;


describe("Fideicomiso Dinámico: Flujo Completo", () => {

    test("Debería ejecutar el ciclo de vida completo: Lock -> Bestow -> Setup -> Claim", () => {
        // 1. Lock inicial (73 STX)
        const lockTx = simnet.callPublicFn("timelocked-wallet", "lock",
            [Cl.principal(wallet1), Cl.uint(58), Cl.uint(74)], deployer);
        expect(lockTx.result).toBeOk(Cl.bool(true));

        // 2. Wallet 1 delega a Wallet 2
        const bestowTx = simnet.callPublicFn("timelocked-wallet", "bestow",
            [Cl.principal(wallet2)], wallet1);
        expect(bestowTx.result).toBeOk(Cl.bool(true));

        // VERIFICACIÓN INTERMEDIA: ¿Es Wallet 2 el beneficiario?
        const currentBeneficiary = simnet.getDataVar("timelocked-wallet", "beneficiary");
        expect(currentBeneficiary).toBeSome(Cl.principal(wallet2));

        // 3. Wallet 2 configura el Smart Claimant (setup-and-bestow)
        const setupTx = simnet.callPublicFn("smart-claimant", "setup-and-bestow",
            [Cl.list([Cl.principal(wallet3), Cl.principal(wallet4)])], wallet2);
        expect(setupTx.result).toBeOk(Cl.bool(true));

        // 4. Avance de tiempo y Claim final
        simnet.mineEmptyBlocks(58);
        const claimTx = simnet.callPublicFn("smart-claimant", "smart-claim", [], wallet3);
        expect(claimTx.result).toBeOk(Cl.bool(true));

        const assets = simnet.getAssetsMap();
        const stxBalances = assets.get('STX')!;
        const balanceW3 = stxBalances.get(wallet3)!;
        const balanceW4 = stxBalances.get(wallet4)!;

        expect(balanceW3).toBe(100000000000037n);
        expect(balanceW4).toBe(100000000000037n);
    });
});