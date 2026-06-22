import axios from "axios";
import { useEffect, useState } from "react";

export type StoreShape = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    "stroke-width": string;
};

export type MarketGuideSection = {
    section_name: string;
    stores: StoreShape[];
};

export type MarketGuideSector = {
    sector: string;
    sections: MarketGuideSection[];
};

export type StoreNameEntry = {
    id: string;
    store_name: string;
};

const useMarketGuide = () => {
    const [marketGuide, setMarketGuide] = useState<MarketGuideSector[]>();
    const [storeData, setStoreData] = useState<StoreNameEntry[]>();

    useEffect(() => {
        const fetchMarketGuide = async () => {
            const [ getMarketGuide, getStoreName ] = await Promise.all([
                axios.get("/local_data/sector.json"),
                axios.get("/local_data/test_store_name.json")
            ]);
            const guideMetaInfo = getMarketGuide.data;
            const storeName = getStoreName.data;

            setMarketGuide(guideMetaInfo);
            setStoreData(storeName);
        };
        fetchMarketGuide();
    }, [])

    return { marketGuide, storeData }
}
export default useMarketGuide;