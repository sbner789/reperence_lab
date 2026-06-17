import useMarketGuideViewer from "@/hooks/useMarketGuideViewer";

const MarketGuideViewer = () => {
    const { svgRef, guideData } = useMarketGuideViewer('/local_data/section_3-2.json');

    return (
        <div className="" style={{ border: "1px solid black", boxSizing: "border-box" }}>
            <svg
                ref={svgRef}
                id="market_map"
                width={1280}
                height={960}
                viewBox={`0 0 ${1280} ${960}`}
            >
            </svg>
        </div>
    )
}
export default MarketGuideViewer;