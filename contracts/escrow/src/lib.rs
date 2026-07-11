#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Orchestrator,
    Agent,
    Token,
    Amount,
    IsSettled,
}

#[contract]
pub struct SorobanAgentEscrow;

#[contractimpl]
impl SorobanAgentEscrow {
    /// Initialize the escrow contract with roles and lock target amount.
    /// The orchestrator must have authorized this contract to draw the amount.
    pub fn initialize(
        env: Env,
        orchestrator: Address,
        agent: Address,
        token: Address,
        amount: i128,
    ) {
        if env.storage().instance().has(&DataKey::Orchestrator) {
            panic!("Contract already initialized");
        }
        
        env.storage().instance().set(&DataKey::Orchestrator, &orchestrator);
        env.storage().instance().set(&DataKey::Agent, &agent);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Amount, &amount);
        env.storage().instance().set(&DataKey::IsSettled, &false);

        // Transfer the funds from orchestrator into this escrow contract
        let client = token::Client::new(&env, &token);
        client.transfer(&orchestrator, &env.current_contract_address(), &amount);
    }

    /// Release locked funds directly to the hired agent.
    /// Can only be authorized and invoked by the orchestrator address.
    pub fn release(env: Env, orchestrator: Address) {
        orchestrator.require_auth();

        let saved_orchestrator: Address = env.storage().instance().get(&DataKey::Orchestrator).expect("Not initialized");
        if orchestrator != saved_orchestrator {
            panic!("Unauthorized: Caller is not the registered orchestrator");
        }

        let is_settled: bool = env.storage().instance().get(&DataKey::IsSettled).unwrap_or(false);
        if is_settled {
            panic!("Contract is already settled");
        }

        let agent: Address = env.storage().instance().get(&DataKey::Agent).expect("Agent missing");
        let token: Address = env.storage().instance().get(&DataKey::Token).expect("Token missing");
        let amount: i128 = env.storage().instance().get(&DataKey::Amount).expect("Amount missing");

        env.storage().instance().set(&DataKey::IsSettled, &true);

        // Transfer the funds out of this escrow contract to the agent
        let client = token::Client::new(&env, &token);
        client.transfer(&env.current_contract_address(), &agent, &amount);
    }

    /// Refund locked funds back to the orchestrator.
    /// Can only be authorized and invoked by the orchestrator address.
    pub fn refund(env: Env, orchestrator: Address) {
        orchestrator.require_auth();

        let saved_orchestrator: Address = env.storage().instance().get(&DataKey::Orchestrator).expect("Not initialized");
        if orchestrator != saved_orchestrator {
            panic!("Unauthorized: Caller is not the registered orchestrator");
        }

        let is_settled: bool = env.storage().instance().get(&DataKey::IsSettled).unwrap_or(false);
        if is_settled {
            panic!("Contract is already settled");
        }

        let token: Address = env.storage().instance().get(&DataKey::Token).expect("Token missing");
        let amount: i128 = env.storage().instance().get(&DataKey::Amount).expect("Amount missing");

        env.storage().instance().set(&DataKey::IsSettled, &true);

        // Refund funds back to the orchestrator
        let client = token::Client::new(&env, &token);
        client.transfer(&env.current_contract_address(), &orchestrator, &amount);
    }
}
