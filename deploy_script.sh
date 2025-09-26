#!/bin/bash

echo "Starting contract deployment..."
echo "This will deploy your sBTC-Streamr contract to Stacks Testnet"
echo ""

# Check if we're in the right directory
if [ ! -f "contracts/sBTC-Streamr.clar" ]; then
    echo "Error: Contract file not found. Please run this script from the sBTC-Streamr directory."
    exit 1
fi

# Check if deployment plan exists
if [ ! -f "deployments/default.testnet-plan.yaml" ]; then
    echo "Error: Deployment plan not found."
    exit 1
fi

echo "Contract file found: contracts/sBTC-Streamr.clar"
echo "Deployment plan found: deployments/default.testnet-plan.yaml"
echo ""

# Try to deploy
echo "Attempting deployment..."
echo "y" | clarinet deployment apply -p deployments/default.testnet-plan.yaml

echo ""
echo "Deployment attempt completed."
echo "If successful, your contract will be available at:"
echo "ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.sBTC-Streamr"
