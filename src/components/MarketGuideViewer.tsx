import useMarketGuideViewer from "@/hooks/useMarketGuideViewer";

const MarketGuideViewer = () => {
    const { svgRef } = useMarketGuideViewer();

    return (
        <div className="" style={{ border: "1px solid black", boxSizing: "border-box" }}>
            <svg
                ref={svgRef}
                id="market_map"
                width={1920}
                height={1080}
                viewBox={`0 0 ${1920} ${1080}`}
            >
            </svg>
        </div>
    )
}
export default MarketGuideViewer;