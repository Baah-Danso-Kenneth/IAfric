#!/bin/bash
# django_lightning_startup.sh - Robust startup for Django testing with Lightning
# Verifies all dependencies and handles wallet states properly

set -e

# ─── Configuration ──────────────────────────────────────────────────────────────
# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Paths
LNBITS_DIR="$HOME/lnbits"
LND_DIR="$HOME/.lnd-regtest"
LND_LOG="$LND_DIR/lnd.log"
ENV_FILE="$LNBITS_DIR/.env"

# ─── Functions ──────────────────────────────────────────────────────────────────
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

kill_port() {
    local port=$1
    local name=$2
    if check_port $port; then
        echo -e "${YELLOW}⚠️  Stopping existing $name on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

wait_for_lnd() {
    local timeout=30
    echo -n "⏳ Waiting for LND to start"
    for ((i=0; i<timeout; i++)); do
        if check_port 8080 && lncli_exec "getinfo" >/dev/null 2>&1; then
            echo -e "\n${GREEN}✅ LND ready${NC}"
            return 0
        fi
        sleep 1
        echo -n "."
    done
    echo -e "\n${RED}❌ LND startup timed out${NC}"
    tail -n 20 "$LND_LOG"
    exit 1
}

lncli_exec() {
    lncli --lnddir="$LND_DIR" --network=regtest "$@"
}

# ─── Main Execution ─────────────────────────────────────────────────────────────
echo -e "${BLUE}🚀 Django Lightning Stack Startup${NC}"

# ─── Bitcoin Core ───────────────────────────────────────────────────────────────
echo -e "\n${BLUE}📊 Checking Bitcoin Core${NC}"
if check_port 18443; then
    BLOCKS=$(bitcoin-cli -regtest getblockcount 2>/dev/null || echo "unknown")
    BALANCE=$(bitcoin-cli -regtest getwalletinfo 2>/dev/null | grep '"balance"' | awk '{print $2}' | cut -d. -f1)
    echo -e "${GREEN}✅ Bitcoin Core running (${BLOCKS} blocks, ${BALANCE:-0} BTC)${NC}"
else
    echo -e "${RED}❌ Bitcoin Core not running. Starting...${NC}"
    bitcoind -regtest -daemon
    sleep 5
    echo -e "${GREEN}✅ Bitcoin Core started${NC}"
fi

# ─── LND ────────────────────────────────────────────────────────────────────────
echo -e "\n${BLUE}⚡ Initializing LND${NC}"
kill_port 8080 "LND"

# Start LND if not running
if ! check_port 8080; then
    echo -e "${YELLOW}⚠️  Starting LND (regtest)...${NC}"
    nohup lnd --lnddir="$LND_DIR" \
        --bitcoin.regtest \
        --bitcoin.node=bitcoind \
        --bitcoind.rpcuser=regtest \
        --bitcoind.rpcpass=regtest \
        --bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332 \
        --bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333 \
        --rpclisten=127.0.0.1:10009 \
        --restlisten=127.0.0.1:8080 \
        > "$LND_LOG" 2>&1 &

    # Wait for LND to start listening (but don't check wallet yet)
    echo -n "⏳ Waiting for LND RPC to start"
    for i in {1..30}; do
        if check_port 8080; then
            echo -e "\n${GREEN}✅ LND RPC ready${NC}"
            break
        fi
        sleep 1
        echo -n "."
        if [ $i -eq 30 ]; then
            echo -e "\n${RED}❌ LND RPC failed to start${NC}"
            tail -n 20 "$LND_LOG"
            exit 1
        fi
    done
fi

# Now handle wallet state with proper checks
echo -n "⏳ Checking wallet status"
for i in {1..10}; do
    WALLET_STATUS=$(lncli_exec walletstatus 2>&1 || true)

    if [[ "$WALLET_STATUS" == *"wallet not created"* ]]; then
        echo -e "\n${YELLOW}🔑 Creating new LND wallet${NC}"
        lncli_exec create
        break
    elif [[ "$WALLET_STATUS" == *"locked"* ]]; then
        echo -e "\n${YELLOW}🔐 Unlocking LND wallet${NC}"
        lncli_exec unlock
        break
    elif [[ "$WALLET_STATUS" == *"Wallet modified"* ]]; then
        echo -e "\n${GREEN}💰 Wallet ready${NC}"
        break
    fi

    sleep 1
    echo -n "."

    if [ $i -eq 10 ]; then
        echo -e "\n${RED}❌ Could not determine wallet status${NC}"
        echo "Last status: $WALLET_STATUS"
        exit 1
    fi
done

# Final verification
LND_INFO=$(lncli_exec getinfo 2>/dev/null || { echo -e "${RED}❌ LND still not responding properly${NC}"; exit 1; })
PUBKEY=$(echo "$LND_INFO" | grep identity_pubkey | cut -d'"' -f4)
echo -e "${GREEN}⚡ LND ready (PubKey: ${PUBKEY:0:12}...)${NC}"