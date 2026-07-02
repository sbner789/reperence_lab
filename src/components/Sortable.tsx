import '@/assets/sortable.css';
import useSortable from '@/hooks/useSortable';

type FilterItem = {
  columnName: string;
  isVisible: boolean;
  orderIndex: number;
}

const filter = [
  {
    "columnName": "uplink_message_id",
    "isVisible": true,
    "orderIndex": 0
  },
  {
    "columnName": "report_type",
    "isVisible": true,
    "orderIndex": 1
  },
  {
    "columnName": "fire_status",
    "isVisible": true,
    "orderIndex": 2
  },
  {
    "columnName": "battery_status",
    "isVisible": true,
    "orderIndex": 3
  },
  {
    "columnName": "heat_temp",
    "isVisible": true,
    "orderIndex": 4
  },
  {
    "columnName": "smoke_density",
    "isVisible": true,
    "orderIndex": 5
  },
  {
    "columnName": "co2",
    "isVisible": true,
    "orderIndex": 6
  },
  {
    "columnName": "tvoc",
    "isVisible": true,
    "orderIndex": 7
  },
  {
    "columnName": "ambient_temp",
    "isVisible": true,
    "orderIndex": 8
  },
  {
    "columnName": "humidity",
    "isVisible": true,
    "orderIndex": 9 
  },
  {
    "columnName": "movementStatus",
    "isVisible": true,
    "orderIndex": 10
  },
  {
    "columnName": "reportInterval",
    "isVisible": true,
    "orderIndex": 11
  },
  {
    "columnName": "gasBaseline",
    "isVisible": true,
    "orderIndex": 12
  },
  {
    "columnName": "gasResistance",
    "isVisible": true,
    "orderIndex": 13
  },
  {
    "columnName": "shopId",
    "isVisible": true,
    "orderIndex": 14
  },
  {
    "columnName": "shopName",
    "isVisible": true,
    "orderIndex": 15
  }
] as FilterItem[];

const Sortable = () => {
    const {
        sortableList,
        scrollContainerRef,
        handleDragColumn,
        handleDragOver,
        handleDropColumn,
        updateItem
    } = useSortable<FilterItem>({
        initialConfig: { 
            list: filter, 
            keyName: 'orderIndex', 
            content: [
                'columnName', 
                'isVisible', 
                'orderIndex'
            ]
        }});

    return (
        <div className='sortableWrapper'>
            <div className='sortable' ref={scrollContainerRef}>
               {
                sortableList.map((item) => (
                    <div key={item.orderIndex} className='sortable_item'
                        onDragStart={(e) => handleDragColumn(e, item.orderIndex)}
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) => handleDropColumn(e, item.orderIndex)}
                        draggable
                        // draggable={item.isVisible}
                    >
                        <div className='sortable_item_content'>
                            <img src="" />
                            <span>{item.columnName}</span>
                        </div>
                        <div
                            className={item.isVisible ? 'toggle_filter_active' : 'toggle_filter_deactivate'}
                            onClick={() => updateItem(item.orderIndex, { isVisible: !item.isVisible })}
                        >
                            <div className='toggle_knob' />
                        </div>
                    </div>
                ))
               }
            </div>
        </div>
    )
}
export default Sortable