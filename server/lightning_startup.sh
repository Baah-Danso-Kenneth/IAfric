#!/bin/bash
# django_lightning_startup.sh - Ultra-quick startup for Django testing
# Assumes Bitcoin Core regtest and LND are already configured

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Your specific paths
LNBITS_DIR="/home/gee/lnbits"
LND_DIR="/home/gee/.lnd-regtest"

echo -e "${BLUE}🚀 Django Lightning Stack Startup${NC}"

# Function to check if process is running on port
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2
    if check_port $port; then
        echo -e "${YELLOW}⚠️  Stopping existing $name on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Checking Current Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check Bitcoin Core
if check_port 18443; then
    BLOCKS=$(br getblockcount 2>/dev/null || echo "unknown")
    BALANCE=$(br getwalletinfo 2>/dev/null | grep '"balance"' | cut -d: -f2 | cut -d, -f1 | tr -d ' ' || echo "unknown")
    echo -e "${GREEN}✅ Bitcoin Core: Running ($BLOCKS blocks, $BALANCE BTC)${NC}"
else
    echo -e "${RED}❌ Bitcoin Core not running - starting with your brstart alias...${NC}"
    # Use your alias equivalent
    bitcoind -regtest -daemon
    sleep 5
    echo -e "${GREEN}✅ Bitcoin Core started${NC}"
fi

# Check LND
if check_port 8080; then
    LND_INFO=$(lncli-regtest getinfo 2>/dev/null || echo "LOCKED")
    if [[ "$LND_INFO" == *"identity_pubkey"* ]]; then
        echo -e "${GREEN}✅ LND: Running and unlocked${NC}"
    else
        echo -e "${YELLOW}🔐 LND running but wallet locked - unlocking...${NC}"
        echo "Enter your LND wallet password when prompted:"
        lncli-regtest unlock
    fi
else
    echo -e "${RED}❌ LND not running - starting...${NC}"
    # Start LND with your exact configuration
    nohup lnd --lnddir="$LND_DIR" \
        --bitcoin.regtest --bitcoin.node=bitcoind \
        --bitcoind.rpcuser=regtest --bitcoind.rpcpass=regtest \
        --bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332 \
        --bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333 \
        --listen=127.0.0.1:9735 \
        --rpclisten=127.0.0.1:10009 --restlisten=127.0.0.1:8080 \
        > "$LND_DIR/lnd.log" 2>&1 &

    echo "⏳ Waiting for LND to start..."
    for i in {1..30}; do
        if check_port 8080; then break; fi
        sleep 1
        echo -n "."
    done
    echo ""

    if check_port 8080; then
        echo -e "${GREEN}✅ LND started - please unlock wallet:${NC}"
        lncli-regtest unlock
    else
        echo -e "${RED}❌ LND failed to start${NC}"
        exit 1
    fi
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}💡 Starting LNbits${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Stop any existing LNbits
kill_port 5000 "LNbits"

# Navigate to LNbits directory
cd "$LNBITS_DIR"
echo "📁 Working in: $(pwd)"

# Activate pyenv environment
echo "🐍 Activating lnbits-env..."
if command -v pyenv >/dev/null 2>&1; then
    pyenv activate lnbits-env 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not activate lnbits-env, using current environment${NC}"
    }
fi

# Start LNbits
echo "🚀 Starting LNbits server..."
nohup uvicorn lnbits.__main__:app --host 127.0.0.1 --port 5000 > lnbits.log 2>&1 &
LNBITS_PID=$!

# Wait for LNbits to be ready
echo "⏳ Waiting for LNbits..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:5000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ LNbits is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Quick API Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test LNbits API with your admin key
ADMIN_KEY="02dcd77469ac4359a1a96fc6ba7cb551"
WALLET_RESPONSE=$(curl -s -H "X-Api-Key: $ADMIN_KEY" "http://127.0.0.1:5000/api/v1/wallet" 2>/dev/null || echo "FAILED")

if [[ "$WALLET_RESPONSE" == *"balance"* ]]; then
    BALANCE=$(echo "$WALLET_RESPONSE" | grep -o '"balance":[0-9]*' | cut -d':' -f2 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ LNbits API working! Wallet balance: $BALANCE sats${NC}"
else
    echo -e "${RED}❌ LNbits API test failed${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Ready for Django Testing!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🌐 Services Running:"
echo "   LNbits Web:  http://127.0.0.1:5000"
echo "   LNbits API:  http://127.0.0.1:5000/docs"
echo ""
echo "🔑 API Keys for Django:"
echo "   Admin Key:   02dcd77469ac4359a1a96fc6ba7cb551"
echo "   Invoice Key: 93560f547adb4f3b97cb1777a061a788"
echo ""
echo "📊 Current Status:"
echo "   Bitcoin: $(check_port 18443 && echo "✅ Running" || echo "❌ Down")"
echo "   LND:     $(check_port 8080 && echo "✅ Running" || echo "❌ Down")"
echo "   LNbits:  $(check_port 5000 && echo "✅ Running (PID: $LNBITS_PID)" || echo "❌ Down")"
echo ""
echo "🛑 To stop LNbits: kill $LNBITS_PID"
echo ""
echo -e "${GREEN}🚀 Your Django Lightning backend is ready to test!${NC}"

# Stay in original directory if run from elsewhere
cd - >/dev/null 2>&1 || true