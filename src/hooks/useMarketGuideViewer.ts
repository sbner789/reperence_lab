import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import useMarketGuide from './api/useMarketGuide';

type StoreDataShape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  storeName: string;
  stroke: string;
  strokeWidth:string;
};

type MarketGuideSection = {
  section_name: string;
  stores: Partial<StoreDataShape>[];
}

const useMarketGuideViewer = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { marketGuide, storeData } = useMarketGuide();

  useEffect(() => {
    if(!marketGuide) return;
    const svg = d3.select(svgRef.current);
    let parantGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
    //let childGroup: d3.Selection<SVGGElement, unknown, null, undefined> | undefined = undefined;

    svg.selectAll('g').remove();
    svg.selectAll('rect').remove();

    marketGuide.map((par) => {
      const sector = par.sector as string;
      const sections = par.sections as MarketGuideSection[]; 
      parantGroup = svg.append('g')
        .attr('id', sector);

      const childGroup = parantGroup?.selectAll('g')
        .data(sections, (section) => (section as MarketGuideSection).section_name)
          .join('g')
          .attr('id', (store) => store.section_name)

      childGroup?.selectAll('rect')
        .data(sections, (section) => (section as any).stores)
          .join('rect')
          // .attr('id', (store) => store.id)
        


      // sections.map((cil) => {
      //   const sectionName = cil.section_name;
      //   const stores = cil.stores;

      //   childGroup = parantGroup?.append('g')
      //     .attr('id', sectionName);

      //   stores.map((store) => {
      //     childGroup?.append("rect")
      //       .attr('id', store.id as string)
      //       .attr('x', store.x as number)
      //       .attr('y', store.y as number)
      //       .attr('width', store.width as number)
      //       .attr('height', store.height as number)
      //       .attr('fill', store.fill as string)
      //       .attr('stroke', store.stroke as string) 
      //   })
      // })
    })
  }, [marketGuide])
 
  // useEffect(() => {
  //   if (!marketGuide) return;
  //   const svg = d3.select(svgRef.current);
  //   let parantGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  //   let childGroup: d3.Selection<SVGGElement, unknown, null, undefined> | undefined = undefined
  //   let sections = [] as MarketGuideSection[];
  
  //   svg.selectAll('g').remove();
  //   svg.selectAll('rect').remove();

  //   marketGuide.map((el) => {
  //     parantGroup = svg.append('g')
  //       .attr('id', el.group);

  //     const sectionMeta = el.sections as MarketGuideSection[];
  //     sections.push(...sectionMeta);
  //   });

  //   sections.map((el) => {
  //     childGroup = parantGroup?.append('g')
  //       .attr('id', el.section_name);
      
  //     el.stores.map((els) => {
  //       childGroup?.append("rect")
  //         .attr('id', els.id as string)
  //         .attr('x', els.x as number)
  //         .attr('y', els.y as number)
  //         .attr('width', els.width as number)
  //         .attr('height', els.height as number)
  //         .attr('fill', els.fill as string)
  //         .attr('stroke', els.stroke as string)  
  //     })
  //   });

  // }, [marketGuide])

  return { svgRef };
};

export default useMarketGuideViewer;
