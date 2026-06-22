# MarketGuideViewer d3 Nested Data Join 고도화

## 배경

`useMarketGuideViewer`의 데이터 구조는 `sector → sections → stores`로 3단계 중첩되어 있음. 기존 구현은 이 구조를 `.map()`을 3중으로 직접 순회하면서 매번 `.append('g')`로 그룹을 수동 생성하는 방식이었음.

```typescript
marketGuide.map((par) => {
  sectorGroup = svg.append('g').attr('id', par.sector);

  par.sections.map((cil) => {
    sectionGroup = sectorGroup?.append('g').attr('id', cil.section_name);

    cil.stores.map((store) => {
      storeGroup = sectionGroup?.append('g').attr('id', store.id);
      storeGroup?.append('rect')...

      storeData?.map((text) => {
        if (store.id === text.id) {
          storeGroup?.append('text')...
        }
      })
    })
  })
})
```

**문제점**
- `.map()` 중첩이 깊어질수록 가독성 저하
- `storeData?.map()`으로 매장명을 매칭하는 부분은 store마다 전체 storeData 배열을 순회 → O(n × m) 비효율
- `marketGuide`가 갱신될 때마다 `svg.selectAll('g').remove()`로 전체를 지우고 처음부터 다시 그림 → d3의 enter/update/exit 갱신 패턴을 활용하지 못함

---

## 적용한 패턴: Nested Data Join

d3는 계층형 데이터를 다룰 때 각 레벨마다 `selectAll().data().join()`을 반복하는 표준 패턴을 제공함. 상위 selection에 체이닝하면 하위 selection이 부모의 각 데이터 항목별로 자식 데이터를 자동으로 펼쳐서 처리함.

```typescript
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
  ...

storeGroups
  .selectAll<SVGTextElement, StoreShape>('text')
  .data((store) => [store])
  .join('text')
  .attr('x', (store) => store.x + store.width / 2)
  ...
  .text((store) => storeNameMap.get(store.id) ?? '');
```

**구조**
```
svg
 └─ g.sector   (data: marketGuide)
     └─ g.section  (data: sector.sections)
         └─ g.store   (data: section.stores)
             ├─ rect  (data: [store])
             └─ text  (data: [store])
```

### 매장명 매칭 개선

기존: store마다 `storeData` 전체를 순회해서 `id` 일치 여부 확인 (O(n × m))

```typescript
const storeNameMap = useMemo(
  () => new Map((storeData ?? []).map((entry) => [entry.id, entry.store_name])),
  [storeData]
);
// ...
.text((store) => storeNameMap.get(store.id) ?? '');
```

`storeData`가 바뀔 때만 `Map`을 재생성하고, 이후 조회는 O(1)로 처리.

### 타입 공유

`useMarketGuide.tsx`에 `StoreShape`, `MarketGuideSection`, `MarketGuideSector`, `StoreNameEntry` 타입을 `export`하여 데이터를 가져오는 훅(`useMarketGuide`)과 렌더링하는 훅(`useMarketGuideViewer`)이 동일한 타입을 공유하도록 정리함 (`any` 사용 없이).

---

## 효과

| | 기존 (수동 중첩 루프) | 개선 (Nested Data Join) |
|---|---|---|
| 코드 구조 | `.map()` 3중 중첩 + 수동 `.append('g')` | 계층별 `selectAll().data().join()` 반복 |
| 매장명 매칭 | store마다 storeData 전체 순회 (O(n×m)) | `Map` 조회 (O(1)) |
| 데이터 갱신 시 | 전체 DOM 제거 후 재생성 | d3가 enter/update/exit로 처리 |
| 타입 안정성 | 훅마다 타입 중복 정의 | 타입 공유로 일관성 확보 |
