import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

type StoreShape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  class: string;
  storeName?: string;
};

type MarketGuideData = {
  sectionName: string;
  stores: StoreShape[];
};

type StoreNameEntry = {
  id: string;
  store_name: string;
}

const INITIAL_GUIDE_DATA: MarketGuideData = {
  sectionName: "",
  stores: [],
};

const useMarketGuideViewer = (dataUrl: string) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [guideData, setGuideData] = useState<MarketGuideData>(INITIAL_GUIDE_DATA);

  useEffect(() => {
    const fetchGuideData = async () => {
      const [sectionRes, storeNameRes] = await Promise.all([
        axios.get(dataUrl),
        axios.get("/local_data/test_store_name.json"),
      ]);

      const sectionName = sectionRes.data.section.section_name as string;
      const storesData = sectionRes.data.section.stores as StoreShape[];
      const storeNames = storeNameRes.data as StoreNameEntry[];

      const storeNameMap = new Map(storeNames.map((entry) => [entry.id, entry.store_name]));

      setGuideData({
        sectionName,
        stores: storesData.map((store) => ({
          ...store,
          storeName: storeNameMap.get(store.id) ?? "",
        })),
      })
    }

    fetchGuideData();
  }, [dataUrl])

  useEffect(() => {
    if (!guideData) return;
    const svg = d3.select(svgRef.current);
    let section: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
    // let stores: d3.Selection<d3.BaseType | SVGRectElement, StoreShape, SVGGElement, unknown> | null = null;
    let storeGruops: d3.Selection<d3.BaseType | SVGGElement, StoreShape, SVGGElement, unknown> | null = null;

    svg.selectAll('g').remove();
    svg.selectAll('rect').remove(); 
    svg.selectAll('text').remove(); 

    section = svg.append('g')
      .attr('id', guideData.sectionName);

    storeGruops = section.selectAll('g')
      .data(guideData.stores, (store) => (store as StoreShape).id)
      .join('g')
      .attr('id', (store) => `group-${store.id}`)

    storeGruops.append('rect')
      .attr('id', (store) => store.id)
      .attr('class', (store) => store.class)
      .attr('x', (store) => store.x)
      .attr('y', (store) => store.y)
      .attr('width', (store) => store.width)
      .attr('height', (store) => store.height)
      .attr('fill', (store) => store.fill);

    storeGruops.append('text')
      .attr('x', (store) => store.x + store.width / 2)
      .attr('y', (store) => store.y + store.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 6)
      .attr('writing-mode', (store) =>
        store.height > store.width 
        ? "tb" : ''
      )
      .text((store) => store.storeName ?? '');

  }, [guideData])

  return { svgRef, guideData };
};

export default useMarketGuideViewer;
