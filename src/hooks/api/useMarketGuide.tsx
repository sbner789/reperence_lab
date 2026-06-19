import axios from "axios";
import { useEffect, useState } from "react";

type MarketGuideMap = {
   sector: string;
   sections: [];
};

type StoreDataShape = {
    id: string;
    store_name: string;
};

const useMarketGuide = () => {
    const [marketGuide, setMarketGuide] = useState<MarketGuideMap[]>();
    const [storeData, setStoreData] = useState<StoreDataShape[]>();

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