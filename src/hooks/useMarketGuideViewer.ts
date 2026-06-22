import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import useMarketGuide from './api/useMarketGuide';
import type { MarketGuideSector, MarketGuideSection, StoreShape } from './api/useMarketGuide';

const useMarketGuideViewer = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { marketGuide, storeData } = useMarketGuide();

  const storeNameMap = useMemo(
    () => new Map((storeData ?? []).map((entry) => [entry.id, entry.store_name])),
    [storeData]
  );

  useEffect(() => {
    if (!marketGuide) return;
    const svg = d3.select(svgRef.current);

    const sectorGroups = svg
      .selectAll<SVGGElement, MarketGuideSector>('g.sector')
      .data(marketGuide, (sector) => sector.sector)
      .join('g')
      .attr('class', 'sector')
      .attr('id', (sector) => sector.sector);

    const sectionGroups = sectorGroups
      .selectAll<SVGGElement, MarketGuideSection>('g.section')
      .data((sector) => sector.sections, (section) => section.section_name)
      .join('g')
      .attr('class', 'section')
      .attr('id', (section) => section.section_name);

    const storeGroups = sectionGroups
      .selectAll<SVGGElement, StoreShape>('g.store')
      .data((section) => section.stores, (store) => store.id)
      .join('g')
      .attr('class', 'store')
      .attr('id', (store) => store.id);

    storeGroups
      .selectAll<SVGRectElement, StoreShape>('rect')
      .data((store) => [store])
      .join('rect')
      .attr('x', (store) => store.x)
      .attr('y', (store) => store.y)
      .attr('width', (store) => store.width)
      .attr('height', (store) => store.height)
      .attr('fill', (store) => store.fill)
      .attr('stroke', (store) => store.stroke);

    storeGroups
      .selectAll<SVGTextElement, StoreShape>('text')
      .data((store) => [store])
      .join('text')
      .attr('x', (store) => store.x + store.width / 2)
      .attr('y', (store) => store.y + store.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 6)
      .attr('writing-mode', (store) => (store.height > store.width ? 'tb' : ''))
      .text((store) => storeNameMap.get(store.id) ?? '');
  }, [marketGuide, storeNameMap]);

  return { svgRef };
};

export default useMarketGuideViewer;
