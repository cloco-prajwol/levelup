<script setup lang="ts">
import { ref } from 'vue'
import Tr from "./Tr.vue"
const drag = ref(null);
interface DataItem {
  id: string;
  task: string;
  hrs: number;
  price: number;
  discount: number;
  amount: number;
  comment: string;
  parent: string;
  child: number;
}
const initialItems: DataItem[] = [
  {
    id: '1',
    task: 'task 1',
    hrs: 1,
    price: 4000,
    discount: 1,
    amount: 3500,
    comment: 'test 1',
    parent: "",
    child: 0,
  },
  {
    id: '2',
    task: 'task 2',
    hrs: 1,
    price: 1298,
    discount: 7,
    amount: 1012,
    comment: 'test 2',
    parent: "",
    child: 0,
  },
  {
    id: '3',
    task: 'task 3',
    hrs: 1,
    price: 4034,
    discount: 2,
    amount: 3231,
    comment: 'test 3',
    parent: "",
    child: 0,
  },
  {
    id: '4',
    task: 'task 4',
    hrs: 1,
    price: 300,
    discount: 1,
    amount: 150,
    comment: 'test 4',
    parent: "",
    child: 0,
  },
  {
    id: '5',
    task: 'task 5',
    hrs: 1,
    price: 2000,
    discount: 50,
    amount: 1000,
    comment: 'test 5',
    parent: "",
    child: 0,
  },
  {
    id: '6',
    task: 'task 6',
    hrs: 1,
    price: 700,
    discount: 1,
    amount: 600,
    comment: 'test 6',
    parent: "",
    child: 0,
  }
];

// Create a Map from the initial items array
const items = ref(new Map<string, DataItem>(
  initialItems.map(item => [item.id, item])
));

// Example function to get all items
const getAllItems = () => {
  return Array.from(items.value.values())
    .sort((a, b) => a.id.localeCompare(b.id)); // Sort by id
};

interface Payload {
  draggedData: DataItem;
  targetData: DataItem;
}

const changeItemId = (oldId: string, newId: string) => {
  if (items.value.has(oldId)) {
    const item = items.value.get(oldId);
    if (item) {
      items.value.delete(oldId);
      item.id = newId;
      items.value.set(newId, item);
      if (item.child > 0) {
        updateIdFromParentToClild(item, newId, oldId)
      }
    }
  }
};
const handleDrop = async (payload: Payload) => {
  const dragId: string = payload.draggedData.id;
  const targetId: string = payload.targetData.id;
  const drag = items.value.has(dragId) ? items.value.get(dragId) : null


  const target = items.value.has(targetId) ? items.value.get(targetId) : null
  // if (drag && drag?.child > 0) {
  //   return
  // }
  if (target) {
    let string = target.id + '.' + (target.child + 1).toString();
    changeItemId(dragId, string)
    if (drag?.parent) {
      const dpdrag = items.value.has(drag?.parent) ? items.value.get(drag?.parent) : null
      if (dpdrag) {
        sortParentChild(dpdrag)
      }
    }
    const item = items.value.get(string);
    if (item) {
      item.parent = target.id
    }
    target.child += 1
  }

};
interface ParentHeaderData {
  title:string
  amt: number
}
const getHeader = (data: DataItem) => {
  const clone = { ...data };

  let title = data.task;
  let amt = data.amount
  let payload:ParentHeaderData = {title,amt}
  if(data){
     payload = getSendDataToParent(clone,{title,amt},1)
  }
  clone.task = payload.title
  clone.id = '-'
  clone.amount = payload.amt
  return clone

}

const getSendDataToParent = (data:DataItem,payload:ParentHeaderData,level:number) =>{
  for (let i = 1; i <= data.child; i++) {    
    let string = data.id + '.' + (i).toString();
    const item = items.value.get(string);
    if (item) {
      if(level <= 1){
        payload.title += ',' + item.task
      }
      payload.amt += item.amount;
      if(item.child> 0){
        getSendDataToParent({ ...item },payload,level+1)
      }
    }
  }
  return payload
}
interface SortPayload {
  newId: string;
  data: DataItem;
}
const updateIdFromParentToClild = (data: DataItem, newId: string, oldId: string) => {
  if (data.child > 0) {
    for (let i = 1; i <= data.child; i++) {
      let string = newId + '.' + (i).toString();
      const item = items.value.get(oldId + '.' + (i).toString());
      changeItemId(oldId + '.' + (i).toString(), string)
      if (item) {
        item.parent = newId
        updateIdFromParentToClild({ ...item }, string, oldId + '.' + (i).toString())
      }
    }
  }
}
const sortParentChild = (item: DataItem) => {
  let i = 1;
  let child = item.child;
  let oldId = 1;
  while (child > 0) {
    let string = item.id + '.' + (oldId).toString();
    if (!items.value.has(string)) {
      item.child -= 1;
    } else {
      let sortitem = { ...items.value.get(string) }
      handelSort(
        {
          newId: item.id + '.' + (i).toString(),
          data: sortitem
        }
      )
      i += 1
    }
    oldId += 1
    child -= 1
  }
}
const handelSort = (payload: SortPayload) => {

  if (!(getAllItems.length < parseInt(payload.newId))) {
    return 'no'
  } else {
    let oldId: string = payload.data.id;
    changeItemId(payload.newId, 'tmp')
    changeItemId(payload.data.id, payload.newId)
    updateIdFromParentToClild(payload.data, payload.newId, oldId);

    changeItemId('tmp', oldId)

  }
}
const isHeader = (data: DataItem) => {
  return true
  if (data.child > 0) {
    if (data.id.length == 1) {
      return true
    }
    return false
  }
  return false
}
</script>

<template>
  <main>
    <div
      class="flex min-h-screen items-center justify-center min-h-screen from-purple-200 via-purple-300 to-purple-500 bg-gradient-to-br">
      <div class="flex items-center justify-center min-h-[450px]">

        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">ID</th>

              <th scope="col" class="py-3 px-6">task</th>
              <th scope="col" class="py-3 px-6">hour</th>
              <th scope="col" class="py-3 px-6">price</th>
              <th scope="col" class="py-3 px-6">discount</th>
              <th scope="col" class="py-3 px-6">amt</th>
              <th scope="col" class="py-3 px-6">comment</th>
            </tr>
          </thead>
          <tbody class="drop-zone">
            <template v-for="data in getAllItems()">
              <Tr :data="getHeader(data)" @updateData="handleDrop" v-if="data.child > 0 && isHeader(data)"></Tr>
              <Tr :data="data" @updateData="handleDrop" @handelSort="handelSort"></Tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

  </main>

</template>
