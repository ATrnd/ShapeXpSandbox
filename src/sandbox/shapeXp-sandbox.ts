/**
* @title ShapeXp Sandbox API
* @notice Developer interface for ShapeXp integration and data access
* @dev Provides global window.ShapeXpAPI object with core functionality
* @custom:module-hierarchy Integration API Component
*/

import { ShapeXpHelpers } from '../utils/shapexp-helpers';
import { getCurrentAddress } from '../utils/provider';
import { NFTMetadata } from '../features/nft/nft-fetching';


/**
* @title ShapeXp Sandbox Interface
* @notice Core class exposing ShapeXp functionality to external applications
* @dev Implements window.ShapeXpAPI interface for developer access
* @custom:interface Global ShapeXpAPI object
*/
export class ShapeXpSandbox {
    constructor() {
        /**
         * @notice Gets current account's ShapeXp amount
         * @dev Retrieves formatted experience from AppState
         * @return Promise<string> Formatted ShapeXp amount
         * @custom:requires Connected wallet
         * @custom:example
         * const xp = await ShapeXpAPI.getShapeXp();
         * console.log('Current ShapeXp:', xp);
         */
        window.ShapeXpAPI = {
            // Get current ShapeXp amount
            getShapeXp: async () => {
                const appState = (window as any).appState;
                return appState.getFormattedExperience();
            },

            /**
             * Get all NFTs for current address or specified address
             */
            getNFTs: async (address?: string) => {
                try {
                    const targetAddress = address || await getCurrentAddress();
                    const nfts = await ShapeXpHelpers.getNFTs(targetAddress);
                    return {
                        success: true,
                        nfts
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: 'Failed to fetch NFTs'
                    };
                }
            },

           /**
            * @notice Subscribes to ShapeXp amount changes
            * @dev Sets up event listener for shapexp-update events
            * @param callback Function to execute when ShapeXp changes
            * @custom:events shapexp-update
            * @custom:example
            * ShapeXpAPI.onShapeXpChange((amount) => {
            *   console.log('ShapeXp updated:', amount);
            * });
            */
            onShapeXpChange: (callback: (amount: string) => void) => {
                document.addEventListener('shapexp-update', (e: any) => {
                    callback(e.detail.experience);
                });
            },

           /**
            * @notice Checks if current wallet owns ShapeXp NFT
            * @dev Verifies NFT ownership for connected address
            * @return Promise<boolean> True if wallet owns ShapeXp NFT
            * @custom:requires Connected wallet
            * @custom:example
            * const hasNFT = await ShapeXpAPI.hasShapeXp();
            * console.log('Has ShapeXp NFT:', hasNFT);
            */
            hasShapeXp: async () => {
                const address = await getCurrentAddress();
                return ShapeXpHelpers.ownsShapeXp(address);
            },

           /**
            * @notice Looks up ShapeXp amount for any address
            * @dev Fetches and formats experience points for specified address
            * @param address Ethereum address to look up
            * @return Promise<Object> Success status and ShapeXp data
            * @custom:returns
            * - success: true/false
            * - amount: Formatted ShapeXp amount (if success)
            * - raw: Raw ShapeXp amount (if success)
            * - error: Error message (if !success)
            * @custom:example
            * const data = await ShapeXpAPI.shapeXpLookup("0x123...");
            * if (data.success) {
            *   console.log('ShapeXp amount:', data.amount);
            * }
            */
            shapeXpLookup: async (address: string) => {
                try {
                    const { experience, formatted } = await ShapeXpHelpers.getExperience(address);
                    return {
                        success: true,
                        amount: formatted,
                        raw: experience.toString()
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: 'Failed to fetch ShapeXp'
                    };
                }
            },

           /**
            * @notice Checks ShapeXp NFT ownership for any address
            * @dev Verifies if specified address owns ShapeXp NFT
            * @param address Ethereum address to check
            * @return Promise<Object> Success status and ownership data
            * @custom:returns
            * - success: true/false
            * - hasNFT: Ownership status (if success)
            * - error: Error message (if !success)
            * @custom:example
            * const data = await ShapeXpAPI.shapeXpLookupNFT("0x123...");
            * if (data.success) {
            *   console.log('Owns ShapeXp NFT:', data.hasNFT);
            * }
            */
            shapeXpLookupNFT: async (address: string) => {
                try {
                    const hasNFT = await ShapeXpHelpers.ownsShapeXp(address);
                    return {
                        success: true,
                        hasNFT
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: 'Failed to check NFT ownership'
                    };
                }
            },

        };
    }
}

// Initialize sandbox
new ShapeXpSandbox();

/**
* @notice Global type definitions for ShapeXpAPI
* @dev Extends Window interface with ShapeXpAPI types
* @custom:api-methods
* - getShapeXp
* - onShapeXpChange
* - hasShapeXp
* - shapeXpLookup
* - shapeXpLookupNFT
*/
declare global {
    interface Window {
        ShapeXpAPI: {
            getShapeXp: () => Promise<string>;
            onShapeXpChange: (callback: (amount: string) => void) => void;
            hasShapeXp: () => Promise<boolean>;
            shapeXpLookup: (address: string) => Promise<{
                success: true;
                amount: string;
                raw: string;
            } | {
                success: false;
                error: string;
            }>;
            shapeXpLookupNFT: (address: string) => Promise<{
                success: true;
                hasNFT: boolean;
            } | {
                success: false;
                error: string;
            }>;
            getNFTs: (address?: string) => Promise<{
                success: true;
                nfts: NFTMetadata[];
            } | {
                success: false;
                error: string;
            }>;
        }
    }
}
